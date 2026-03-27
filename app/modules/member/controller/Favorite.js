import { Controller, helper } from "chanjs";
import Favorite from "../service/Favorite.js";

const { formatDateFields } = helper;

class FavoriteController extends Controller {

  /**
   * @description 获取会员收藏列表
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async getFavorites(req, res, next) {
    try {
      const { uid } = req.user;
      const { page = 1, pageSize = 10 } = req.query;
      const result = await Favorite.list(uid, page, pageSize);
      result.data.list = formatDateFields(result.data.list);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 添加会员收藏
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async addFavorite(req, res, next) {
    try {
      const { uid } = req.user;
      const { articleId, articleTitle, articleCover, articleSummary, articleUrl } = req.body;
      
      if (!articleId) {
        return res.json(this.fail({ msg: "参数不完整" }));
      }
      
      const result = await Favorite.add(uid, articleId, articleTitle, articleCover, articleSummary, articleUrl);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 删除会员收藏
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async deleteFavorite(req, res, next) {
    try {
      const { uid } = req.user;
      const { id } = req.query;
      
      if (!id) {
        return res.json(this.fail({ msg: "参数不完整" }));
      }
      
      const result = await Favorite.delete(id, uid);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 获取后台收藏列表
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async favoriteList(req, res, next) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const result = await Favorite.adminList(page, pageSize);
      result.data.list = formatDateFields(result.data.list);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 删除后台收藏
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async favoriteDelete(req, res, next) {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.json(this.fail({ msg: "参数不完整" }));
      }
      
      const result = await Favorite.adminDelete(id);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }
}

export default new FavoriteController();