import { Service } from "chanjs";

class SlideService extends Service {
  constructor() {
    super("cms_slide");
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

  // 改
  async update(body) {
    const { id, createdAt, updatedAt, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }

  // 列表
  async list(page = 1, pageSize = 10) {
    const res = await this.query({
      current: page,
      pageSize: pageSize,
      fields: ["id", "title", "imgUrl", "linkUrl", "status", "sort"]
    });
    return res;
  }

  // 查
  async detail(id) {
    const res = await this.findById(id);
    return res;
  }

  // 搜索
  async search(keyword = '', page = 1, pageSize = 10, cid = 0) {
    // 分页参数
    const current = Math.max(1, parseInt(page) || 1);
    const size = Math.max(1, parseInt(pageSize) || 10);
    const offset = (current - 1) * size;
    
    // 构建查询条件
    const buildQuery = (query) => {
      if (keyword) {
        query = query.where("title", "LIKE", `%${keyword}%`);
      }
      return query;
    };

    // 计算总数
    let countQuery = this.db(this.tableName);
    countQuery = buildQuery(countQuery);
    const totalResult = await countQuery.count("* as total").first();
    const total = parseInt(totalResult?.total || 0, 10);
    
    // 查询列表
    let listQuery = this.db(this.tableName);
    listQuery = buildQuery(listQuery);
    const list = await listQuery
      .select(["id", "title", "imgUrl", "linkUrl", "status", "sort", "createdAt"])
      .orderBy("sort", "asc")
      .orderBy("id", "desc")
      .offset(offset)
      .limit(size);

    return {
      total: total,
      current: current,
      pageSize: size,
      list: list
    };
  }
}

export default new SlideService();