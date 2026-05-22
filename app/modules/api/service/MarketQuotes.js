/**
 * 行情数据服务
 * 使用 Yahoo Finance v8 公开 API 获取股票/指数行情
 */

class MarketQuotesService {
  constructor() {
    // Yahoo Finance API 基础 URL
    this.baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/';
    // 缓存：避免频繁请求
    this.cache = new Map();
    this.cacheTTL = 15 * 1000; // 15秒缓存
  }

  /**
   * 批量获取行情数据
   * @param {string[]} symbols - 股票代码数组
   * @returns {Object} { symbol: { price, change, changePct } }
   */
  async getQuotes(symbols) {
    const result = {};
    const now = Date.now();

    // 分离需要请求的和可以用缓存的
    const toFetch = [];
    for (const symbol of symbols) {
      const cached = this.cache.get(symbol);
      if (cached && (now - cached.time) < this.cacheTTL) {
        result[symbol] = cached.data;
      } else {
        toFetch.push(symbol);
      }
    }

    // 并发请求
    if (toFetch.length > 0) {
      const promises = toFetch.map(symbol => this.fetchSingle(symbol));
      const results = await Promise.allSettled(promises);

      results.forEach((res, idx) => {
        const symbol = toFetch[idx];
        if (res.status === 'fulfilled' && res.value) {
          result[symbol] = res.value;
          this.cache.set(symbol, { data: res.value, time: now });
        }
      });
    }

    return result;
  }

  /**
   * 获取单个股票行情
   */
  async fetchSingle(symbol) {
    try {
      const url = `${this.baseUrl}${encodeURIComponent(symbol)}?interval=1d&range=1d`;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.error(`[MarketQuotes] ${symbol} HTTP ${response.status}`);
        return null;
      }

      const data = await response.json();
      const chartResult = data?.chart?.result?.[0];
      
      if (!chartResult) return null;

      const meta = chartResult.meta;
      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose || meta.previousClose;

      if (!price || !prevClose) return null;

      const change = price - prevClose;
      const changePct = (change / prevClose) * 100;

      return {
        price: parseFloat(price.toFixed(4)),
        change: parseFloat(change.toFixed(4)),
        changePct: parseFloat(changePct.toFixed(4)),
        prevClose: prevClose,
        currency: meta.currency || '',
        marketState: meta.marketState || ''
      };
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(`[MarketQuotes] ${symbol} 请求失败:`, err.message);
      }
      return null;
    }
  }

  /**
   * 获取K线数据（5天15分钟线，用于迷你图表）
   * @param {string} symbol
   * @returns {number[]} 收盘价数组
   */
  async getKline(symbol) {
    // 检查缓存（K线缓存5分钟）
    const cacheKey = 'kline_' + symbol;
    const cached = this.cache.get(cacheKey);
    const now = Date.now();
    if (cached && (now - cached.time) < 300000) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}${encodeURIComponent(symbol)}?interval=15m&range=5d`;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) return [];

      const data = await response.json();
      const chartResult = data?.chart?.result?.[0];
      if (!chartResult) return [];

      const closes = chartResult.indicators?.quote?.[0]?.close;
      if (!closes) return [];

      // 过滤掉 null 值
      const prices = closes.filter(p => p !== null && p !== undefined);
      
      this.cache.set(cacheKey, { data: prices, time: now });
      return prices;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(`[MarketQuotes] ${symbol} K线请求失败:`, err.message);
      }
      return [];
    }
  }
}

export default new MarketQuotesService();
