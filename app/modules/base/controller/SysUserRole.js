import { Controller, helper, common } from "chanjs";
import SysUserRole from "../service/SysUserRole.js";

const { setToken, getToken } = helper;
const { success, fail } = common;
const { config } = Chan;

class SysUserRoleController extends Controller {
  // 查
  async detail(req, res, next) {
    try {
      const { user_id } = req.query;
      const data = await SysUserRole.detail(user_id);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }
}

export default new SysUserRoleController();
