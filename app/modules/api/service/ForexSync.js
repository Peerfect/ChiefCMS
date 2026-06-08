/**
 * 外汇数据同步服务
 * 从目标网站抓取数据，存入 cms_article 表对应栏目下
 * 一天同步一次，CMS 后台手动添加的文章（sort > 0）始终排前面
 */
import * as cheerio from "cheerio";
import { Service, Paths } from "chanjs";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";

class ForexSyncService extends Service {
  constructor() {
    super("cms_article");
    // 同步锁：防止并发执行
    this.syncing = false;
    // 缓存上次同步时间
    this.lastSyncTime = {};
    this.syncInterval = 24 * 60 * 60 * 1000; // 24小时
  }

  /**
   * 同步外汇经纪商数据到文章表
   * @param {number} cid - 目标栏目ID
   * @param {boolean} force - 是否强制同步（忽略时间间隔）
   * @returns {Object} 同步结果
   */
  async syncBrokers(cid, force = false) {
    if (!cid) throw new Error("缺少目标栏目ID");

    // 检查是否需要同步
    const now = Date.now();
    if (!force && this.lastSyncTime[`broker_${cid}`] && now - this.lastSyncTime[`broker_${cid}`] < this.syncInterval) {
      return { success: true, msg: "距上次同步不足24小时，跳过", synced: 0 };
    }

    if (this.syncing) {
      return { success: false, msg: "正在同步中，请稍后" };
    }

    this.syncing = true;
    try {
      // 1. 抓取数据
      const brokers = await this.fetchBrokerList();
      if (!brokers.length) {
        return { success: false, msg: "抓取数据为空" };
      }

      // 2. 获取已存在的抓取文章（source 标记为 scraped）
      const existing = await this.db("cms_article")
        .select("id", "title")
        .where("cid", cid)
        .where("source", "scraped");

      const existingTitles = new Set(existing.map((a) => a.title));

      // 3. 过滤出新数据
      const newBrokers = brokers.filter((b) => !existingTitles.has(b.name));

      // 4. 批量插入新数据
      if (newBrokers.length > 0) {
        const insertData = newBrokers.map((b) => ({
          title: b.name,
          shortTitle: b.status,
          description: `所属国家：${b.country}，监管：${b.regulation}，综合评分：${b.score}`,
          author: b.country,
          content: `所属国家：${b.country}，监管：${b.regulation}，综合评分：${b.score}`,
          link: b.url,
          cid: cid,
          source: "scraped",
          status: 0,
          pv: 0,
          createdAt: new Date(),
        }));

        // 分批插入（每批20条）
        for (let i = 0; i < insertData.length; i += 20) {
          const batch = insertData.slice(i, i + 20);
          await this.db("cms_article").insert(batch);
        }
      }

      this.lastSyncTime[`broker_${cid}`] = now;

      return {
        success: true,
        msg: `同步完成，新增 ${newBrokers.length} 条，已存在 ${existingTitles.size} 条`,
        synced: newBrokers.length,
        total: brokers.length,
      };
    } finally {
      this.syncing = false;
    }
  }

