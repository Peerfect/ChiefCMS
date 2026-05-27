/**
 * 外汇经纪商数据服务
 * 从 chiefrich.com/broker/ 每天抓取一次经纪商列表数据
 * CMS 系统添加的文章始终排在最前面
 */
import * as cheerio from "cheerio";
import { Service } from "chanjs";

class ForexBrokerService extends Service {
  constructor() {
    super("cms_article");
    this.sourceUrl = "https://www.chiefrich.com/broker/";
    // 缓存：一天抓取一次
    this.cache = null;
    this.cacheTime = 0;
    this.cacheTTL = 24 * 60 * 60 * 1000; // 24小时
  }

  /**
   * 获取经纪商列表数据
   * CMS文章排最前，抓取数据排后面
   * @param {Object} options - 查询选项
   * @param {string} options.status - 状态筛选：all/监管中/未经认证/问题平台/疑似套牌/超限经营/暂无监管
   * @param {number} options.page - 当前页码
   * @param {number} options.pageSize - 每页条数
   * @param {number} options.cid - CMS 栏目ID（外汇经纪商栏目）
   * @returns {Object} 分页经纪商列表
   */
  async getBrokerList({ status = "all", page = 1, pageSize = 20, cid } = {}) {
    // 1. 获取 CMS 系统文章（始终排前面）
    const cmsArticles = await this.getCmsArticles(cid);

    // 2. 获取抓取数据
    const scrapedBrokers = await this.fetchAndParse();

    // 3. CMS 文章转换为统一格式，标记来源
    const cmsItems = cmsArticles.map((a) => ({
      name: a.title,
      score: a.sort || 99, // 用 sort 字段作为评分，默认99
      status: a.shortTitle || "监管中", // 用副标题存储状态
      country: a.author || "",
      regulation: a.keywords || "",
      url: a.link || "",
      img: a.img || "",
      source: "cms", // 标记来源：CMS系统
      id: a.id,
    }));

    // 4. 给抓取数据标记来源
    const scrapedItems = scrapedBrokers.map((b) => ({
      ...b,
      source: "scraped",
    }));

    // 5. 合并：CMS 文章在前，抓取数据在后
    let allItems = [...cmsItems, ...scrapedItems];

    // 6. 状态筛选
    if (status && status !== "all") {
      allItems = allItems.filter((b) => b.status === status);
    }

    // 7. 分页
    const total = allItems.length;
    const start = (page - 1) * pageSize;
    const list = allItems.slice(start, start + pageSize);

    return {
      total,
      current: page,
      pageSize,
      list,
      statusOptions: [
        "全部",
        "监管中",
        "未经认证",
        "问题平台",
        "疑似套牌",
        "超限经营",
        "暂无监管",
      ],
    };
  }

  /**
   * 从 CMS 系统获取外汇经纪商文章
   * @param {number} cid - 栏目ID
   */
  async getCmsArticles(cid) {
    if (!cid) return [];
    try {
      const articles = await this.db("cms_article")
        .select(
          "id",
          "title",
          "shortTitle",
          "author",
          "keywords",
          "img",
          "link",
          "sort"
        )
        .where("status", 0) // 已发布
        .where("cid", cid)
        .orderBy("sort", "desc")
        .orderBy("id", "desc");
      return articles || [];
    } catch (err) {
      console.error("[ForexBroker] 查询CMS文章失败:", err.message);
      return [];
    }
  }

  /**
   * 抓取并解析经纪商页面（一天一次）
   */
  async fetchAndParse() {
    const now = Date.now();

    // 使用缓存（24小时有效）
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
        console.error("[ForexBroker] HTTP", response.status);
        return this.cache || [];
      }

      const content = await response.text();

      if (!content) {
        console.error("[ForexBroker] 抓取内容为空");
        return this.cache || [];
      }

      const brokers = this.parseHTML(content);
      this.cache = brokers;
      this.cacheTime = now;
      return brokers;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("[ForexBroker] 抓取失败:", err.message);
      }
      return this.cache || [];
    }
  }

  /**
   * 解析 HTML 提取经纪商数据
   */
  parseHTML(html) {
    const $ = cheerio.load(html);
    const brokers = [];

    // 解析经纪商列表项（每个 a 标签包含一个经纪商信息）
    $('a[href*="/broker/"]').each((index, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      const href = $el.attr("href") || "";

      // 只处理包含评分信息的条目
      if (!text.includes("综合评分") || !href.includes("/broker/")) {
        return;
      }

      // 解析状态
      let status = "";
      const statusMatch = text.match(
        /^(监管中|未经认证|问题平台|疑似套牌|超限经营|暂无监管)/
      );
      if (statusMatch) {
        status = statusMatch[1];
      }

      // 解析名称
      let name = "";
      const afterStatus = text.replace(
        /^(监管中|未经认证|问题平台|疑似套牌|超限经营|暂无监管)\s*/,
        ""
      );
      const nameMatch = afterStatus.match(/^(.+?)\s+综合评分/);
      if (nameMatch) {
        let rawName = nameMatch[1].trim();
        // 名称可能重复（如 "XM XM"），去重
        const parts = rawName.split(/\s+/);
        if (parts.length === 2 && parts[0] === parts[1]) {
          rawName = parts[0];
        }
        name = rawName;
      }

      // 解析综合评分
      let score = 0;
      const scoreMatch = text.match(/综合评分[：:]\s*(\d+)/);
      if (scoreMatch) {
        score = parseInt(scoreMatch[1]);
      }

      // 解析所属国家
      let country = "";
      const countryMatch = text.match(/所属国家[：:]\s*(.+?)\s+监管/);
      if (countryMatch) {
        country = countryMatch[1].trim();
      }

      // 解析监管信息
      let regulation = "";
      const regMatch = text.match(/监管[：:]\s*(.+?)$/);
      if (regMatch) {
        regulation = regMatch[1].trim();
      }

      if (name && score > 0) {
        brokers.push({
          name,
          score,
          status,
          country,
          regulation,
          url: href.startsWith("http")
            ? href
            : `https://www.chiefrich.com${href}`,
        });
      }
    });

    return brokers;
  }

  /**
   * 清除缓存（手动刷新时使用）
   */
  clearCache() {
    this.cache = null;
    this.cacheTime = 0;
  }
}

export default new ForexBrokerService();
