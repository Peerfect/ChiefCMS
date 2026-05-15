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

  // 行情表格代理接口
  router.get("/api/market-table", async (req, res) => {
    try {
      const { codes } = req.query;
      if (!codes) return res.json({ data: [] });

      const url = `https://ws.api.cnyes.com/ws/api/v1/quote/quotes/${codes}?column=C,E,K,M,N,O,P,S,V,W`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Origin': 'https://www.cnyes.com',
          'Referer': 'https://www.cnyes.com/'
        }
      });

      if (!response.ok) return res.json({ data: [] });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.json({ data: [] });
    }
  });

  // 快讯数据接口
  router.get("/api/flash-news", async (req, res) => {
    try {
      const hasTable = await Chan.db.schema.hasTable('cms_flash_news');
      if (!hasTable) {
        return res.json({ list: [] });
      }
      const list = await Chan.db('cms_flash_news')
        .select('id', 'content', 'important', 'publishAt')
        .orderBy('publishAt', 'desc')
        .limit(50);
      res.json({ list });
    } catch (error) {
      res.json({ list: [] });
    }
  });

  // 轻量价格接口（只返回最新价）
  router.get("/api/market-price", async (req, res) => {
    try {
      const { symbol } = req.query;
      if (!symbol) return res.json({});
      const r = await fetch(`https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${symbol}`);
      const d = await r.json();
      res.json({
        symbol: d.symbol,
        price: parseFloat(d.lastPrice) || 0,
        change: parseFloat(d.priceChange) || 0,
        changePct: parseFloat(d.priceChangePercent) || 0,
      });
    } catch(e) {
      res.json({});
    }
  });

  // 行情数据接口（币安）
  router.get("/api/market-quotes", async (req, res) => {
    try {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT'];
      
      // 逐个获取24小时行情
      const tickerPromises = symbols.map(s =>
        fetch(`https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${s}`).then(r => r.json())
      );
      const tickers = await Promise.all(tickerPromises);

      // 获取每个品种的K线
      const klinePromises = symbols.map(s =>
        fetch(`https://data-api.binance.vision/api/v3/klines?symbol=${s}&interval=5m&limit=60`).then(r => r.json())
      );
      const klines = await Promise.all(klinePromises);

      const result = symbols.map((symbol, i) => {
        const ticker = tickers[i] || {};
        const kline = klines[i] || [];
        
        return {
          symbol,
          price: parseFloat(ticker.lastPrice) || 0,
          change: parseFloat(ticker.priceChange) || 0,
          changePct: parseFloat(ticker.priceChangePercent) || 0,
          high: parseFloat(ticker.highPrice) || 0,
          low: parseFloat(ticker.lowPrice) || 0,
          volume: parseFloat(ticker.quoteVolume) || 0,
          prices: Array.isArray(kline) ? kline.map(k => parseFloat(k[4])) : [],
          startTime: Array.isArray(kline) && kline.length > 0 ? kline[0][0] : null,
          endTime: Array.isArray(kline) && kline.length > 0 ? kline[kline.length - 1][6] : null,
        };
      });

      res.json({ data: result });
    } catch (error) {
      console.error('Market quotes error:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // 使用路由
  app.use(router);
};
