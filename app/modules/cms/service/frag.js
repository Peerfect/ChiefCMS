import { Service, helper } from "chanjs";

const { formatDateFields } = helper;

class FragService extends Service {
  constructor() {
    super("cms_frag");
  }

  // 新增
  async create(body) {
    const res = await this.insert(body);
    return res;
  }

  // 删
  async delete(id) {
    const res = await this.deleteById(id);
    return res;
  }

  // 修改
  async update(body) {
    const { id, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }

  // 获取全量frag，默认100个page = 1,
  async list(page = 1, pageSize = 10) {
    const total = await this.db(this.tableName).count("id", { as: "count" });
    const offset = parseInt((page - 1) * pageSize);
    const list = await this.db
      .select(["id", "name", "mark", "content", "createdAt", "updatedAt"])
      .from(this.tableName)
      .limit(pageSize)
      .offset(offset)
      .orderBy("id", "desc");

    const formattedList = formatDateFields(list, ['createdAt', 'updatedAt']);
    const count = total[0].count || 1;
    return {
      success: true,
      code: 200,
      msg: '查询成功',
      data: {
        list: formattedList,
        total: count,
        current: page,
        pageSize: pageSize,
      },
    };
  }

  // 查
  async detail(id) {
    const res = await this.findById(id, {
      fields: ["id", "name", "mark", "content", "type"],
    });
    return res;
  }

  // 搜索
  async search(key = "", page = 1, pageSize = 10) {
    const dbType = process.env.DB_TYPE || 'mysql';

    // 根据数据库类型选择查询方式（SQLite 不支持 COLLATE）
    const total = key
      ? await this.db(this.tableName)
          .where(dbType === 'sqlite' ? 'name' : this.db.raw('name COLLATE utf8mb4_general_ci'), 'like', `%${key}%`)
          .count("id", { as: "count" })
      : await this.db(this.tableName).count("id", { as: "count" });

    const offset = parseInt((page - 1) * pageSize);
    const list = key
      ? await this.db(this.tableName)
          .select(["id", "name", "mark", "updatedAt"])
          .where(dbType === 'sqlite' ? 'name' : this.db.raw('name COLLATE utf8mb4_general_ci'), 'like', `%${key}%`)
          .limit(pageSize)
          .offset(offset)
          .orderBy("id", "desc")
      : await this.db(this.tableName)
          .select(["id", "name", "mark", "updatedAt"])
          .limit(pageSize)
          .offset(offset)
          .orderBy("id", "desc");

    const count = total[0].count || 1;
    const formattedList = formatDateFields(list, ['createdAt', 'updatedAt']);
    return {
      success: true,
      code: 200,
      msg: '查询成功',
      data: {
        list: formattedList,
        total: count,
        current: page,
        pageSize: pageSize,
      },
    };
  }
}

export default new FragService();
