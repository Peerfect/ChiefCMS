import app from "./app.js";
import cache from "./cache.js";
import cookie from "./cookie.js";
import salt from "./salt.js";
import db from "./database.js";
import jwt from "./jwt.js";
import logger from "./log.js";
import modules from "./modules.js";
import perms from "./perm.js";
import plugins from "./plugins.js";
import statics from "./static.js";
import upload from "./upload.js";
import views from "./view.js";
import cors from "./cors.js";
import waf from "./waf.js";
import email from "./email.js";
import wechat from "./wechat.js";

export default {
  ...app,
  ...cache,
  ...cookie,
  ...salt,
  ...waf,
  ...email,
  ...jwt,
  ...db,
  ...logger,
  ...modules,
  ...perms,
  ...plugins,
  ...statics,
  ...upload,
  ...views,
  ...cors,
  ...wechat,
};
