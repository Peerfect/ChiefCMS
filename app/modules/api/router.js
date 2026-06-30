import { helper } from "chanjs";
import { singleUpload, multiUpload, logo } from "../../common/upload.js";
import ForexSync from "./service/ForexSync.js";
import schedule from "node-schedule";

export default async (app, router, config) => {
  let controller = await helper.loadController("api");
  
  router.get("/site", controller.Api.site);
  router.get("/frag", controller.Api.fragList);
  router.get("/tag", controller.Api.getTag);
  router.get("/friendlink", controller.Api.getFriendlink);
  router.get("/category", controller.Api.category);
  router.get("/getArticleList", controller.Api.getArticleList);
  router.get("/getArticleListByCid", controller.Api.getArticleListByCid);
  router.get("/getArticleTag", controller.Api.getArticleTag);
  router.get(["/list", "/page"], controller.Api.list);
  router.get("/article", controller.Api.getArticle);
  router.get("/banner", controller.Api.banner);
  router.get("/pv", controller.Api.pv);
  router.get("/articleImg", controller.Api.articleImg);
  router.get("/tagList", controller.Api.tagList);
  router.get("/prev", controller.Api.prev);
  router.get("/next", controller.Api.next);

  router.get("/getTagsById", controller.Api.getTagsById);
  router.get("/search", controller.Api.search);
  router.get("/pvadd", controller.Api.pvadd);
  router.get("/captcha", controller.Api.captcha);

  // 行情数据
  router.get("/market-quotes-v2", controller.Api.marketQuotesV2);
  router.get("/market-kline", controller.Api.marketKline);
  
  // 外汇经纪商数据
  router.get("/forex-brokers", controller.Api.forexBrokers);
  
  // 外汇开户文章数据
  router.get("/forex-articles", controller.Api.forexArticles);
  
  // 外汇数据同步（抓取入库）
  router.get("/forex-sync", controller.Api.forexSync);

  // 抓取任务：同步所有栏目
  async function runForexSync() {
    console.log("[ForexSync] 定时同步开始:", new Date().toLocaleString());

    const tasks = [
      { name: "外汇开户", fn: () => ForexSync.syncArticles(19) },
      { name: "外汇平台", fn: () => ForexSync.syncArticles(18, false, "https://www.chiefrich.com/waihui/whpt/") },
      { name: "外汇行情", fn: () => ForexSync.syncMultiplePages(17, [
        "https://www.chiefrich.com/waihui/whgg/",
        "https://www.chiefrich.com/waihui/whtz/",
        "https://www.chiefrich.com/waihui/whjys/",
        "https://www.chiefrich.com/waihui/whbzj/",
      ])},
      { name: "外汇策略", fn: () => ForexSync.syncArticles(20) },
      { name: "外汇入门", fn: () => ForexSync.syncMultiplePages(21, [
        "https://www.chiefrich.com/waihui/whrm/",
        "https://www.chiefrich.com/waihui/xinshou/",
      ])},
      { name: "外汇交易", fn: () => ForexSync.syncArticles(22, false, "https://www.chiefrich.com/waihui/whjy/") },
      { name: "曝光台", fn: () => ForexSync.syncArticles(23, false, "https://www.chiefrich.com/weiquan/") },
    ];

    for (const task of tasks) {
      try {
        const res = await task.fn();
        console.log(`[ForexSync] ${task.name}同步完成:`, res.msg);
      } catch (err) {
        console.error(`[ForexSync] ${task.name}同步失败:`, err.message);
      }
    }

    console.log("[ForexSync] 定时同步结束:", new Date().toLocaleString());
  }

  // 启动后延迟 10 秒执行一次
  setTimeout(runForexSync, 10000);

  // 每天凌晨 3:00 定时执行
  schedule.scheduleJob("0 3 * * *", runForexSync);
  console.log("[ForexSync] 定时任务已注册: 每天 03:00 自动同步");
};