  /**
   * 同步文章数据到文章表
   * @param {number} cid - 目标栏目ID
   * @param {string} url - 来源页面URL（可选，默认根据cid判断）
   * @param {boolean} force - 是否强制同步
   */
  async syncArticles(cid, force = false, url) {
    if (!cid) throw new Error("缺少目标栏目ID");

    // 默认URL映射
    const urlMap = {
      19: "https://www.chiefrich.com/waihui/whkh/",
      20: "https://www.chiefrich.com/waihui/whjycn/",
    };
    const sourceUrl = url || urlMap[cid] || "";
    if (!sourceUrl) throw new Error("缺少来源URL");

    const now = Date.now();
    if (!force && this.lastSyncTime[`article_${cid}`] && now - this.lastSyncTime[`article_${cid}`] < this.syncInterval) {
      return { success: true, msg: "距上次同步不足24小时，跳过", synced: 0 };
    }

    if (this.syncing) {
      return { success: false, msg: "正在同步中，请稍后" };
    }

    this.syncing = true;
    try {
      // 1. 抓取数据
      const articles = await this.fetchArticleList(sourceUrl);
      if (!articles.length) {
        return { success: false, msg: "抓取数据为空" };
      }

      // 2. 获取已存在的抓取文章
      const existing = await this.db("cms_article")
        .select("id", "title")
        .where("cid", cid)
        .where("source", "scraped");

      const existingTitles = new Set(existing.map((a) => a.title));

      // 3. 过滤出新数据
      const newArticles = articles.filter((a) => !existingTitles.has(a.title));

      // 4. 批量插入
      if (newArticles.length > 0) {
        const insertData = [];
        for (const a of newArticles) {
          // 下载缩略图到本地
          const localImg = await this.downloadImage(a.img);
          insertData.push({
            title: a.title,
            description: a.description || "",
            img: localImg,
            link: a.url,
            cid: cid,
            source: "scraped",
            content: a.content || a.description || "",
            status: 0,
            pv: 0,
            createdAt: a.date ? new Date(a.date) : new Date(),
          });
        }

        for (let i = 0; i < insertData.length; i += 20) {
          const batch = insertData.slice(i, i + 20);
          await this.db("cms_article").insert(batch);
        }

        // 插入扩展表记录（查询栏目关联的模型表）
        try {
          const categoryInfo = await this.db("cms_category").select("mid").where("id", cid).first();
          if (categoryInfo?.mid && categoryInfo.mid !== "0") {
            const modelInfo = await this.db("cms_model").select("tableName").where("id", categoryInfo.mid).first();
            if (modelInfo?.tableName) {
              const newIds = await this.db("cms_article")
                .select("id", "description")
                .where("cid", cid)
                .where("source", "scraped")
                .orderBy("id", "desc")
                .limit(newArticles.length);
              for (const a of newIds) {
                const exists = await this.db(modelInfo.tableName).where("aid", a.id).first();
                if (!exists) {
                  await this.db(modelInfo.tableName).insert({ aid: a.id, summary: a.description || "" });
                }
              }
            }
          }
        } catch (extErr) {
          console.error("[ForexSync] 插入扩展表失败:", extErr.message);
        }
      }

      this.lastSyncTime[`article_${cid}`] = now;

      return {
        success: true,
        msg: `同步完成，新增 ${newArticles.length} 条，已存在 ${existingTitles.size} 条`,
        synced: newArticles.length,
        total: articles.length,
      };
    } finally {
      this.syncing = false;
    }
  }

  /**
   * 从多个页面同步文章到同一个栏目
   * @param {number} cid - 目标栏目ID
   * @param {string[]} urls - 来源页面URL数组
   * @param {boolean} force - 是否强制同步
   */
  async syncMultiplePages(cid, urls, force = false) {
    if (!cid) throw new Error("缺少目标栏目ID");

    const now = Date.now();
    const cacheKey = `multi_${cid}`;
    if (!force && this.lastSyncTime[cacheKey] && now - this.lastSyncTime[cacheKey] < this.syncInterval) {
      return { success: true, msg: "距上次同步不足24小时，跳过", synced: 0 };
    }

    if (this.syncing) {
      return { success: false, msg: "正在同步中，请稍后" };
    }

    this.syncing = true;
    try {
      // 1. 从所有页面抓取文章列表
      let allArticles = [];
      for (const url of urls) {
        const articles = await this.fetchArticleList(url);
        for (const a of articles) {
          if (!allArticles.some((x) => x.title === a.title)) {
            allArticles.push(a);
          }
        }
        await new Promise((r) => setTimeout(r, 500));
      }

      if (!allArticles.length) {
        return { success: false, msg: "抓取数据为空" };
      }

      // 2. 获取已存在的抓取文章
      const existing = await this.db("cms_article")
        .select("id", "title")
        .where("cid", cid)
        .where("source", "scraped");
      const existingTitles = new Set(existing.map((a) => a.title));

      // 3. 过滤新数据
      const newArticles = allArticles.filter((a) => !existingTitles.has(a.title));

      // 4. 批量插入
      if (newArticles.length > 0) {
        for (const a of newArticles) {
          const localImg = await this.downloadImage(a.img);
          await this.db("cms_article").insert({
            title: a.title,
            description: a.description || "",
            img: localImg,
            link: a.url,
            cid: cid,
            source: "scraped",
            content: a.content || a.description || "",
            status: 0,
            pv: 0,
            createdAt: a.date ? new Date(a.date) : new Date(),
          });
        }
      }

      this.lastSyncTime[cacheKey] = now;
      return {
        success: true,
        msg: `同步完成，新增 ${newArticles.length} 条，已存在 ${existingTitles.size} 条，总抓取 ${allArticles.length} 条`,
        synced: newArticles.length,
        total: allArticles.length,
      };
    } finally {
      this.syncing = false;
    }
  }

