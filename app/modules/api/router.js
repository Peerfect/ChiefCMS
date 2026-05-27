import { helper } from "chanjs";
import { singleUpload, multiUpload, logo } from "../../common/upload.js";
import ForexSync from "./service/ForexSync.js";

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

  // 启动时自动同步外汇开户文章数据（cid=19），一天一次
  setTimeout(() => {
    ForexSync.syncArticles(19).then((res) => {
      console.log("[ForexSync] 外汇开户自动同步:", res.msg);
    }).catch((err) => {
      console.error("[ForexSync] 外汇开户自动同步失败:", err.message);
    });
  }, 5000);
};
