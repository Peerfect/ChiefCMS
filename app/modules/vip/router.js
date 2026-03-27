import { helper } from "chanjs";
import auth  from "../../middleware/auth.js";
import { singleUpload, multiUpload, logo } from "../../common/upload.js";

export default async (app, router, config) => {
  let controller = await helper.loadController("vip");
  
  router.get("/file/tree", auth(), controller.CodeFile.tree);
  router.get("/file/content", auth(), controller.CodeFile.content);
  router.post("/file/save", auth(), controller.CodeFile.save);
  router.get("/file/oss", auth(), controller.CodeFile.oss);

  app.use("/vip/v1", router);
};
