/**
 * Sitemap 自动推送服务（每天 00:00 执行）
 * 优先级：百度 > Bing > 360 > Google
 * - 百度：新文章优先 + 存量回填，受每日配额限制（over quota 自动减量）
 * - Bing：IndexNow 批量推送存量未推 URL（日限很高，可快速覆盖）
 * - 360：逐条提交存量未推 URL（数量受限）
 * - Google：已弃用 ping，靠 Search Console 抓取 sitemap，跳过
 * 进度统一记录在 cms_seo_push（engine 区分），避免重复推送。
 */

class SitemapPushService {
  constructor() {
    this.lastPushTime = null;
    this.timer = null;
  }

  start() {
    this.scheduleNextRun();
    console.log("[SitemapPush] 已启动，每天 00:00 自动推送一次");
  }

  scheduleNextRun() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 0, 0);
    const delay = next.getTime() - now.getTime();
    console.log(`[SitemapPush] 下次推送时间: ${next.toLocaleString()}`);
    this.timer = setTimeout(() => {
      this.pushAll();
      this.scheduleNextRun();
    }, delay);
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /** 进度表：记录每篇文章在各搜索引擎的推送情况 */
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

  /** 取某引擎尚未推送的文章（whereNotExists 避免大 IN 列表） */
  async getUnpushed(engine, order, limit, excludeIds = []) {
    let q = Chan.db("cms_article as a")
      .select(["a.id", "c.path"])
      .leftJoin("cms_category as c", "a.cid", "c.id")
      .whereNotExists(function () {
        this.select("*")
          .from("cms_seo_push as p")
          .whereRaw("p.articleId = a.id")
          .andWhere("p.engine", engine);
      })
      .where("a.status", 0)
      .orderBy("a.createdAt", order)
      .limit(limit);
    if (excludeIds.length) q = q.whereNotIn("a.id", excludeIds);
    return await q;
  }

  toUrls(domain, rows) {
    return rows.map((a) => ({ id: a.id, url: `https://${domain}${a.path}/article-${a.id}.html` }));
  }

  async recordPushed(engine, batch) {
    if (!batch.length) return;
    const now = new Date();
    await Chan.db("cms_seo_push").insert(
      batch.map((b) => ({ articleId: b.id, engine, url: b.url, pushedAt: now }))
    );
  }

  /** 推送到所有搜索引擎（按优先级顺序串行） */
  async pushAll() {
    const site = Chan.config.data?.site;
    const domain = site?.domain || "www.chancms.top";
    await this.ensurePushTable();
    console.log(`[SitemapPush] 开始推送 https://${domain}/sitemap.xml`);

    const tasks = [
      ["百度", () => this.pingBaidu(domain)],
      ["Bing", () => this.pingBing(domain)],
      ["360", () => this.ping360(domain)],
      ["Google", () => this.pingGoogle(domain)],
    ];
    for (const [name, fn] of tasks) {
      try {
        const r = await fn();
        console.log(`[SitemapPush] ${name}: ${r}`);
      } catch (err) {
        console.log(`[SitemapPush] ${name}: 失败 - ${err.message}`);
      }
    }

    this.lastPushTime = new Date();
    console.log(`[SitemapPush] 推送完成 ${this.lastPushTime.toISOString()}`);
  }

  /**
   * 百度主动推送：新文章优先 + 存量回填，受每日配额限制
   */
  async pingBaidu(domain) {
    const token = (process.env.BAIDU_PUSH_TOKEN || Chan.config.baiduPushToken || "").trim();
    if (!token) return "跳过（未配置 baiduPushToken）";

    const limit = parseInt(process.env.BAIDU_PUSH_LIMIT) || 10;
    const newCount = Math.ceil(limit / 2); // 一半给新文章
    const newest = this.toUrls(domain, await this.getUnpushed("baidu", "desc", newCount));
    const oldCount = limit - newest.length; // 剩余配额回填存量
    const oldest = this.toUrls(
      domain,
      await this.getUnpushed("baidu", "asc", oldCount, newest.map((b) => b.id))
    );
    let batch = [...newest, ...oldest];
    if (batch.length === 0) return "跳过（全部已推送）";

    const apiUrl = `http://data.zz.baidu.com/urls?site=https://${domain}&token=${token}`;
    while (batch.length > 0) {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: batch.map((b) => b.url).join("\n"),
        signal: AbortSignal.timeout(10000),
      });
      const data = await res.json();
      if (data.success !== undefined) {
        await this.recordPushed("baidu", batch);
        return `成功推送 ${data.success} 条（新${newest.length}+回填${oldest.length}），今日剩余配额 ${data.remain ?? "未知"}`;
      }
      if (data.message === "over quota" && batch.length > 1) {
        batch = batch.slice(0, batch.length - 1); // 减 1 重试，吃满配额
        continue;
      }
      return `响应: ${JSON.stringify(data)}`;
    }
    return "跳过（配额不足）";
  }

  /**
   * Bing IndexNow：批量推送存量未推 URL（日限很高，可快速覆盖）
   */
  async pingBing(domain) {
    const limit = parseInt(process.env.BING_PUSH_LIMIT) || 1000;
    const batch = this.toUrls(domain, await this.getUnpushed("bing", "asc", limit));
    if (batch.length === 0) return "跳过（全部已推送）";

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: domain,
        key: "chancms2026indexnow",
        keyLocation: `https://${domain}/chancms2026indexnow.txt`,
        urlList: batch.map((b) => b.url),
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok || res.status === 202) {
      await this.recordPushed("bing", batch);
      return `IndexNow 推送成功 ${batch.length} 条`;
    }
    return `IndexNow HTTP ${res.status}`;
  }

  /**
   * 360 收录：逐条提交存量未推 URL（数量受限）
   */
  async ping360(domain) {
    const limit = parseInt(process.env.SO360_PUSH_LIMIT) || 50;
    const batch = this.toUrls(domain, await this.getUnpushed("360", "asc", limit));
    if (batch.length === 0) return "跳过（全部已推送）";

    let ok = 0;
    const pushed = [];
    for (const b of batch) {
      try {
        const submitUrl = `https://info.so.360.cn/site_submit.html?url=${encodeURIComponent(b.url)}`;
        const res = await fetch(submitUrl, {
          method: "GET",
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          ok++;
          pushed.push(b);
        }
      } catch (e) {
        // 单条失败忽略，下次重试
      }
    }
    await this.recordPushed("360", pushed);
    return `提交 ${ok}/${batch.length} 条`;
  }

  /**
   * Google：已弃用 ping 接口，靠 Search Console 自动抓取 sitemap
   */
  async pingGoogle() {
    return "跳过（已弃用ping，通过 Search Console 提交 sitemap）";
  }
}

export default new SitemapPushService();
