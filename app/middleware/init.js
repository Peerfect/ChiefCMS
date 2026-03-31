import { cache } from "chanjs";
const { config } = Chan;
const { template, APP_VERSION, CACHE, CACHE_KEY } = config;

export default () => {
  return async (req, res, next) => {
    try {
      // 如果缓存开启，先尝试从缓存获取数据
      if (CACHE) {
        const cachedData = cache.get(CACHE_KEY);
        if (cachedData) {
          // 缓存命中，直接使用缓存数据
          Object.assign(req.app.locals, cachedData);
          await next();
          return;
        }
      }

      config.data = config.data || {};

      // 模板数据配置
      let configData = await Chan.db("sys_config")
        .where({
          type_code: "cms_data",
        })
        .select();

      for (const v of configData) {
        Chan.config.data[v.config_key] = JSON.parse(v.config_value);
      }

      // 上传配置
      let uploadConfig = await Chan.db("sys_config")
        .where({
          type_code: "upload_config",
        })
        .select();

      for (const v of uploadConfig) {
        Chan.config.upload[v.config_key] = parseInt(v.config_value);
      }

      // 站点信息
      let result = await Chan.db("cms_site")
        .select([
          "name",
          "logo",
          "domain",
          "email",
          "wx",
          "icp",
          "code",
          "json",
          "title",
          "keywords",
          "description",
          "template",
          "uploadWay",
        ])
        .first();

      Chan.config.data.site = result;
      const { domain = "" } = result;
      let _template = result.template || template;
      Chan.config.template = _template;

      const localsData = {
        template: _template,
        domain,
        static_url: `/public/view/${_template}/`,
        APP_VERSION: APP_VERSION,
      };

      Object.assign(req.app.locals, localsData);

      // 如果缓存开启，将数据存入缓存（默认 5 分钟过期）
      if (CACHE) {
        cache.set(CACHE_KEY, localsData);
      }
      await next();
    } catch (error) {
      next(error);
    }
  };
};
