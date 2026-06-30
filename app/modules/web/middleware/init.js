import { helper, cache } from "chanjs";
const { tree } = helper;
const { config } = Chan;
const { template, APP_VERSION, CACHE, WEB_CACHE_KEY } = config;

import home from "../service/home.js";

config.data = config.data || {};

export default () => {
  return async (req, res, next) => {
    try {
      // 缓存优化：命中缓存时也要把数据写回 locals，否则进程重启后 app.locals 为空会导致 site/category undefined
      if (CACHE) {
        const cachedData = cache.get(WEB_CACHE_KEY);
        if (cachedData) {
          Object.assign(req.app.locals, cachedData);
          return next();
        }
      }

      let { appName, version } = config;

      // 查询 cms_data 配置
      const configData = await Chan.db("sys_config").where("type_code", "cms_data").select();

      // cms_data 配置
      configData.forEach(item => {
        config.data[item.config_key] = item.config_value;
      });

      // 站点数据（site、category、friendlink、frag、tag）
      const { site, category, friendlink, frag, tag } = await home.init();
      const nav = tree(category || []);

      // 模板配置
      const { domain = "", template: dbTemplate = "" } = site || {};
      const finalTemplate = dbTemplate || template || "default";
      config.template = finalTemplate;
      config.data.site = site || {};

      const localsData = {
        appName,
        version,
        template: finalTemplate,
        domain: domain || "",
        static_url: `/public/view/${finalTemplate}/`,
        APP_VERSION,
        site: site || {},
        nav,
        category: category || [],
        friendlink: friendlink || [],
        frag: frag || [],
        tag: tag || [],
      };

      // 加载广告数据（cid=33 广告招商）
      try {
        const ads = await Chan.db("cms_article")
          .select("id", "title", "img", "link")
          .where("cid", 33);
        localsData.ads = ads || [];
      } catch (e) {
        localsData.ads = [];
      }

      Object.assign(req.app.locals, localsData);

      // 写入缓存
      CACHE && cache.set(WEB_CACHE_KEY, localsData);

      await next();
    } catch (error) {
      next(error);
    }
  };
};