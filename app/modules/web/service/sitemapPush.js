/**
 * Sitemap 自动推送服务
 * 每天定时向搜索引擎推送 sitemap 更新通知
 * 支持：百度、Google、Bing、神马、头条
 */

class SitemapPushService {
  constructor() {
    this.lastPushTime = null;
    this.timer = null;
  }

  /**
   * 启动定时推送：每天 0 点执行一次
   */
  start() {
    this.scheduleNextRun();
    console.log("[SitemapPush] 已启动，每天 00:00 自动推送一次");
  }

  /**
   * 计算到下一个 0 点的延迟并定时执行，执行后重新排期
   */
  scheduleNextRun() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 0, 0); // 下一个 0 点（服务器本地时间）
    const delay = next.getTime() - now.getTime();

    console.log(`[SitemapPush] 下次推送时间: ${next.toLocaleString()}`);

    this.timer = setTimeout(() => {
      this.pushAll();
      this.scheduleNextRun(); // 推送后排下一天
    }, delay);
  }

  /**
   * 停止定时推送
   */
  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * 推送到所有搜索引擎
   */
  async pushAll() {
    const site = Chan.config.data?.site;
    const domain = site?.domain || "www.chancms.top";
    const sitemapUrl = `https://${domain}/sitemap.xml`;

    console.log(`[SitemapPush] 开始推送 sitemap: ${sitemapUrl}`);

    const results = await Promise.allSettled([
      this.pingGoogle(sitemapUrl),
      this.pingBing(sitemapUrl),
      this.pingBaidu(domain),
      this.ping360(domain),
    ]);

    const names = ["Google", "Bing", "百度", "360"];
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`[SitemapPush] ${names[index]}: ${result.value}`);
      } else {
        console.log(`[SitemapPush] ${names[index]}: 失败 - ${result.reason}`);
      }
    });

    this.lastPushTime = new Date();
    console.log(`[SitemapPush] 推送完成 ${this.lastPushTime.toISOString()}`);
  }

  /**
   * Google Indexing API (通过 sitemap 提交)
   * Google 已弃用 ping 接口，改为直接提交 sitemap 到 Search Console
   * 这里保留为日志记录，实际通过 Search Console 自动抓取
   */
  async pingGoogle(sitemapUrl) {
    try {
      // Google 已弃用 ping 接口(2023)，sitemap 通过 Search Console 自动发现
      // 保留此方法作为记录，不再主动 ping
      return "跳过（Google已弃用ping接口，请通过Search Console提交sitemap）";
    } catch (err) {
      return `失败: ${err.message}`;
    }
  }

  /**
   * Bing IndexNow 推送
   * Bing 已弃用 ping 接口，改用 IndexNow 协议
   * https://www.indexnow.org/
   */
  async pingBing(sitemapUrl) {
    try {
      const domain = sitemapUrl.replace(/https?:\/\//, '').split('/')[0];
      
      // 获取最近24小时新文章URL
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const articles = await Chan.db("cms_article as a")
        .select(["a.id", "c.path"])
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .where("a.status", 0)
        .where("a.createdAt", ">", yesterday)
        .orderBy("a.createdAt", "desc")
        .limit(100);

      if (articles.length === 0) {
        return "跳过（无新文章）";
      }

      const urls = articles.map(a => `https://${domain}${a.path}/article-${a.id}.html`);

      // IndexNow 协议推送
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: domain,
          key: "chancms2026indexnow",
          keyLocation: `https://${domain}/chancms2026indexnow.txt`,
          urlList: urls,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (res.ok || res.status === 202) {
        return `IndexNow 推送成功 ${urls.length} 条URL`;
      }
      return `IndexNow HTTP ${res.status}`;
    } catch (err) {
      return `失败: ${err.message}`;
    }
  }

  /**
   * 确保百度推送进度表存在（记录已推送过的文章，避免重复、支持按最老→最新顺序推进）
   */
  async ensurePushTable() {
    const exists = await Chan.db.schema.hasTable("cms_seo_push");
    if (!exists) {
      await Chan.db.schema.createTable("cms_seo_push", (t) => {
        t.increments("id").primary();
        t.integer("articleId").notNullable().comment("文章id");
        t.string("engine", 20).notNullable().defaultTo("baidu").comment("搜索引擎");
        t.string("url", 500).comment("推送的URL");
        t.dateTime("pushedAt").comment("推送时间");
        t.index(["engine", "articleId"], "idx_engine_article");
      });
    }
  }

  /**
   * 百度主动推送（普通收录）
   * 从最老的文章开始，按时间从早到晚每天推 N 条，推过的不再重复，逐步覆盖全站。
   * 需要在百度站长平台获取 token：https://ziyuan.baidu.com/linksubmit/index
   */
  async pingBaidu(domain) {
    try {
      const token = (process.env.BAIDU_PUSH_TOKEN || Chan.config.baiduPushToken || "").trim();
      if (!token) {
        return "跳过（未配置 baiduPushToken）";
      }

      // 每天推送数量（默认10条，可用 BAIDU_PUSH_LIMIT 调整）
      const baiduLimit = parseInt(process.env.BAIDU_PUSH_LIMIT) || 10;

      await this.ensurePushTable();

      // 已推送过的文章 id
      const pushedIds = await Chan.db("cms_seo_push")
        .where("engine", "baidu")
        .pluck("articleId");

      // 取最老的、尚未推送的文章，按 createdAt 从早到晚
      const articles = await Chan.db("cms_article as a")
        .select(["a.id", "c.path"])
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .where("a.status", 0)
        .whereNotIn("a.id", pushedIds.length ? pushedIds : [0])
        .orderBy("a.createdAt", "asc")
        .limit(baiduLimit);

      if (articles.length === 0) {
        return "跳过（全部已推送完毕）";
      }

      let batch = articles.map(a => ({
        id: a.id,
        url: `https://${domain}${a.path}/article-${a.id}.html`,
      }));
      const apiUrl = `http://data.zz.baidu.com/urls?site=https://${domain}&token=${token}`;

      // 百度每日配额有限，整批超过剩余配额会返回 over quota（一条都不进）。
      // 因此遇到 over quota 时自动减半重试，尽量把能推的先推进去。
      while (batch.length > 0) {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: batch.map(b => b.url).join("\n"),
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();

        if (data.success !== undefined) {
          // 记录本批已推送，下次从更新的文章接着推
          const now = new Date();
          await Chan.db("cms_seo_push").insert(
            batch.map(b => ({ articleId: b.id, engine: "baidu", url: b.url, pushedAt: now }))
          );
          return `成功推送 ${data.success} 条（最老优先 id:${batch[0].id}~${batch[batch.length - 1].id}），今日剩余配额 ${data.remain ?? "未知"}`;
        }

        if (data.message === "over quota" && batch.length > 1) {
          // 每次减 1 重试，精确推到剩余配额上限，不浪费配额
          batch = batch.slice(0, batch.length - 1);
          continue;
        }

        return `响应: ${JSON.stringify(data)}`;
      }

      return "跳过（配额不足，无法推送）";
    } catch (err) {
      return `失败: ${err.message}`;
    }
  }
  /**
   * 360搜索推送
   * 360站长平台支持 sitemap 提交和URL提交
   * 提交入口：https://zhanzhang.so.com/sitetool/sitemap
   * 同时通过访问360收录提交接口推送新URL
   */
  async ping360(domain) {
    try {
      // 获取最近24小时新文章
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const articles = await Chan.db("cms_article as a")
        .select(["a.id", "c.path"])
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .where("a.status", 0)
        .where("a.createdAt", ">", yesterday)
        .orderBy("a.createdAt", "desc")
        .limit(50);

      if (articles.length === 0) {
        return "跳过（无新文章）";
      }

      // 逐个提交到360收录（通过site_submit接口）
      let successCount = 0;
      for (const a of articles) {
        try {
          const articleUrl = `https://${domain}${a.path}/article-${a.id}.html`;
          const submitUrl = `https://info.so.360.cn/site_submit.html?url=${encodeURIComponent(articleUrl)}`;
          const res = await fetch(submitUrl, {
            method: "GET",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            signal: AbortSignal.timeout(5000),
          });
          if (res.ok) successCount++;
        } catch (e) {
          // 单条失败不影响整体
        }
      }

      return `提交 ${successCount}/${articles.length} 条URL`;
    } catch (err) {
      return `失败: ${err.message}`;
    }
  }
}

export default new SitemapPushService();
