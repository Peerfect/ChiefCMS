import { Service } from "chanjs";

class MemberService extends Service {
  constructor() {
    super("member");
  }

  // ========== 原有 User.js 的方法 ==========
  async findUser(username) {
    const res = await this.findOne({
      query: { username },
      fields: ["id", "username", "email", "password", "avatar", "nickname", "sex", "phone", "wechat", "status"],
    });
    return res;
  }

  async findUserByField(value, field = "username") {
    const res = await this.findOne({
      query: { [field]: value },
      fields: ["id", "username", "email", "password", "avatar", "nickname", "sex", "phone", "wechat", "status"],
    });
    return res;
  }

  async queryPass(id) {
    const res = await this.findById(id, {
      fields: ["password"],
    });
    return res;
  }

  async find(email) {
    const res = await this.query({
      query: { email },
      fields: ["id", "email"],
    });
    return res;
  }

  async detail(id) {
    const res = await this.findById(id, {
      fields: [
        "id",
        "nickname",
        "username",
        "sex",
        "email",
        "wechat",
        "phone",
        "avatar",
        "status",
        "createdAt",
        "remark",
        "loginDate",
      ],
    });
    return res;
  }

  async delete(id) {
    const res = await this.deleteById(id);
    return res;
  }

  async create(body) {
    const result = await this.insert(body);
    return result;
  }

  async update({ query, data }) {
    const result = await this.updateByQuery({ query, data });
    return result;
  }

  // ========== 会员管理后台方法 ==========
  // 列表
  async list(page = 1, pageSize = 10) {
    const countQuery = this.db(this.tableName).count("* as count");
    const total = await countQuery;
    
    const offset = parseInt((page - 1) * pageSize);
    const listQuery = this.db(this.tableName)
      .select(
        "id",
        "username",
        "nickname",
        "avatar",
        "status",
        "email",
        "phone",
        "createdAt",
        "updatedAt"
      )
      .limit(pageSize)
      .offset(offset)
      .orderBy("id", "desc");
    
    const list = await listQuery;

    const count = total[0]?.count || 0;
    return {
      success: true,
      code: 200,
      msg: '查询成功',
      data: {
        total: count,
        page: parseInt(page),
        pageSize: pageSize,
        list: list,
      }
    };
  }

  // 搜索
  async search(keyword, page = 1, pageSize = 10) {
    const query = this.db(this.tableName)
      .where("username", "like", `%${keyword}%`)
      .orWhere("nickname", "like", `%${keyword}%`);
    
    const total = await query.clone().count("id", { as: "count" });
    const offset = parseInt((page - 1) * pageSize);
    
    const list = await query
      .select(
        "id",
        "username",
        "nickname",
        "avatar",
        "status",
        "email",
        "phone",
        "createdAt",
        "updatedAt"
      )
      .limit(pageSize)
      .offset(offset)
      .orderBy("id", "desc");

    const count = total[0].count || 0;
    return {
      success: true,
      code: 200,
      msg: '查询成功',
      data: {
        total: count,
        page: parseInt(page),
        pageSize: pageSize,
        list: list,
      }
    };
  }

  // 更新状态（启用/禁用）
  async updateStatus(id, status) {
    const res = await this.updateById(id, { status });
    return res;
  }
}

export default new MemberService();
