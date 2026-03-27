import { Service } from "chanjs";

class Config extends Service {
  constructor() {
    super("sys_config");
  }

  /**
   * @description 重写query方法，修复count查询没有应用条件的问题
   * @param {Object} options - 查询选项
   * @returns {Promise<Object>} 分页结果
   */
  async query({ current = 1, pageSize = 10, query = {}, sort = {}, field = [] }) {
    this._checkDB();
    
    const size = Math.min(Math.max(pageSize, 1), this.limit);
    const offset = (current - 1) * size;

    let countQuery = this.db(this.tableName);
    let dataQuery = this._buildBaseQuery({ query, sort, fields: field });

    if (Object.keys(query).length) {
      countQuery = countQuery.where(query);
    }

    const [totalResult, list] = await Promise.all([
      countQuery.count("* as total").first(),
      dataQuery.offset(offset).limit(size),
    ]);

    const total = Number(totalResult?.total ?? 0);
    const totalPages = Math.ceil(total / size);

    return { success: true, code: 200, msg: '查询成功', data: { list, total, current, pageSize: size, totalPages } };
  }

  /**
   * @description 根据菜单ID查找菜单信息
   * @param {number} id - 菜单ID
   * @returns {Promise<Object|null>} 返回找到的菜单对象或null
   */
  async detail(id) {
    const res = await this.findById(id, {
      fields: [
        "id",
        "type_code",
        "config_key",
        "config_value",
        "status",
        "remark",
      ],
    });
    return res;
  }

  /**
   * @description 删除菜单
   * @param {number} id - 要删除的菜单ID
   * @returns {Promise<boolean>} 操作是否成功
   */
  async delete(id) {
    let res = await this.deleteById(id);
    return res;
  }

  /**
   * @description 获取分页菜单列表
   * @param {Object} options - 分页查询参数
   * @returns {Promise<Object>} 包含菜单列表、总数等信息的对象
   */
  async list({
    query,
    fields = [
      "id",
      "type_code",
      "config_key",
      "config_value",
      "status",
      "remark",
    ],
  }) {
    let res = await this.query({
      current: 1,
      pageSize: this.limit,
      query,
      fields,
    });
    return res;
  }

  // 增
  async create(body) {
    const res = await this.insert(body);
    return res;
  }

  async update(body) {
    const { id, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }

  async updateMany(updates = []) {
    const res = await super.updateMany(updates);
    return res;
  }
}

export default new Config();
