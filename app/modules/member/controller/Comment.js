import { Controller, helper, common } from "chanjs";
import Comment from "../service/Comment.js";

const { formatDateFields } = helper;

class CommentController extends Controller {

  /**
   * @description 获取会员评论列表
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async getComments(req, res, next) {
    try {
      const { uid } = req.user;
      const { page = 1, pageSize = 10 } = req.query;
      const result = await Comment.list(uid, page, pageSize);
      result.data.list = formatDateFields(result.data.list);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 添加会员评论
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async addComment(req, res, next) {
    try {
      const { uid } = req.user;
      const { articleId, content, parentId, replyToMemberId, replyToUsername } = req.body;
      
      if (!articleId || !content) {
        return res.json(this.fail({ msg: "参数不完整" }));
      }
      
      const result = await Comment.create(uid, articleId, content, parentId, replyToMemberId, replyToUsername);
      res.json(this.success({ data: result }));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 添加匿名评论（无需登录）
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async addCommentAnonymous(req, res, next) {
    try {
      const { articleId, content, parentId, replyToMemberId, replyToUsername, nickname, email } = req.body;
      
      if (!articleId || !content) {
        return res.json({ success: false, msg: "参数不完整" });
      }

      // 基本内容验证
      if (content.length < 1 || content.length > 500) {
        return res.json({ success: false, msg: "评论内容长度需在1-500字之间" });
      }
      
      const result = await Comment.createAnonymous(articleId, content, parentId, replyToMemberId, replyToUsername, nickname, email);
      if (result.success === false) {
        return res.json({ success: false, msg: result.msg });
      }
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 删除会员评论
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async deleteComment(req, res, next) {
    try {
      const { uid } = req.user;
      const { id } = req.query;
      
      if (!id) {
        return res.json(this.fail({ msg: "参数不完整" }));
      }
      
      const result = await Comment.delete(id, uid);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 点赞评论
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async likeComment(req, res, next) {
    try {
      const { uid } = req.user;
      const { commentId } = req.body;
      
      if (!commentId) {
        return res.json(this.fail({ msg: "参数不完整" }));
      }
      
      const result = await Comment.like(uid, commentId);
      res.json(this.success({ data: result }));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 获取文章评论列表
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async articleComments(req, res, next) {
    try {
      const { articleId, page = 1, pageSize = 10 } = req.query;
      const uid = req.user ? req.user.uid : null;
      
      if (!articleId) {
        return res.json(this.fail({ msg: "参数不完整" }));
      }
      
      const result = await Comment.articleComments(articleId, page, pageSize, uid);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 获取后台评论列表
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async commentList(req, res, next) {
    try {
      const { page = 1, pageSize = 10, status } = req.query;
      const result = await Comment.adminList(page, pageSize, status);
      result.data.list = formatDateFields(result.data.list);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 审核后台评论
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async commentAudit(req, res, next) {
    try {
      const { uid } = req.user;
      const { id, status, auditRemark } = req.body;
      
      if (!id || !status) {
        return res.json(this.fail({ msg: "参数不完整" }));
      }
      
      const result = await Comment.audit(id, status, uid, auditRemark);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 删除后台评论
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async commentDelete(req, res, next) {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.json(this.fail({ msg: "参数不完整" }));
      }
      
      const result = await Comment.adminDelete(id);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }
}

export default new CommentController();