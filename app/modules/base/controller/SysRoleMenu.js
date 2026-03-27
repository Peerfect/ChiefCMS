import { Controller, common } from "chanjs";
import SysRoleMenu from "../service/SysRoleMenu.js";

const { success, fail } = common;

class SysRoleMenuController extends Controller {
  async list(req, res, next) {
    try {
      const id = req.query.id;
      const data = await SysRoleMenu.list({ role_id: id });
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }
}

export default new SysRoleMenuController();
