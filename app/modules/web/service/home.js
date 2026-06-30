import { helper } from "chanjs";
import common from "./common.js";

import { getApiCalls } from "../utils/index.js";

const { filterFields } = helper;

const home = {
  async init() {
    const config = Chan.config?.data?.init || {};
    const apiCalls = getApiCalls(config, {}, common);

    // 如果没有配置init，使用默认查询获取基础数据
    if (Object.keys(apiCalls).length === 0) {
      const [site, category, friendlink, frag, tag] = await Promise.all([
        common.site(),
        common.category(),
        common.friendLink({}),
        common.frag({}),
        common.tag({ pageSize: 100 }),
      ]);
      return { site, category, friendlink, frag, tag };
    }

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  // 从栏目列表中获取指定栏目的 dataConfig
  _getCategoryConfig(categoryList, cid) {
    if (!categoryList || !Array.isArray(categoryList)) return null;
    
    const category = typeof cid === 'string' 
      ? categoryList.find(item => item.pinyin === cid)
      : categoryList.find(item => item.id === cid);
      
    if (!category || !category.dataConfig) return null;
    
    const dataConfig = typeof category.dataConfig === 'string' 
      ? JSON.parse(category.dataConfig) 
      : category.dataConfig;
    
    return dataConfig;
  },

  // 首页
  async home(categoryList) {
    let config = Chan.config.data.home;
    
    // 从首页栏目（pinyin=home）获取配置
    const categoryConfig = this._getCategoryConfig(categoryList, 'home');
    if (categoryConfig && Object.keys(categoryConfig).length > 0) {
      config = categoryConfig;
    }

    // 如果没有配置home，使用默认查询
    if (!config || Object.keys(config).length === 0) {
      const [article, banner, recommend, imgs, news, hotRecommend, latestArticles, insuranceArticles] = await Promise.all([
        common.getArticleListByCids({}),
        // 轮播图：从外汇相关栏目取最新有图文章
        Chan.db("cms_article as a")
          .select(["a.id", "a.title", "a.img as imgUrl", "a.description as content", "c.path"])
          .leftJoin("cms_category as c", "a.cid", "c.id")
          .whereIn("a.cid", [17, 18, 19, 20, 21, 22, 66, 67, 68, 69, 70, 72])
          .where("a.status", 0)
          .whereNot("a.img", "")
          .orderBy("a.createdAt", "desc")
          .limit(5)
          .then(list => list.map(a => ({
            ...a,
            linkUrl: `${a.path}/article-${a.id}.html`
          }))),
        // 右侧美股资讯：从美股(cid=25)获取
        Chan.db("cms_article as a")
          .select(["a.id", "a.title", "a.createdAt", "c.path"])
          .leftJoin("cms_category as c", "a.cid", "c.id")
          .where("a.cid", 25)
          .where("a.status", 0)
          .orderBy("a.createdAt", "desc")
          .limit(10),
        common.getNewImgList({ pageSize: 6 }),
        // 首页文章列表：从科技(cid=28)获取
        Chan.db("cms_article as a")
          .select(["a.id", "a.title", "a.img", "a.description", "a.createdAt", "c.path"])
          .leftJoin("cms_category as c", "a.cid", "c.id")
          .where("a.cid", 28)
          .where("a.status", 0)
          .orderBy("a.createdAt", "desc")
          .limit(10),
        // 热门推荐：从外汇行情(17)/外汇平台(18)/外汇开户(19)/外汇入门(21)/外汇交易(22)取最新4条
        Chan.db("cms_article as a")
          .select(["a.id", "a.title", "a.img", "a.description", "a.createdAt", "c.path"])
          .leftJoin("cms_category as c", "a.cid", "c.id")
          .whereIn("a.cid", [17, 18, 19, 21, 22])
          .where("a.status", 0)
          .orderBy("a.createdAt", "desc")
          .limit(4),
        // 最新文章：港股栏目(cid=26)
        Chan.db("cms_article as a")
          .select(["a.id", "a.title", "a.createdAt", "c.path"])
          .leftJoin("cms_category as c", "a.cid", "c.id")
          .where("a.cid", 26)
          .where("a.status", 0)
          .orderBy("a.createdAt", "desc")
          .limit(10),
        // 保险入门：保险(34)/保险入门(48)取最新8条
        Chan.db("cms_article as a")
          .select(["a.id", "a.title", "a.img", "a.description", "a.createdAt", "c.path"])
          .leftJoin("cms_category as c", "a.cid", "c.id")
          .whereIn("a.cid", [34, 48])
          .where("a.status", 0)
          .orderBy("a.createdAt", "desc")
          .limit(8),
      ]);
      return { article, banner, recommend, imgs, news, hotRecommend, latestArticles, insuranceArticles };
    }
    
    const apiCalls = getApiCalls(config, {}, common);

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  // 列表页
  async list({ cid, page = 1, categoryList }) {
    let config = Chan.config.data.list;
    
    // 从栏目获取配置
    const categoryConfig = this._getCategoryConfig(categoryList, cid);
    if (categoryConfig && Object.keys(categoryConfig).length > 0) {
      config = categoryConfig;
    }
    
    // 如果没有配置list，使用默认查询
    if (!config || Object.keys(config).length === 0) {
      const articleList = await common.list({ cid, page });
      return { articleList };
    }

    const apiCalls = getApiCalls(
      config,
      {
        cid,
        page,
      },
      common
    );

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  // 文章页
  async article({ id, cid, categoryList }) {
    let config = Chan.config.data.article;
    
    // 从栏目获取配置
    const categoryConfig = this._getCategoryConfig(categoryList, cid);
    if (categoryConfig && Object.keys(categoryConfig).length > 0) {
      config = categoryConfig;
    }
    
    // 如果没有配置article，使用默认查询
    if (!config || Object.keys(config).length === 0) {
      const [recommend, prev, next, randomRecommend] = await Promise.all([
        common.getArticlePvList({ pageSize: 10, cid }),
        common.prev({ id, cid }),
        common.next({ id, cid }),
        // 从外汇相关栏目随机取12条带图文章
        Chan.db("cms_article as a")
          .select("a.id", "a.title", "a.img", "c.path")
          .leftJoin("cms_category as c", "a.cid", "c.id")
          .whereIn("a.cid", [17, 18, 19, 20, 21, 22])
          .where("a.status", 0)
          .whereNot("a.img", "")
          .orderByRaw("RAND()")
          .limit(8),
      ]);
      return { recommend, prev, next, randomRecommend };
    }

    const apiCalls = getApiCalls(
      config,
      {
        id,
        cid,
      },
      common
    );

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  // 单页列表页
  async page({ cid, categoryList }) {
    let config = Chan.config.data.page;
    
    // 从栏目获取配置
    const categoryConfig = this._getCategoryConfig(categoryList, cid);
    if (categoryConfig && Object.keys(categoryConfig).length > 0) {
      config = categoryConfig;
    }

    // 如果没有配置page，使用默认查询
    if (!config || Object.keys(config).length === 0) {
      const page = await common.list({ cid, page: 1, pageSize: 20 });
      return { page };
    }

    const apiCalls = getApiCalls(
      config,
      {
        cid,
      },
      common
    );

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  async search({ keywords = "", page = 1 }) {
    const config = Chan.config.data.search;

    // 如果没有配置search，使用默认查询
    if (!config || Object.keys(config).length === 0) {
      // 先尝试通过 tag path 搜索
      const tagResult = await common.tags({ path: keywords, page });
      
      // 如果 tag 搜索有结果，直接返回
      if (tagResult.list && tagResult.list.length > 0) {
        return { search: { count: tagResult.total, list: tagResult.list } };
      }

      // tag 搜索无结果，改为全文模糊搜索（标题 + 描述）
      const pageSize = 10;
      const offset = (page - 1) * pageSize;
      
      const totalResult = await Chan.db("cms_article")
        .where("status", 0)
        .where(function() {
          this.where("title", "like", `%${keywords}%`)
            .orWhere("description", "like", `%${keywords}%`);
        })
        .count("id as count")
        .first();
      
      const count = totalResult?.count || 0;

      const list = await Chan.db("cms_article as a")
        .select(
          "a.id", "a.title", "a.shortTitle", "a.img",
          "a.description", "a.createdAt", "a.author", "a.pv",
          "c.pinyin", "c.name", "c.path"
        )
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .where("a.status", 0)
        .where(function() {
          this.where("a.title", "like", `%${keywords}%`)
            .orWhere("a.description", "like", `%${keywords}%`);
        })
        .orderBy("a.createdAt", "desc")
        .offset(offset)
        .limit(pageSize);

      return { search: { count, list } };
    }

    const apiCalls = getApiCalls(
      config,
      {
        keywords,
        page,
      },
      common
    );

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  async tag({ path, page = 1 }) {
    const config = Chan.config.data.tags;

    // 如果没有配置tags，使用默认查询
    if (!config || Object.keys(config).length === 0) {
      const tags = await common.tags({ path, page });
      return { tags };
    }

    const apiCalls = getApiCalls(
      config,
      {
        path,
        page,
      },
      common
    );
    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));
    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });
    return resultObject;
  },
};

export default home;
