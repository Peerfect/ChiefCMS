import { Controller, helper, common } from "chanjs";
import commonService from "../service/common.js";
import home from "../service/home.js";

import {
  homeView,
  listGetParams,
  listDataParse,
  articleGetParams,
  articleDataParse,
  searchParams,
  searchDataParse,
  tagParams,
  tagDataParse,
  parseJsonFields,
} from "../utils/index.js";

const { getChildrenId } = common;
const { treeById, htmlEncode } = helper;

class HomeController extends Controller {
  // 首页
  async index(req, res, next) {
    try {
      const { nav, template, category, tag, friendlink, frag } = req.app.locals;
      const defaultView = homeView(nav);
      const data = await home.home(category);
      // 确保模板中所有变量有默认值，防止配置缺失时报错
      const safeData = {
        banner: [],
        top: null,
        news: [],
        article: { list: [] },
        articleList: { total: 0, current: 1, pageSize: 10, list: [] },
        imgs: [],
        frag: frag || {},
        recommend: [],
        tag: tag || [],
        friendlink: friendlink || [],
        recommendImgs: [],
        ...data,
      };
      res.render(`${template}/${defaultView}`, { ...safeData, nav, cate: {} });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // 列表页
  async list(req, res, next) {
    try {
      const { template, category, cate, cid, page } = listGetParams(req);
      if (!cid) {
        return await res.render(`${template}/404.html`);
      }
      const data = await home.list({ cid, page, categoryList: category });
      const { pageHtml, view, position, subnav } = listDataParse({
        cid,
        category,
        cate,
        page,
        data,
      });
      await res.render(`${template}/${view}`, {
        position,
        subnav,
        cate,
        pageHtml,
        ...data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // 详情页
  async article(req, res, next) {
    try {
      let { id, template, category } = articleGetParams(req);
      if (!id) {
        await res.render(`${template}/404.html`);
        return;
      }
      // 文章详情
      const article = await commonService.article(id);

      if (!article) {
        await res.render(`${template}/404.html`);
        return;
      }

      // 非阻塞增加浏览量
      setImmediate(() => commonService.count({ id }));
      // 前端显示时 pv +1
      article.pv = (article.pv || 0) + 1;

      //栏目id
      const cid = article.cid || "";
      let { cate, position, view } = articleDataParse({
        article,
        cid,
        category,
      });
    
      //热门 推荐 图文 上一页 下一页 count
      const data = await home.article({ id, cid, categoryList: category });

      await res.render(`${template}/${view}`, {
        ...data,
        cate,
        article,
        position,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // 单页 ，分两种情况，一种单个单页，一个
  async page(req, res, next) {
    try {
      const { cate, id } = req.params;
      const { category, template } = req.app.locals;
      const resolveTemplate = (name) => `${template}/${name}`;
      // 并行获取关键数据
      const [navSub, initialArticle] = await Promise.all([
        cate ? getChildrenId(cate, category) : null,
        id ? commonService.article(id) : null,
      ]);

      // 统一访问校验
      const cid = initialArticle?.cid || navSub?.cate?.id;
      if (!(id || cate) || !cid) {
        return res.render(resolveTemplate("404.html"));
      }

      // 获取页面数据
      const pageData = await home.page({ cid, categoryList: category });
      const list = pageData?.page?.list || [];
      let article = initialArticle || {};

      // 处理文章数据
      if (list.length > 0 && !initialArticle) {
        article = await commonService.article(list[0].id);
      }

      // 优先级：文章的articleView > 分类的articleView > 默认page.html
      let viewTemplate = article.articleView || navSub?.cate?.articleView || "page.html";

      // 非阻塞计数更新
      if (article.id) {
        setImmediate(() => commonService.count({ id: article.id }));
      }
      // 渲染响应
      return res.render(resolveTemplate(viewTemplate), {
        ...pageData,
        cate: navSub?.cate,
        position: article.cid ? treeById(article.cid, category) : [],
        article,
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Page Error:`, error.stack);
      next(error);
    }
  }

  // 搜索页
  async search(req, res, next) {
    try {
      let { page, template, keywords } = searchParams(req);
      const data = await home.search({ keywords, page });
      let { pageHtml } = searchDataParse({ data, keywords, page });
      await res.render(`${template}/search.html`, {
        keywords,
        ...data,
        pageHtml,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // tag
  async tag(req, res, next) {
    try {
      let { page, template, path, tag } = tagParams(req);
      let data = await home.tag({ path, page });
      let { pageHtml } = tagDataParse({ data, page, tag, path });
      await res.render(`${template}/tag.html`, {
        ...data,
        path,
        tag,
        pageHtml,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

export default new HomeController();
