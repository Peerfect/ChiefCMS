import { helper, common } from "chanjs";
import { genCode } from "../../../helper/code.js";

const { fail } = common;
const { config } = Chan;
const { EMAIL } = config;

export default (req, res, next) => {
  if (!req.cookies._c) {
    res.json(this.fail({ msg: "验证码已过期！" }));
    return;
  }
  const { code } = req.body;
  if (genCode(req.cookies._c, EMAIL.CODE) !== code) {
    res.json(this.fail({ msg: "验证码错误！" }));
    return;
  }
  next();
};
