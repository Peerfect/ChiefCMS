import { Controller, helper, common } from "chanjs";
import Member from "../service/Member.js";
import bcrypt from "bcryptjs";
import { genCode } from "../../../helper/code.js";

const { setToken, getToken, LogError, getIp, formatDateFields } = helper;
const { success, fail, genRegEmailHtml, genResetPasswordEmail, sendMail } = common;
const { config } = Chan;
const { EMAIL, USER_SALT, JWT_SECRET, JWT_EXPIRES_IN } = config;

class MemberController extends Controller {

  /**
   * @description 发送邮件验证码
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async sendEmail(req, res, next) {
    const { email, code, type } = req.body;
    let emailcode = genCode(code, EMAIL.CODE);
    if (type === "register") {
      await sendMail(email, "注册验证码", genRegEmailHtml(emailcode));
    } else {
      await sendMail(email, "修改密码验证码", genResetPasswordEmail(emailcode));
    }

    res.json(this.success({ data: "邮件发送成功" }));
  }

  /**
   * @description 登录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async login(req, res, next) {
    try {
      const { username, password, fp } = req.body;
      const ip = getIp(req);
      
      let queryField = "username";
      if (username && username.includes("@")) {
        queryField = "email";
      }
      
      const result = await Member.findUserByField(username, queryField);
      if (result.success && result.data) {
        let user = result.data;
        if (!user.id) {
          res.json(this.fail({ msg: "不存在此用户" }));
          return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (user && match) {
          const { id, username, status, avatar, nickname } = user;
          
          if (status !== '1') {
            res.json(this.fail({ msg: "账号已被禁用，请联系管理员" }));
            return;
          }
          
          // 使用请求中的 fp，如果没有则使用默认值
          const realFP = fp || '';
          
          // 设置token
          const token = setToken(
            { uid: id, username: username, fp: realFP, ip: ip },
            JWT_SECRET,
            JWT_EXPIRES_IN
          );
          
          const maxAgeDay =  604800000; // 7 * 24 * 60 * 60 * 1000 = 7天 = 604800000

          // 设置 cookie，保持与 token 中的 fp 和 ip 一致
          res.cookie('ut', token, {
            maxAge: maxAgeDay, // 7天
          });
          res.cookie('_f', realFP, {
            maxAge: maxAgeDay, // 7天
          });
          res.cookie('_i', ip, {
            maxAge: maxAgeDay, // 7天   
          });
          res.cookie('_n', username, {
            maxAge: maxAgeDay, // 7天   
          });
          res.cookie('un', username, {
            maxAge: maxAgeDay, // 7天   
          });
          
          res.json(this.success({ data: { id, username, status, token, ip: ip, avatar, headimgurl: avatar }}));
        } else {
          res.json(this.fail({ msg: "密码错误！" }));
        }
      } else {
        res.json(this.fail({ msg: "用户不存在！" }));
      }
    } catch (err) {
      console.error("MemberController.login-->", err);
      next(err);
    }
  }

  /**
   * @description 注册
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async register(req, res, next) {
    try {
      const { username, password, email } = req.body;
      let _password = await bcrypt.hash(password, parseInt(USER_SALT));
      const data = await Member.create({ username, password: _password, email });
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 校验邮件验证码
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async checkEmail(req, res, next) {
    try {
      res.json(this.success({ data: "邮件发送成功" }));
      
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 获取会员详情
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async detail(req, res, next) {
    try {
      const { uid } = req.user;
      const result = await Member.detail(uid);
      if (result.success && result.data) {
        res.json(this.success({ data: result.data }));
      } else {
        res.json(this.fail({ msg: result.msg || "获取会员信息失败" }));
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 删除会员
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await Member.delete(id);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 重置密码
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async resetPass(req, res, next) {
    try {
      const { email, password } = req.body;
      //判断邮箱是否存在
      let user = await Member.find(email);
      if (user.success && user.data?.list?.length > 0) {
        let _password = await bcrypt.hash(password, parseInt(USER_SALT));
        let data = await Member.update({
          query: { email },
          data: { password: _password },
        });
        res.json(this.success(data));
      } else {
        res.json(this.fail({ msg: "账号不存在！" }));
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 更新会员信息
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async updateUser(req, res, next) {
    try {
      let { id, phone, remark, sex, wechat, username, nickname, email } = req.body;
      let query = { id };
      let data = { phone, remark, sex, wechat, username, nickname, email };
      const result = await Member.update({ query, data });
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 更新会员信息
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async adminUpdateUser(req, res, next) {
    try {
      let { id, phone, remark, sex, wechat, username, nickname, email, status } = req.body;
      let query = { id };
      let data = { phone, remark, sex, wechat, username, nickname, email };
      if (status !== undefined) {
        data.status = status ? '1' : '0';
      }
      const result = await Member.update({ query, data });
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 修改密码
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async updatePass(req, res, next) {
    try {
      let { uid } = req.user;
      let { password, newPassword } = req.body;
      const result = await Member.queryPass(uid);
      if (result.success && result.data) {
        let user = result.data;
        const match = await bcrypt.compare(password, user.password);
        if (user && match) {
          let _password = await bcrypt.hash(newPassword, parseInt(USER_SALT));
          let query = { id: uid };
          let data = { password: _password };
          const result = await Member.update({ query, data });
          res.json(this.success(result));
        } else {
          res.json(this.fail({ msg: "原密码错误！" }));
        }
      } else {
        res.json(this.fail({ msg: "用户名或密码错误！" }));
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 退出登录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async logout(req, res, next) {
    try {
      res.clearCookie('token');
      res.clearCookie('_f');
      res.clearCookie('_i');
      res.clearCookie('_n');
      const redirect = req.query.redirect || req.headers.referer || '/';
      res.redirect(redirect);
    } catch (err) {
      console.error("MemberController.logout-->", err);
      next(err);
    }
  }

  /**
   * @description 获取会员列表
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async list(req, res, next) {
    try {
      const { page, pageSize = 20 } = req.query;
      let result = await Member.list(page, pageSize);
      result.data.list = formatDateFields(result.data.list);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 搜索会员
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async search(req, res, next) {
    try {
      const { page, keyword, pageSize = 20 } = req.query;
      let result = await Member.search(keyword, page, pageSize);
      result.data.list = formatDateFields(result.data.list);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 获取会员详情
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */
  async adminDetail(req, res, next) {
    try {
      const { id } = req.query;
      const result = await Member.detail(id);
      if (result.success && result.data) {
        let data = result.data;
        data = formatDateFields(data, ['createdAt', 'updatedAt', 'loginDate']);
        res.json(this.success({ data }));
      } else {
        res.json(this.fail({ msg: result.msg || "会员不存在" }));
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * @description 更新会员状态
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 下一个中间件函数
   */ 
  async updateStatus(req, res, next) {
    try {
      const { id, status } = req.body;
      const { uid } = req.user;
      
      if (parseInt(id) === parseInt(uid)) {
        return res.json(this.fail({ msg: "不能修改自己的状态" }));
      }
      
      const data = await Member.updateStatus(id, status);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }
}

export default new MemberController();