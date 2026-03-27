import { Service } from "chanjs";

class FavoriteService extends Service {
  constructor() {
    super("member_favorite");
  }

  async list(memberId, page = 1, pageSize = 10) {
    const total = await this.db(this.tableName)
      .where({ member_id: memberId })
      .count("id", { as: "count" });

    const offset = parseInt((page - 1) * pageSize);
    const list = await this.db(this.tableName)
      .select([
        "member_favorite.id",
        "member_favorite.article_id",
        "member_favorite.article_title as article_title",
        "member_favorite.article_cover as article_cover",
        "member_favorite.article_summary as article_summary",
        "member_favorite.article_url as article_url",
        "member_favorite.createdAt",
      ])
      .where({ member_id: memberId })
      .orderBy("member_favorite.createdAt", "desc")
      .limit(pageSize)
      .offset(offset);

    const count = total[0].count || 0;
    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: {
        list: list,
        total: count,
        page: parseInt(page),
        pageSize: pageSize,
      },
    };
  }

  async add(memberId, articleId, articleTitle, articleCover, articleSummary, articleUrl) {
    const existing = await this.db(this.tableName)
      .where({ member_id: memberId, article_id: articleId })
      .first();

    if (existing) {
      return {
        success: false,
        code: 400,
        msg: "已收藏该文章",
        data: null,
      };
    }

    const res = await this.insert({
      member_id: memberId,
      article_id: articleId,
      article_title: articleTitle,
      article_cover: articleCover,
      article_summary: articleSummary,
      article_url: articleUrl,
    });
    return {
      success: true,
      code: 200,
      msg: "收藏成功",
      data: res,
    };
  }

  async delete(id, memberId) {
    const res = await this.db(this.tableName)
      .where({ id, member_id: memberId })
      .delete();
    return res;
  }

  async adminList(page = 1, pageSize = 10) {
    const total = await this.db(this.tableName).count("member_favorite.id", { as: "count" });

    const offset = parseInt((page - 1) * pageSize);
    const list = await this.db(this.tableName)
      .select([
        "member_favorite.id",
        "member_favorite.article_id",
        "member_favorite.article_title",
        "member_favorite.article_cover",
        "member_favorite.createdAt",
        "member.username",
        "member.nickname",
      ])
      .join("member", "member_favorite.member_id", "member.id")
      .orderBy("member_favorite.createdAt", "desc")
      .limit(pageSize)
      .offset(offset);

    const count = total[0].count || 0;
    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: {
        list: list,
        total: count,
        page: parseInt(page),
        pageSize: pageSize,
      },
    };
  }

  async adminDelete(id) {
    const res = await this.deleteById(id);
    return res;
  }
}

export default new FavoriteService();