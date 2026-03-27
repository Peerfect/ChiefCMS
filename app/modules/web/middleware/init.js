import { helper } from "chanjs";
const { tree } = helper;
const { config } = Chan;

import home from "../service/home.js";

export default () => {
  return async (req, res, next) => {
    try {
     
      let { env, appName, version, cache } = config;
      // 每次请求都刷新数据，确保导航一致
      // if ("nav" in req.app.locals && cache) {
      //   await next();
      //   return;
      // }
     
      // 站点
      const { site, category, friendlink, frag, tag } = await home.init();
      const nav = tree(category);
      Object.assign(req.app.locals, {
        appName,
        version,
        site,
        nav,
        category,
        friendlink,
        frag,
        tag,
      });
      
      await next();
    } catch (error) {
      next(error);
    }
  };
};
