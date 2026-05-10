import { Controller, common, cache, config } from "chanjs";
import tag from "../service/tag.js";
import { clearWebCache } from "../../../common/cacheclear.js";

const { success, fail } = common;
const { WEB_CACHE_KEY } = config;

class TagController extends Controller {
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await tag.create(body);
      clearWebCache(req);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await tag.delete(id);
      clearWebCache(req);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await tag.update(body);
      clearWebCache(req);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await tag.detail(id);
      if (!data.success) {
        return res.json(this.fail({ msg: data.msg, code: data.code }));
      }
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 列表
  async list(req, res, next) {
    try {
      const { page, pageSize = 50 } = req.query;
      const data = await tag.list(page, pageSize);
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  async has(req, res, next) {
    try {
      const { path } = req.query;
      const exists = await tag.has(path);
      if (exists) {
        res.json({ success: true, code: 200, msg: '标签已存在', data: true });
      } else {
        res.json({ success: true, code: 200, msg: '标签不存在', data: false });
      }
    } catch (err) {
      next(err);
    }
  }

  // 搜索
  async search(req, res, next) {
    try {
      const { page, keyword, pageSize = 10 } = req.query;
      const data = await tag.search(keyword, page, pageSize);
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }
}

export default new TagController();
