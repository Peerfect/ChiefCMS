import { Controller, common, cache, Paths } from "chanjs";
const { config } = Chan;
const { success, fail } = common;
import { clearWebCache } from "../../../common/cacheclear.js";

import Site from "../service/Site.js";

class SiteController extends Controller {
  // 查
  async info(req, res, next) {
    try {
      const result = await Site.info();
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const result = await Site.updateInfo(body);
      clearWebCache(req);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  // 获取磁盘信息
  async runEnv(req, res, next) {
    try {
       res.json(this.success({ data: { dirname: Paths.rootPath }}));
    } catch (err) {
      next(err);
    }
  }

  // 获取应用基本信息
  async getAppInfo(req, res, next) {
    try {
      const result = await Site.appInfo();
      res.json(this.success({
        data: result
      }));
    } catch (err) {
      console.error('[SiteController.getAppInfo] 错误:', err);
      next(err);
    }
  }
}

export default new SiteController();
