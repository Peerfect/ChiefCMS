import { cache } from "chanjs";
const { config } = Chan;
const { CACHE } = config;

config.upload = config.upload || {};

export default () => {
  return async (req, res, next) => {
    try {
      // 缓存优化：直接读取，不重复查询
      if (CACHE && Object.keys(config.upload || {}).length > 0) {
        return await next();
      }

      // 全局模板初始化
     const site = await Chan.db("cms_site").first();
      config.template = site?.template || config.template || "default";

      // 查询上传配置
      const uploadConfig = await Chan.db("sys_config")
        .where("type_code", "upload_config")
        .select();

      // 上传配置
      uploadConfig.forEach(item => {
        config.upload[item.config_key] = parseInt(item.config_value) || 0;
      });

      await next();
    } catch (error) {
      console.error("base模块配置中间件错误：", error);
      next(error);
    }
  };
};