import { Service } from "chanjs";

class SiteService extends Service {
  constructor() {
    super("cms_site");
  }

  // 基本信息
  async info() {
    const res = await this.findOne();
    return res;
  }

  // 更新基本信息
  async updateInfo(body) {
    const { id, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }

  // 获取应用基本信息
  async appInfo() {
    return {
      APP_VERSION: Chan.config.APP_VERSION,
      APP_NAME: Chan.config.APP_NAME,
      APP_VERSION_TIME: Chan.config.APP_VERSION_TIME,
      APP_AUTHOR_EMAIL: Chan.config.APP_AUTHOR_EMAIL,
      APP_AUTHOR_WECHAT: Chan.config.APP_AUTHOR_WECHAT,
    };
  }
}

export default new SiteService();