const { config } = Chan;
const { template, APP_VERSION, cache } = config;

export default () => {
  return async (req, res, next) => {
    try {
      if (config.data?.loaded && cache) {
        await next();
        return;
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

      Object.assign(req.app.locals, {
        template: _template,
        domain,
        static_url: `/public/view/${_template}/`,
        APP_VERSION: APP_VERSION,
      });

      //加载完成标识
      Chan.config.data.loaded = true;
      await next();
    } catch (error) {
      next(error);
    }
  };
};