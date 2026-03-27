import path from "path";
import fs from "fs";
import { Controller, helper, common, Paths } from "chanjs";
import sysApp from "../service/sysApp.js";

const { success, getHtmlFilesSync } = common;
const { getFolders } = helper;

class SysAppController extends Controller {
  // 查
  async find(req, res, next) {
    try {
      const data = await sysApp.find();
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 查
  async getViews(req, res, next) {
    try {
      let _template = Chan.config.template;
      const viewsPath = path.join(Paths.rootPath, `/view/${_template}`);
      const data = getHtmlFilesSync(viewsPath);
     res.json(this.success({ data }));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 获取模板文件
   */
  async folder(req, res, next) {
    try {
      let _template = Chan.config.template;
      const dir = path.join(Paths.rootPath, `/view`);
      const folders = getFolders(dir);
      res.json(this.success({ data: folders }));
    } catch (err) {
      next(err);
    }
  }

  // app配置
  // async config(req, res, next) {
  //   try {
  //     const data = await sysApp.config();
  //    res.json(this.success(data));
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await sysApp.update(body);
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }
}

export default new SysAppController();
