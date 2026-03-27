import { z } from "zod";
import loginLog from "../service/loginLog.js";
import { Controller, helper, common } from "chanjs";

const { getToken, formatDateFields } = helper;
const { success } = common;
const { config } = Chan;

const schemas = {
  list: z.object({
    page: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
  }),
};

class LoginLogController extends Controller {
  constructor() {
    super();
  }
  // 增
  async create(req, res, next) {
    try {
      const token = req.headers.token;
      const user = await getToken(token, config.JWT_SECRET);
      let body = {
        uid: user.uid,
        ...req.body,
      };
      const data = await loginLog.create(body);
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 删除
  async delete(req, res, next) {
    try {
      const { ids } = req.query;
      let data;
      if (ids) {
        data = await loginLog.deleteByIds(ids);
      } else {
        data = await loginLog.delete();
      }
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 列表
  async list(req, res, next) {
    try {
      const { page, pageSize } = schemas.list.parse(req.query);
      let result = await loginLog.list(page, pageSize);
      result.data.list = formatDateFields(result.data.list);
      res.json(this.success({data:result.data}));

    } catch (err) {
      next(err);
    }
  }
}

export default new LoginLogController();
