import { helper } from "chanjs";
import init from "./middleware/init.js";
import adapter from "./middleware/adapter.js";
import { singleUpload, multiUpload, logo } from "../../common/upload.js";

export default async (app, router, config) => {
  let controller = await helper.loadController("web");
  
  router.use(adapter());
  router.use(init());

  // 首页模板
  router.get(["/", "/index.html", "/index.php"], controller.home.index);

  // 分类
  router.get(
    [
      "/list/:cid", // 兼容 old
      "/:cate/index.html",
      "/:cate/index:current.html",
      "/:cate1/:cate/index.html",
      "/:cate1/:cate/index:current.html",
      "/:cate2/:cate1/:cate/index.html",
      "/:cate2/:cate1/:cate/index:current.html",
      "/:cate3/:cate2/:cate1/:cate/index.html",
      "/:cate3/:cate2/:cate1/:cate/index:current.html",
    ],
    controller.home.list
  );

  // 文章页
  router.get(
    [
      "/article/:id", // 兼容 old
      "/article/:id.html", // 兼容 old
      "/article-:id.html",
      "/:cate/article-:id.html",
      "/:cate1/:cate/article-:id.html",
      "/:cate2/:cate1/:cate/article-:id.html",
      "/:cate2/:cate1/:cate/article-:id.html",
      "/:cate3/:cate2/:cate1/:cate/article-:id.html",
    ],
    controller.home.article
  );

  // 单页栏目
  router.get(
    [
      "/page/:id", // 兼容 old
      "/page/:id.html", // 兼容 old
      "/page-:id.html",
      "/:cate/page.html",
      "/:cate1/:cate/page.html",
      "/:cate2/:cate1/:cate/page.html",
      "/:cate3/:cate2/:cate1/:cate/page.html",
      "/:cate/page-:id.html",
      "/:cate1/:cate/page-:id.html",
      "/:cate2/:cate1/:cate/page-:id.html",
      "/:cate2/:cate1/:cate/page-:id.html",
      "/:cate3/:cate2/:cate1/:cate/page-:id.html",
    ],
    controller.home.page
  );

  // 搜索页
  router.get(
    ["/search/:keywords/words.html", "/search/:keywords/words:current.html"],
    controller.home.search
  );

  // tag列表页
  router.get(
    ["/tags/:path/tag.html", "/tags/:path/tag:current.html"],
    controller.home.tag
  );

  // 行情数据代理接口
  router.get("/api/market-quotes", async (req, res) => {
    try {
      const { type } = req.query;
      if (!type) return res.json({ error: 'type required' });

      const MARKET_MAP = {
        tw_stock: 'TWS:TSE01:INDEX,TWS:OTC01:INDEX,TWS:2330:STOCK,TWS:2317:STOCK',
        hk_stock: 'HKS:HSI:INDEX,HKS:HSCCI:INDEX,SHS:000001:INDEX,SZS:399001:INDEX',
        asia: 'JPS:N225:INDEX,KRS:KOSPI:INDEX,SPS:STI:INDEX,INS:SENSEX:INDEX',
        futures: 'CME:NQ:FUTURES,CME:ES:FUTURES,SGX:CN:FUTURES,CME:YM:FUTURES',
        eu_stock: 'FRS:FCHI:INDEX,GES:GDAXI:INDEX,UKS:UKX:INDEX,SWS:SSMI:INDEX',
        us_stock: 'USS:DJI:INDEX,USS:SPX:INDEX,USS:COMP:INDEX,USS:SOX:INDEX',
        oil_gold: 'CME:GC:FUTURES,CME:SI:FUTURES,CME:CL:FUTURES,ICE:BRN:FUTURES',
        agriculture: 'CME:S:FUTURES,CME:C:FUTURES,CME:W:FUTURES,ICE:SB:FUTURES',
        bond: 'USS:US10Y:BOND,USS:US2Y:BOND,USS:US30Y:BOND,JPS:JP10Y:BOND',
        crypto: 'CRY:BTC:CRYPTO,CRY:ETH:CRYPTO,CRY:BNB:CRYPTO,CRY:XRP:CRYPTO'
      };

      const codes = MARKET_MAP[type];
      if (!codes) return res.json({ error: 'invalid type' });

      const symbols = codes.split(',');
      const url = `https://ws.api.cnyes.com/ws/api/v1/quote/quotes/${symbols.join(',')}?column=C,E,K,M,N,O,P,S,V,W`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Origin': 'https://www.cnyes.com',
          'Referer': 'https://www.cnyes.com/'
        }
      });

      if (!response.ok) {
        return res.json({ error: 'upstream error', status: response.status });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Market quotes proxy error:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // 使用路由
  app.use(router);
};