  /**
   * 下载远程图片到本地
   * @param {string} imgUrl - 远程图片URL
   * @returns {string} 本地图片路径（相对路径），失败返回空字符串
   */
  async downloadImage(imgUrl) {
    if (!imgUrl || (!imgUrl.startsWith("http://") && !imgUrl.startsWith("https://"))) {
      return "";
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(imgUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "image/*",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);
      if (!response.ok) return "";

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) return "";

      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 100) return ""; // 太小，可能不是有效图片

      // 根据content-type确定扩展名
      const extMap = { "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/webp": "webp", "image/svg+xml": "svg" };
      const ext = extMap[contentType.split(";")[0]] || "jpg";

      // 存储路径: public/uploads/{template}/image/{date}/{timestamp}.{ext}
      const template = Chan.config.template || "default";
      const date = dayjs().format("YYYY/MM/DD");
      const dir = path.join("public", "uploads", template, "image", date);
      const fullDir = path.join(Paths.rootPath, dir);

      fs.mkdirSync(fullDir, { recursive: true });

      const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filePath = path.join(fullDir, filename);

      fs.writeFileSync(filePath, buffer);

      // 返回相对路径
      return `/${dir.replace(/\\/g, "/")}/${filename}`;
    } catch (err) {
      console.error("[ForexSync] 下载图片失败:", imgUrl, err.message);
      return "";
    }
  }

  /**
   * 抓取经纪商列表
   */
  async fetchBrokerList() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("https://www.chiefrich.com/broker/", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "zh-CN,zh;q=0.9",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);
      if (!response.ok) return [];

      const content = await response.text();
      if (!content) return [];

      return this.parseBrokerHTML(content);
    } catch (err) {
      console.error("[ForexSync] 抓取经纪商失败:", err.message);
      return [];
    }
  }

  /**
   * 抓取文章列表
   */
  async fetchArticleList(url) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "zh-CN,zh;q=0.9",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);
      if (!response.ok) return [];

      const content = await response.text();
      if (!content) return [];

      const articles = this.parseArticleHTML(content);

      // 逐个获取文章详情页正文内容
      for (let i = 0; i < articles.length; i++) {
        if (articles[i].url) {
          articles[i].content = await this.fetchArticleContent(articles[i].url);
          // 避免请求过快
          if (i < articles.length - 1) {
            await new Promise((r) => setTimeout(r, 500));
          }
        }
      }

      return articles;
    } catch (err) {
      console.error("[ForexSync] 抓取文章失败:", err.message);
      return [];
    }
  }

  /**
   * 获取文章详情页正文 HTML
   */
  async fetchArticleContent(url) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "text/html",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);
      if (!response.ok) return "";

      const html = await response.text();
      const $ = cheerio.load(html);
      const $content = $(".entry-content");

      // 移除免责声明、授权转载、广告等非正文内容
      const removePatterns = [
        /※\s*本文经.{0,50}授权转载/,
        /※\s*免责声明/,
        /免责声明[：:]/,
        /本文仅供参考.*投资建议/,
        /投资人应独立判断.*评估风险/,
        /原文出处/,
        /原文连结/,
        /原文链接/,
        /本文禁止任何商业性转载/,
        /如需转载需联系小编/,
        /部分内容整理自网络.*侵权请联系删除/,
        /标题：.*收录于/,
        /文中所提的个股.*并非投资建议/,
        /以上内容仅供参考/,
        /风险提示[：:].*自行承担/,
        /本网站所有刊登内容/,
        /本站概不负责.*不承担任何法律责任/,
      ];

      // 逐个段落检查，移除匹配的段落
      $content.find("p, div, span").each((i, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        
        // 跳过空元素
        if (!text) return;
        
        // 检查是否匹配需要移除的模式
        for (const pattern of removePatterns) {
          if (pattern.test(text)) {
            $el.remove();
            return;
          }
        }
      });

      // 外链域名替换
      $content.find("a").each((i, el) => {
        const $a = $(el);
        const href = $a.attr("href") || "";
        if (href.startsWith("http") || href.startsWith("//")) {
          try {
            const u = new URL(href.startsWith("//") ? "https:" + href : href);
            u.hostname = "www.chiefrich.com";
            u.protocol = "https:";
            $a.attr("href", u.toString());
          } catch (e) {
            $a.attr("href", "https://www.chiefrich.com");
          }
        }
      });

      // 图片相对路径补全为绝对路径
      $content.find("img").each((i, el) => {
        const $img = $(el);
        const src = $img.attr("src") || "";
        if (src && !src.startsWith("http") && !src.startsWith("data:")) {
          $img.attr("src", `https://www.chiefrich.com${src.startsWith("/") ? "" : "/"}${src}`);
        }
        const dataSrc = $img.attr("data-src") || "";
        if (dataSrc && !dataSrc.startsWith("http") && !dataSrc.startsWith("data:")) {
          $img.attr("data-src", `https://www.chiefrich.com${dataSrc.startsWith("/") ? "" : "/"}${dataSrc}`);
        }
      });

      // 最终清理：移除空段落
      $content.find("p").each((i, el) => {
        const $el = $(el);
        if (!$el.text().trim() && !$el.find("img").length) {
          $el.remove();
        }
      });

      return $content.html() || "";
    } catch (err) {
      return "";
    }
  }

  /**
   * 解析经纪商 HTML
   */
  parseBrokerHTML(html) {
    const $ = cheerio.load(html);
    const brokers = [];

    $('a[href*="/broker/"]').each((index, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      const href = $el.attr("href") || "";

      if (!text.includes("综合评分") || !href.includes("/broker/")) return;

      let status = "";
      const statusMatch = text.match(/^(监管中|未经认证|问题平台|疑似套牌|超限经营|暂无监管)/);
      if (statusMatch) status = statusMatch[1];

      let name = "";
      const afterStatus = text.replace(/^(监管中|未经认证|问题平台|疑似套牌|超限经营|暂无监管)\s*/, "");
      const nameMatch = afterStatus.match(/^(.+?)\s+综合评分/);
      if (nameMatch) {
        let rawName = nameMatch[1].trim();
        const parts = rawName.split(/\s+/);
        if (parts.length === 2 && parts[0] === parts[1]) rawName = parts[0];
        name = rawName;
      }

      let score = 0;
      const scoreMatch = text.match(/综合评分[：:]\s*(\d+)/);
      if (scoreMatch) score = parseInt(scoreMatch[1]);

      let country = "";
      const countryMatch = text.match(/所属国家[：:]\s*(.+?)\s+监管/);
      if (countryMatch) country = countryMatch[1].trim();

      let regulation = "";
      const regMatch = text.match(/监管[：:]\s*(.+?)$/);
      if (regMatch) regulation = regMatch[1].trim();

      if (name && score > 0) {
        brokers.push({
          name, score, status, country, regulation,
          url: href.startsWith("http") ? href : `https://www.chiefrich.com${href}`,
        });
      }
    });

    return brokers;
  }

  /**
   * 解析文章列表 HTML
   */
  parseArticleHTML(html) {
    const $ = cheerio.load(html);
    const articles = [];

    $(".post").each((index, el) => {
      const $el = $(el);
      const $titleLink = $el.find(".entry-title a").first();
      const title = ($titleLink.attr("title") || $titleLink.text() || "").trim();

      if (!title || title.length < 5) return;
      if (articles.some((a) => a.title === title)) return;

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

      articles.push({ title, description, img, url, date });
    });

    return articles;
  }
}

export default new ForexSyncService();
