/**
 * 外汇开户文章数据服务
 * 从 chiefrich.com 抓取外汇开户相关文章列表
 * 一天抓取一次，CMS 文章始终排前
 */
import * as cheerio from "cheerio";
import { Service } from "chanjs";

class ForexArticleService extends Service {
  constructor() {
    super("cms_article");
    this.sourceUrl = "https://www.chiefrich.com/waihui/whkh/";
    // 缓存：一天一次
    this.cache = null;
    this.cacheTime = 0;
    this.cacheTTL = 24 * 60 * 60 * 1000; // 24小时
  }

  /**
   * 获取外汇开户文章列表
   * CMS 文章排最前，抓取数据排后面
   */
  async getArticleList({ page = 1, pageSize = 12, cid } = {}) {
    // 1. 获取 CMS 系统文章（始终排前面）
    const cmsArticles = await this.getCmsArticles(cid);

    // 2. 获取抓取数据
    const scrapedArticles = await this.fetchAndParse();

    // 3. CMS 文章转换为统一格式
    const cmsItems = cmsArticles.map((a) => ({
      title: a.title,
      description: a.description || "",
      url: a.link || `/article-${a.id}.html`,
      img: a.img || "",
      source: "cms",
      id: a.id,
    }));

    // 4. 合并：CMS 文章在前
    const allItems = [...cmsItems, ...scrapedArticles];

    // 5. 分页
    const total = allItems.length;
    const start = (page - 1) * pageSize;
    const list = allItems.slice(start, start + pageSize);

    return {
      total,
      current: page,
      pageSize,
      list,
    };
  }

  /**
   * 从 CMS 系统获取文章
   */
  async getCmsArticles(cid) {
    if (!cid) return [];
    try {
      const articles = await this.db("cms_article")
        .select("id", "title", "description", "img", "link", "sort")
        .where("status", 0)
        .where("cid", cid)
        .orderBy("sort", "desc")
        .orderBy("id", "desc");
      return articles || [];
    } catch (err) {
      console.error("[ForexArticle] 查询CMS文章失败:", err.message);
      return [];
    }
  }

  /**
   * 抓取并解析文章列表页（一天一次）
   * 同时进入详情页获取缩略图
   */
  async fetchAndParse() {
    const now = Date.now();

    if (this.cache && now - this.cacheTime < this.cacheTTL) {
      return this.cache;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(this.sourceUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "zh-CN,zh;q=0.9",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.error("[ForexArticle] HTTP", response.status);
        return this.cache || [];
      }

      const content = await response.text();
      if (!content) {
        console.error("[ForexArticle] 抓取内容为空");
        return this.cache || [];
      }

      const articles = this.parseHTML(content);

      this.cache = articles;
      this.cacheTime = now;
      return articles;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("[ForexArticle] 抓取失败:", err.message);
      }
      return this.cache || [];
    }
  }

  /**
   * 解析列表页 HTML 提取文章基础信息
   * 使用 .post 容器提取完整数据：标题、缩略图、描述、日期
   */
  parseHTML(html) {
    const $ = cheerio.load(html);
    const articles = [];

    $(".post").each((index, el) => {
      const $el = $(el);

      // 标题
      const $titleLink = $el.find(".entry-title a").first();
      const title = ($titleLink.attr("title") || $titleLink.text() || "").trim();
      if (!title || title.length < 5) return;
      if (articles.some((a) => a.title === title)) return;

      // 链接
      const href = $titleLink.attr("href") || "";
      const url = href.startsWith("http") ? href : `https://www.chiefrich.com${href}`;

      // 缩略图
      let img = "";
      const imgSrc = $el.find(".thumbnail-link img").attr("src") || $el.find(".thumbnail-wrap img").attr("src") || "";
      if (imgSrc) {
        img = imgSrc.startsWith("http") ? imgSrc : `https://www.chiefrich.com${imgSrc}`;
      }

      // 描述
      const description = $el.find(".entry-summary").text().trim().slice(0, 200);

      // 日期
      const date = $el.find(".entry-date").text().replace(/发布时间[：:]?\s*/, "").trim();

      // 来源
      const author = $el.find(".entry-author").text().replace(/文章来源[：:]?\s*/, "").trim();

      // 标签
      const tag = $el.find(".entry-category").text().replace(/标签[：:]?\s*/, "").trim();

      articles.push({
        title,
        description,
        img,
        url,
        date,
        author,
        tag,
        source: "scraped",
      });
    });

    return articles;
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache = null;
    this.cacheTime = 0;
  }
}

export default new ForexArticleService();
