import { helper } from "chanjs";
import auth  from "../../middleware/auth.js";
import { singleUpload, multiUpload, logo } from "../../common/upload.js";

export default async (app, router, config) => {
  let controller = await helper.loadController("oss");
  
  router.post("/local/logo", auth(), logo(), controller.Upload.uploadImg);
  router.post("/local/imgs", auth(), multiUpload(), controller.Upload.uploadImgs);
  router.post("/local/files", auth(), multiUpload(), controller.Upload.uploadFiles);
  router.delete("/local/delete", auth(), controller.Upload.deleteFile);
  router.get("/local/extract", auth(), controller.Upload.extractArchive);
  
  router.post("/local/copy", auth(), controller.Upload.copyFile);
  router.post("/local/move", auth(), controller.Upload.moveFile);
  router.post("/local/rename", auth(), controller.Upload.renameFile);
  router.get("/local/relativePath", auth(), controller.Upload.getRelativePath);
  router.post("/local/createFolder", auth(), controller.Upload.createFolder);
  router.post("/local/compress", auth(), controller.Upload.compressFiles);

  router.get("/qiniu/getUploadToken", auth(), controller.Upload.getQiniuUploadToken);
  router.post("/qiniu/upload", auth(), singleUpload(), controller.Upload.uploadToQiniu);

  app.use("/oss", router);
};
