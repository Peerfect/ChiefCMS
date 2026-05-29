/**
 * Sitemap 自动推送服务
 * 每天定时向搜索引擎推送 sitemap 更新通知
 * 支持：百度、Google、Bing、神马、头条
 */

class SitemapPushService {
  constructor() {
    this.lastPushTime = null;
    this.pushInterval = 24 * 60 * 60 * 1000; // 24小时
    this.timer = null;
  }

  /**
   * 启动定时推送
   */
  start() {
    // 启动后延迟5分钟执行第一次推送（等待服务完全启动）
    setTimeout(() => {
      this.pushAll();
      // 之后每24小时推送一次
      this.timer = setInterval(() => this.pushAll(), this.pushInterval);
    }, 5 * 60 * 1000);

    console.log("[SitemapPush] 已启动，每24小时自动推送一次");
  }

  /**
   * 停止定时推送
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
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
   * Google Ping
   * https://www.google.com/ping?sitemap=URL
   */
  async pingGoogle(sitemapUrl) {
    try {
      const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(10000) });
      return res.ok ? "成功" : `HTTP ${res.status}`;
    } catch (err) {
      return `失败: ${err.message}`;
    }
  }

  /**
   * Bing/IndexNow Ping
   * https://www.bing.com/ping?sitemap=URL
   */
  async pingBing(sitemapUrl) {
    try {
      const url = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(10000) });
      return res.ok ? "成功" : `HTTP ${res.status}`;
    } catch (err) {
      return `失败: ${err.message}`;
    }
  }

  /**
   * 百度主动推送（普通收录）
   * 需要在百度站长平台获取 token
   * https://ziyuan.baidu.com/linksubmit/index
   */
  async pingBaidu(domain) {
    try {
      const token = process.env.BAIDU_PUSH_TOKEN || Chan.config.baiduPushToken;
      if (!token) {
        return "跳过（未配置 baiduPushToken）";
      }

      // 获取最新更新的文章URL（最近24小时内更新的）
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

      const apiUrl = `http://data.zz.baidu.com/urls?site=https://${domain}&token=${token}`;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: urls.join("\n"),
        signal: AbortSignal.timeout(10000),
      });

      const data = await res.json();
      if (data.success) {
        return `成功推送 ${data.success} 条URL`;
      } else if (data.remain !== undefined) {
        return `成功推送 ${data.success || 0} 条，今日剩余配额 ${data.remain}`;
      } else {
        return `响应: ${JSON.stringify(data)}`;
      }
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
