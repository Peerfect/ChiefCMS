import { Controller, helper, common, cache, config } from "chanjs";
import frag from "../service/frag.js";
import { clearWebCache } from "../../../common/cacheclear.js";

const { success } = common;
const { formatDateFields } = helper;
const { WEB_CACHE_KEY } = config;

class FragController extends Controller {
  constructor() {
    super();
  }
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await frag.create(body);
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
      const data = await frag.delete(id);
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
      const data = await frag.update(body);
      clearWebCache(req);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 查
  async find(req, res, next) {
    try {
      const data = await frag.detail();
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await frag.detail(id);
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 搜索
  async search(req, res, next) {
    try {
      const { page, keywords, pageSize = 20 } = req.query;
      const data = await frag.search(keywords, page, pageSize);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 列表
  async list(req, res, next) {
    try {
      const { page, pageSize = 10 } = req.query;
      const data = await frag.list(page, pageSize);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }
}

export default new FragController();
