import { Service } from "chanjs";

class TagService extends Service {
  constructor() {
    super("cms_tag");
  }

  // 新增
  async create(body) {
    const res = await this.insert(body);
    return res;
  }

  async has(path) {
    const res = await this.findOne({ query: { path } });
    return Object.keys(res?.data||{}).length > 0;
  }

  // 删除tag ,需要删除cms_articleTag.js 里面的tid
  async delete(id) {
    const has = await this.db.raw(
      `SELECT tid FROM cms_articletag WHERE tid = ?`, // 使用?作为参数占位符
      [id] // 参数单独传递
    );
    if (has[0] && has[0].length > 0) {
      return false;
    }
    const res = await this.deleteById(id);
    return res;
  }

  // 修改
  async update(body) {
    const { id } = body;
    delete body.id;
    const res = await this.updateById(id, body);
    return res;
  }

  // 文章列表
  async list(page = 1, pageSize = 20) {
    const total = await this.db(this.tableName).count("id", { as: "count" });
    const offset = parseInt((page - 1) * pageSize);
    const list = await this.db
      .select(["id", "name", "path"])
      .from(this.tableName)
      .limit(pageSize)
      .offset(offset)
      .orderBy("id", "desc");
    const count = total[0].count || 1;
    return {
      success: true,
      code: 200,
      msg: '查询成功',
      data: {
        total: count,
        current: +page,
        pageSize: pageSize,
        list: list,
      },
    };
  }

  async hot(size = 20) {
    const list = await this.db
      .select(["id", "name", "path", "count"])
      .from(this.tableName)
      .orderBy("count", "desc")
      .limit(size);
    return list;
  }

  // 查
  async detail(id) {
    const data = await this.db(this.tableName).where("id", "=", id).select();
    if (!data || data.length === 0) {
      return {
        success: false,
        code: 404,
        msg: "标签不存在",
        data: null
      };
    }
    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: data[0]
    };
  }

  // 搜索
  async search(key = "", page = 1, pageSize = 10) {
    const dbClient = process.env.DB_CLIENT || 'mysql2';
    
    // 根据数据库类型选择查询方式（SQLite 不支持 COLLATE）
    const total = key
      ? await this.db(this.tableName)
          .where(dbClient === 'better-sqlite3' ? 'name' : this.db.raw('name COLLATE utf8mb4_general_ci'), 'like', `%${key}%`)
          .count("id", { as: "count" })
      : await this.db(this.tableName).count("id", { as: "count" });

    const offset = parseInt((page - 1) * pageSize);
    const list = key
      ? await this.db
          .select(["id", "name", "path"])
          .from(this.tableName)
          .where(dbClient === 'better-sqlite3' ? 'name' : this.db.raw('name COLLATE utf8mb4_general_ci'), 'like', `%${key}%`)
          .limit(pageSize)
          .offset(offset)
          .orderBy("id", "desc")
      : await this.db
          .select(["id", "name", "path"])
          .from(this.tableName)
          .limit(pageSize)
          .offset(offset)
          .orderBy("id", "desc");
    const count = total[0].count ||1;
    return {
      success: true,
      code: 200,
      msg: '查询成功',
      data: {
        total: count,
        current: +page,
        pageSize: pageSize,
        list: list,
      },
    };
  }
}

export default new TagService();
