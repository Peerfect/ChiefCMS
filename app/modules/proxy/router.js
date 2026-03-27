import { helper } from "chanjs";
import { singleUpload, multiUpload, logo } from "../../common/upload.js";


export default async (app, router, config) => {
  let controller = await helper.loadController("proxy");
  
  //用户
  router.get("/ip", controller.Client.ip);

  //配置前缀
  app.use("/proxy/v1", router);
};
