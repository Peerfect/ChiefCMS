import path from "path";
import { safePathSchema } from "../../../middleware/guard.js";
import { Controller, helper, common } from "chanjs";
import article from "../service/article.js";

const { delImg, formatDateFields } = helper;
const { success, fail } = common;
const { config } = Chan;
const { APP_VERSION, APP_NAME, port, APP_VERSION_TIME, APP_AUTHOR_EMAIL, APP_AUTHOR_WECHAT } = config;

class ArticleController extends Controller {
  constructor() {
    super();
  }
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      
      const data = await article.create(body);
      res.json(this.success(data));
    } catch (err) {
      console.error('[ArticleController.create] 错误:', err);
      next(err);
    }
  }

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await article.delete(id);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 改
  async update(req, res, next) {
    try {
      let body = req.body;
      const data = await article.update(body);
      res.json(this.success(data));
    } catch (err) {
      console.error('[ArticleController.update] 错误:', err);
      next(err);
    }
  }

  // 查
  async find(req, res, next) {
    try {
      const data = await article.find();
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await article.detail(id);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 搜索
  async search(req, res, next) {
    try {
      const { page, keyword, cid = 0, pageSize = 20 } = req.query;
      const data = await article.search(keyword, page, pageSize, +cid);
      data.list = formatDateFields(data.list);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 列表
  async list(req, res, next) {
    try {
      const { page, cid, pageSize = 10 } = req.query;
      const data = await article.list(page, pageSize, cid);
      data.list = formatDateFields(data.list);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 上传图片
  async upload(req, res, next) {
    try {
      let file = req.files;
      const { originalname, filename, path } = file[0];
      res.json(this.success({
        data: {
          link: path.replace("app", ""),
          domain: req.hostname,
          originalname,
          filename,
          path: "/" + path.replace(/\\/g, "/").replace(/^app\//, ""),
        },
      }));
    } catch (err) {
      next(err);
    }
  }

  async findField(req, res, next) {
    try {
      const { cid } = req.query;
      const data = await article.findField(cid);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  async statistics(req, res, next) {
    try {
      const result = await article.tongji();
      res.json(this.success({
        data: result.data
      }));
    } catch (err) {
      next(err);
    }
  }

};

export default new ArticleController();
