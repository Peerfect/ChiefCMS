import { Controller, helper, common } from "chanjs";
const { config } = Chan;
const { setToken, getToken, getIp } = helper;
import bcrypt from "bcryptjs";
import SysUser from "../service/SysUser.js";
import SysMenu from "../service/SysMenu.js";

class SysUserController extends Controller {
  async login(req, res, next) {
    try {
      const { username, password, f } = req.body;
      const ip = getIp(req);
      const userResult = await SysUser.find(username);
      if (!userResult.success || !userResult.data) {
        return res.json(this.fail({ msg: "用户不存在", code: 4001 }));
      }
      const user = userResult.data;
      if (user.status !== '1') {
        return res.json(this.fail({ msg: "用户账号已停用，请联系管理员", code: 4002 }));
      }
      // 验证密码
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.json(this.fail({ msg: "密码错误！", code: 3001 }));
      }

      // 生成token，包含IP信息
      const token = setToken(
        { uid: user.id, username, f, i: ip },
        config.JWT_SECRET,
        config.JWT_EXPIRES_IN
      );

      // 获取用户菜单
      const menuResult = await SysMenu.allRouter(user.id);
      const menus = (menuResult.success && menuResult.data) ? menuResult.data.routers || [] : [];
      
      res.json({
        success: true,
        code: 200,
        msg: "登录成功",
        data: {
          status: user.status,
          username,
          token,
          ip: ip,
          menus
        }
      });
    } catch (err) {
      console.error("[SysUserController.login] 错误:", err.message);
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const query = req.query || {};
      const data = await SysUser.list(query);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      body.password = await bcrypt.hash(body.password, parseInt(config.PASSWORD_SALT));
      const result = await SysUser.create(body);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  async detail(req, res, next) {
    try {
      let { id } = req.query;
      if (!id) {
        const token = req.headers.token;
        if (!token) {
          return res.json(this.fail({ msg: "请先登录" }));
        }
        const user = await getToken(token, config.JWT_SECRET);
        id = user.uid;
      }
      const result = await SysUser.detail(id);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const result = await SysUser.delete(id);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const token = req.headers.token;
      if (!token) {
        return res.json(this.fail({ msg: "请先登录" }));
      }
      const currentUser = await getToken(token, config.JWT_SECRET);
      
      const { userId, username, status, role_id, password } = req.body;
      
      // 权限验证：只能修改自己的信息，超级管理员可以修改任何用户信息
      if (currentUser.uid != userId) {
        const userDetail = await SysUser.detail(currentUser.uid);
        if (!userDetail.success || userDetail.data?.role !== 'super') {
          return res.json(this.fail({ msg: "无权修改其他用户信息" }));
        }
      }
      
      const params = { userId, username, status, role_id };
      if (password) {
        params.password = await bcrypt.hash(password, parseInt(config.PASSWORD_SALT));
      }
      
      const result = await SysUser.update(params);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }
}

export default new SysUserController();
