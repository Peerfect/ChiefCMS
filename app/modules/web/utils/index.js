import { helper, common } from "chanjs";
import { htmlDecode } from "chanjs/helper/html.js";

const { config, treeById, filterFields } = helper;
const { pages, getChildrenId } = common;

/**
 * @description 根据导航栏目获取首页视图文件
 * @param {*} nav 导航栏目
 */
export const homeView = (nav) => {
  let view = "index.html";
  if (
    Array.isArray(nav) &&
    nav.length > 0 &&
    nav[0].pinyin == "home" &&
    nav[0].listView &&
    nav[0].listView !== "list.html"
  ) {
    const { type, listView, articleView } = nav[0];
    // type: 0-栏目(渲染列表模板) 1-页面(渲染内容模板)
    view = type == '0' ? listView : articleView;
  }
  return view;
};

/**
 * @description 获取列表页参数
 * @param {*} req
 * @returns {object}
 */
export const listGetParams = (req) => {
  const { template, category } = req.app.locals;

  const { cate = "", cid } = req.params;
  const page = parseInt(req.params.current, 10) || 1;
  // 当前栏目和当前栏目下所有子导航
  const navSub = getChildrenId(cate || cid, category);
  const _cate = navSub?.cate || {};
  const id = cid || _cate.id;
  return { template, category, cate: _cate, cid: id, page };
};

/**
 * @description 列表页数据解析
 * @param {*} param0
 * @returns {object}
 */
export const listDataParse = ({ cid, category, cate, page, data }) => {
  let id = cid || cate.id;
  let position = treeById(id, category).filter((item) => item); // 确保过滤掉可能的空值

  //当前位置
  const positionField = ["id", "name", "path"];
  position = filterFields(position, positionField);

  //文章数量
  const count = data?.articleList?.total || 0;
console.log('文章数量', count);
console.log('position', data);
  // 分页
  let pageHtml = "";
  if (position.length > 0 && count > 0) {
    const lastPath = position[position.length - 1].path; // 提前存储最后一个元素的路径
    const href = `${lastPath}/index`;
    pageHtml = pages(
      page,
      count,
      data?.articleList?.pageSize || 10,
      href
    );

    console.log('pageHtml', pageHtml);
  }

  // 查找子栏目（包括当前栏目和所有子栏目）
  const subnav = category.filter((item) => item.pid === id || item.id === id);

  // 为 cate 对象添加 children 属性
  const children = category.filter((item) => item.pid === id);
  if (children.length > 0) {
    cate.children = children;
  }

  // 获取模板
  const view = cate?.listView || "list.html";
  return { pageHtml, view, position, subnav, cate };
};

export const articleGetParams = (req) => {
  const { template, category } = req.app.locals;
  let { id } = req.params;
  if (id.includes(".html")) {
    id = id.replace(".html", "");
  }
  return { id, template, category };
};

export const articleDataParse = ({ article, cid, category }) => {
  article.content = htmlDecode(article.content);
  // 当前栏目和当前栏目下所有子导航
  const navSub = getChildrenId(cid, category);
  let cate = navSub?.cate || {};
  // 当前位置
  const position = treeById(cid, category);
  //获取模板
  let view = article.articleView || cate.articleView;
  return { article, cate, position, view };
};

export const searchParams = (req) => {
  const { template } = req.app.locals;
  const { keywords, current = 1 } = req.params;
  let key = keywords.slice(0, 10);
  const page = +current;
  return { page, template, keywords: key };
};

export const searchDataParse = ({ data, keywords, page }) => {
  // 分页
  let { count = 0, list = [] } = data.search;
  let href = `/search/${keywords}/words`;

  let pageHtml = pages(
    page,
    count,
    data?.search?.search?.params?.pageSize || 10,
    href
  );

  list.forEach((ele) => {
    ele.titles = ele.title.replace(
      new RegExp(keywords, "gi"),
      `<span class='c-red'>${keywords}</span>`
    );
  });

  return { list, pageHtml };
};

export const tagParams = (req) => {
  const { template } = req.app.locals;
  const { path, current = 1 } = req.params;
  const tag = req.query.tag || path;
  const page = +current;
  return { page, template, path, tag };
};

export const tagDataParse = ({ data, page, tag, path }) => {
  //分页
  let { count } = data.tags;
  let href = `/tags/${path}/tag`;
  let query = `?tag=${tag}`;
  let pageHtml = pages(
    page,
    count,
    data?.tag?.tags?.params?.pageSize || 10,
    href,
    query
  );
  return { pageHtml };
};

export const getApiCalls = (
  config = {}, //配置接口参数
  options = {}, //动态参数
  common // mysql通用查询方法
) => {
  let apiCalls = {};

  if (!common || typeof common !== 'object') {
    console.error("getApiCalls: common is not a valid object");
    return apiCalls;
  }

  if (Object.keys(config).length === 0) {
    return apiCalls;
  }

  const { cid } = options;

  for (let key in config) {
    if (config[key].show === false) continue;

    const cfg = config[key];

    if (!cfg.method) {
      console.warn(`getApiCalls: method is missing for key ${key}`);
      continue;
    }

    if (typeof common[cfg.method] !== 'function') {
      console.warn(`Method ${cfg.method} not found in common module for key ${key}`);
      continue;
    }

    const apiMethod = common[cfg.method];

    let params = {
      ...(cfg.params || {}),
      ...options,
    };

    // 如果配置中没有指定cid，则默认使用当前栏目的cid
    if ((cfg.params === undefined || cfg.params.cid === undefined) && cid !== undefined) {
      params.cid = cid;
    }

    if (cfg.cid !== undefined) {
      if (cid === undefined || cfg.cid != cid) {
        continue;
      }
    }

    apiCalls[key] = apiMethod(params)
      .then((data) => {
        if (data === null || data === undefined) {
          return cfg.field ? {} : null;
        }
        if (cfg.field && Array.isArray(data)) {
          return filterFields(data, cfg.field);
        }
        if (cfg.field && typeof data === 'object') {
          return filterFields([data], cfg.field)[0] || data;
        }
        return data;
      })
      .catch((error) => {
        console.error(`Error calling ${cfg.method} for key ${key}:`, error);
        return cfg.field ? {} : null;
      });
  }

  return apiCalls;
};

export const parseJsonFields = (obj) => {
  const result = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const value = obj[key];
    // 如果是字符串，并且看起来像 JSON（以 { 或 [ 开头）
    if (
      typeof value === "string" &&
      (value.startsWith("{") || value.startsWith("["))
    ) {
      try {
        result[key] = JSON.parse(value);
      } catch (e) {
        console.warn(`JSON parse failed for field: ${key}`, e);
        result[key] = value; // 保留原始值
      }
    } else {
      result[key] = value;
    }
  }

  return result;
};
