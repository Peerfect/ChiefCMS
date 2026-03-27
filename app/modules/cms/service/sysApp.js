import { Service } from "chanjs";

class SysAppService extends Service {
  constructor() {
    super("sys_config");
  }

  async find() {
    const res = await this.findOne();
    return res;
  }

  async update(body) {
    const { id } = body;
    delete body.id;
    delete body.createdAt;
    delete body.updatedAt;
    const res = await this.updateById(id, body);
    return res;
  }
}

export default new SysAppService();