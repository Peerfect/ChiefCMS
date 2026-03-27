import { Service, helper } from "chanjs";

const { formatDateFields } = helper;

class CommentService extends Service {
  constructor() {
    super("member_comment");
  }
 
  /**
   * @description 获取用户评论列表
   * @param {string} memberId - 用户ID
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @returns {Object} - 评论列表对象
   */
  async list(memberId, page = 1, pageSize = 10) {
    const total = await this.db(this.tableName)
      .where({ member_id: memberId })
      .count("id", { as: "count" });

    const offset = parseInt((page - 1) * pageSize);
    const list = await this.db(this.tableName)
      .select([
        "member_comment.id",
        "member_comment.content",
        "member_comment.status",
        "member_comment.createdAt",
        "member_comment.like_count",
        "member_comment.parent_id",
        "member_comment.reply_to_member_id",
        "cms_article.id as articleId",
        "cms_article.title as articleTitle",
        "cms_category.path as articlePath",
      ])
      .join("cms_article", "member_comment.article_id", "cms_article.id")
      .join("cms_category", "cms_article.cid", "cms_category.id")
      .where({ "member_comment.member_id": memberId })
      .orderBy("member_comment.createdAt", "desc")
      .limit(pageSize)
      .offset(offset);

    const replyToMemberIds = new Set();
    list.forEach(comment => {
      if (comment.reply_to_member_id) {
        replyToMemberIds.add(comment.reply_to_member_id);
      }
    });

    const replyToMembers = {};
    if (replyToMemberIds.size > 0) {
      const members = await this.db("member")
        .select("id", "username", "nickname")
        .whereIn("id", Array.from(replyToMemberIds));
      members.forEach(m => {
        replyToMembers[m.id] = m.nickname || m.username;
      });
    }

    list.forEach(comment => {
      if (comment.reply_to_member_id && replyToMembers[comment.reply_to_member_id]) {
        comment.reply_to_username = replyToMembers[comment.reply_to_member_id];
      }
    });

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

  /**
   * @description 创建评论
   * @param {string} memberId - 用户ID
   * @param {string} articleId - 文章ID
   * @param {string} content - 评论内容
   * @param {string|null} parentId - 父评论ID
   * @param {string|null} replyToMemberId - 回复用户ID
   * @returns {Object} - 评论对象
   */
  async create(memberId, articleId, content, parentId = null, replyToMemberId = null) {
    const spamCheck = await this.checkSpam(memberId);
    if (!spamCheck.allowed) {
      return { success: false, msg: spamCheck.msg };
    }
    
    const cleanParentId = parentId && parentId !== 'undefined' ? parentId : null;
    const cleanReplyToMemberId = replyToMemberId && replyToMemberId !== 'undefined' ? replyToMemberId : null;
    
    // 插入评论
    const result = await this.insert({
      member_id: memberId,
      article_id: articleId,
      content: content,
      status: "2",
      parent_id: cleanParentId,
      reply_to_member_id: cleanReplyToMemberId,
    });
    
    let id;
    if (Array.isArray(result)) {
      id = result[0];
    } else if (typeof result === 'object' && result !== null) {
      if (result.data && result.data.insertId) {
        id = result.data.insertId;
      } else {
        id = result.insertId || result.id || result[0];
      }
    } else {
      id = result;
    }
    
    
    id = parseInt(id, 10);
    
    if (isNaN(id) || id <= 0) {
      return {
        id: null,
        content: content,
        status: "2",
        createdAt: new Date().toISOString(),
        parent_id: cleanParentId,
        reply_to_member_id: cleanReplyToMemberId,
        like_count: 0,
        username: null,
        nickname: null,
        avatar: null,
        member_id: memberId,
        replies: [],
        is_liked: false
      };
    }
    
    // 查询评论详情
    const comment = await this.db(this.tableName)
      .select([
        "member_comment.id",
        "member_comment.content",
        "member_comment.status",
        "member_comment.createdAt",
        "member_comment.parent_id",
        "member_comment.reply_to_member_id",
        "member_comment.like_count",
        "member.username",
        "member.nickname",
        "member.avatar",
        "member_comment.member_id",
      ])
      .join("member", "member_comment.member_id", "member.id")
      .where({ "member_comment.id": id })
      .first();
    
    const formattedComment = formatDateFields([comment], ['createdAt'])[0];
    formattedComment.replies = [];
    formattedComment.is_liked = false;
    
    return formattedComment;
  }

  /**
   * @description 获取评论配置
   * @returns {Object} - 评论配置对象
   */
  async getCommentConfig() {
    const configs = await this.db('sys_config')
      .where({ type_code: 'comment_config', status: '1' })
      .select('config_key', 'config_value');
    
    const configMap = {};
    configs.forEach(c => {
      configMap[c.config_key] = c.config_value;
    });
    
    return {
      minLength: parseInt(configMap.minLength) || 5,
      maxLength: parseInt(configMap.maxLength) || 500,
      maxLinks: parseInt(configMap.maxLinks) || 2,
      spamInterval: parseInt(configMap.spamInterval) || 60,
      spamLimit: parseInt(configMap.spamLimit) || 3,
      sensitiveWords: configMap.sensitiveWords || '',
      enableSensitiveFilter: configMap.enableSensitiveFilter === '1',
      enableXSSFilter: configMap.enableXSSFilter === '1',
      enableLinkFilter: configMap.enableLinkFilter === '1'
    };
  }

  /**
   * @description 检查评论是否为垃圾评论
   * @param {string} memberId - 用户ID
   * @returns {Object} - 检查结果对象
   */
  async checkSpam(memberId) {
    const config = await this.getCommentConfig();
    const interval = config.spamInterval;
    const limit = config.spamLimit;
    
    // 兼容 MySQL 和 SQLite 的日期查询
    const dbClient = process.env.DB_CLIENT || 'mysql2';
    let recentComments;
    
    if (dbClient === 'better-sqlite3') {
      // SQLite 使用 datetime 函数
      const cutoffTime = new Date(Date.now() - interval * 1000).toISOString();
      recentComments = await this.db(this.tableName)
        .where({ member_id: memberId })
        .where('createdAt', '>', cutoffTime)
        .orderBy('createdAt', 'desc')
        .limit(limit);
    } else {
      // MySQL 使用 DATE_SUB
      recentComments = await this.db(this.tableName)
        .where({ member_id: memberId })
        .whereRaw(`createdAt > DATE_SUB(NOW(), INTERVAL ? SECOND)`, [interval])
        .orderBy('createdAt', 'desc')
        .limit(limit);
    }
    
    if (recentComments.length >= limit) {
      return {
        allowed: false,
        msg: `评论过于频繁，请${config.spamInterval}秒后再试`
      };
    }
    
    return { allowed: true };
  }

  /**
   * @description 删除评论
   * @param {string} id - 评论ID
   * @param {string} memberId - 用户ID
   * @returns {Object} - 删除结果对象
   */
  async delete(id, memberId) {
    const res = await this.db(this.tableName)
      .where({ id, member_id: memberId })
      .delete();
    return res;
  }

  /**
   * @description 获取评论列表
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @param {string} status - 状态
   * @returns {Object} - 评论列表对象
   */
  async adminList(page = 1, pageSize = 10, status = "") {
    let countQuery = this.db(this.tableName);
    let listQuery = this.db(this.tableName);

    if (status) {
      countQuery = countQuery.where({ "member_comment.status": status });
      listQuery = listQuery.where({ "member_comment.status": status });
    }

    const total = await countQuery.count("member_comment.id", { as: "count" });

    const offset = parseInt((page - 1) * pageSize);
    const list = await listQuery
      .select([
        "member_comment.id",
        "member_comment.content",
        "member_comment.status",
        "member_comment.audit_time",
        "member_comment.audit_remark",
        "member_comment.createdAt",
        "member.username",
        "member.nickname",
        "cms_article.id as articleId",
        "cms_article.title as articleTitle",
      ])
      .join("member", "member_comment.member_id", "member.id")
      .join("cms_article", "member_comment.article_id", "cms_article.id")
      .orderBy("member_comment.createdAt", "desc")
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

  /**
   * @description 审核评论
   * @param {string} id - 评论ID
   * @param {string} status - 状态
   * @param {string} auditUserId - 审核用户ID
   * @param {string} auditRemark - 审核备注
   * @returns {Object} - 审核结果对象
   */
  async audit(id, status, auditUserId, auditRemark = "") {
    const res = await this.db(this.tableName)
      .where({ id })
      .update({
        status: status,
        audit_time: new Date(),
        audit_user_id: auditUserId,
        audit_remark: auditRemark,
      });
    return res;
  }

  /**
   * @description 删除评论
   * @param {string} id - 评论ID
   * @returns {Object} - 删除结果对象
   */
  async adminDelete(id) {
    const res = await this.deleteById(id);
    return res;
  }

  /**
   * @description 获取文章评论列表
   * @param {string} articleId - 文章ID
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @param {string} memberId - 用户ID
   * @returns {Object} - 评论列表对象
   */
  async articleComments(articleId, page = 1, pageSize = 10, memberId = null) {

    //获取
    const totalResult = await this.db(this.tableName)
      .where({ article_id: articleId, status: "2", parent_id: null })
      .count("id", { as: "count" });
    const total = totalResult[0].count || 0;

    const offset = parseInt((page - 1) * pageSize);
    const rootList = await this.db(this.tableName)
      .select([
        "member_comment.id",
        "member_comment.content",
        "member_comment.status",
        "member_comment.createdAt",
        "member_comment.parent_id",
        "member_comment.reply_to_member_id",
        "member_comment.like_count",
        "member.username",
        "member.nickname",
        "member.avatar",
        "member_comment.member_id",
      ])
      .join("member", "member_comment.member_id", "member.id")
      .where({ 
        "member_comment.article_id": articleId, 
        "member_comment.status": "2",
        "member_comment.parent_id": null 
      })
      .orderBy("member_comment.createdAt", "desc")
      .limit(pageSize)
      .offset(offset);

    const rootIds = rootList.map(c => c.id);
    let allRepliesList = [];
    
    if (rootIds.length > 0) {
      //获取所有回复评论
      const repliesList = await this.db(this.tableName)
        .select([
          "member_comment.id",
          "member_comment.content",
          "member_comment.status",
          "member_comment.createdAt",
          "member_comment.parent_id",
          "member_comment.reply_to_member_id",
          "member_comment.like_count",
          "member.username",
          "member.nickname",
          "member.avatar",
          "member_comment.member_id",
        ])
        .join("member", "member_comment.member_id", "member.id")
        .where({ "member_comment.article_id": articleId, "member_comment.status": "2" })
        .whereNotNull("member_comment.parent_id")
        .orderBy("member_comment.createdAt", "asc");
      
      const allCommentsMap = {};
      rootList.forEach(c => {
        allCommentsMap[c.id] = { ...c, isReply: false };
      });
      repliesList.forEach(r => {
        allCommentsMap[r.id] = { ...r, isReply: true };
      });
      
      repliesList.forEach(reply => {
        let rootId = reply.parent_id;
        let parent = allCommentsMap[rootId];
        
        while (parent && parent.parent_id) {
          rootId = parent.parent_id;
          parent = allCommentsMap[rootId];
        }
        
        if (rootIds.includes(rootId)) {
          allRepliesList.push(reply);
        }
      });
    }

    const formattedRootList = formatDateFields(rootList, ['createdAt']);
    const formattedRepliesList = formatDateFields(allRepliesList, ['createdAt']);

    const commentMap = {};
    formattedRootList.forEach(comment => {
      comment.replies = [];
      comment.is_liked = false;
      commentMap[comment.id] = comment;
    });
    formattedRepliesList.forEach(reply => {
      reply.replies = [];
      reply.is_liked = false;
      commentMap[reply.id] = reply;
    });

    const replyToMemberIds = new Set();
    formattedRepliesList.forEach(reply => {
      if (reply.reply_to_member_id) {
        replyToMemberIds.add(reply.reply_to_member_id);
      }
    });

    const replyToMembers = {};
    if (replyToMemberIds.size > 0) {
      const members = await this.db("member")
        .select("id", "username", "nickname")
        .whereIn("id", Array.from(replyToMemberIds));
      members.forEach(m => {
        replyToMembers[m.id] = m.nickname || m.username;
      });
    }

    formattedRepliesList.forEach(reply => {
      const parentId = reply.parent_id;
      const parent = commentMap[parentId];
      
      if (parent) {
        if (reply.reply_to_member_id && replyToMembers[reply.reply_to_member_id]) {
          reply.reply_to_username = replyToMembers[reply.reply_to_member_id];
        }
        parent.replies.push(reply);
      }
    });

    if (memberId) {
      const allCommentIds = [
        ...formattedRootList.map(c => c.id),
        ...formattedRepliesList.map(c => c.id)
      ];
      
      if (allCommentIds.length > 0) {
        const likedMap = await this.checkLikeStatus(memberId, allCommentIds);
        
        formattedRootList.forEach(comment => {
          if (likedMap[comment.id]) comment.is_liked = true;
          comment.replies.forEach(reply => {
            if (likedMap[reply.id]) reply.is_liked = true;
          });
        });
      }
    }

    return {
      success: true,
      code: 200,
      msg: "查询成功",
      data: {
        list: formattedRootList,
        total: total,
        page: parseInt(page),
        pageSize: pageSize,
      },
    };
  }

  /**
   * @description 点赞评论
   * @param {string} memberId - 用户ID
   * @param {string} commentId - 评论ID
   * @returns {Object} - 点赞结果对象
   */
  async like(memberId, commentId) {
    const existing = await this.db("member_comment_like")
      .where({ comment_id: commentId, member_id: memberId })
      .first();

    if (existing) {
      await this.db("member_comment_like")
        .where({ comment_id: commentId, member_id: memberId })
        .delete();

      await this.db(this.tableName)
        .where({ id: commentId })
        .decrement("like_count", 1);

      const comment = await this.db(this.tableName)
        .select("like_count")
        .where({ id: commentId })
        .first();

      return { success: true, msg: "取消点赞", isLiked: false, likeCount: comment.like_count };
    }

    await this.db("member_comment_like").insert({
      comment_id: commentId,
      member_id: memberId,
      createdAt: new Date(),
    });

    await this.db(this.tableName)
      .where({ id: commentId })
      .increment("like_count", 1);

    const comment = await this.db(this.tableName)
      .select("like_count")
      .where({ id: commentId })
      .first();

    return { success: true, msg: "点赞成功", isLiked: true, likeCount: comment.like_count };
  }

  async checkLikeStatus(memberId, commentIds) {
    if (!memberId || !commentIds || commentIds.length === 0) {
      return {};
    }

    const likedComments = await this.db("member_comment_like")
      .select("comment_id")
      .where({ member_id: memberId })
      .whereIn("comment_id", commentIds);

    const likedMap = {};
    likedComments.forEach(item => {
      likedMap[item.comment_id] = true;
    });

    return likedMap;
  }
}

export default new CommentService();