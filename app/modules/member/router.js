import { helper } from "chanjs";
import verifycode from "./middleware/verifycode.js";
import userauth from "./middleware/userauth.js";
import auth from "../../middleware/auth.js";
import { singleUpload, multiUpload, logo } from "../../common/upload.js";
import commentSecurity from "./middleware/commentSecurity.js";

export default async (app, router, config) => {
  
  let controller = await helper.loadController("member");

  //前端会员接口 
  router.post("/sendEmail", controller.Member.sendEmail);
  router.post("/register", verifycode, controller.Member.register);
  router.post("/login", controller.Member.login);
  router.get("/logout", controller.Member.logout);
  router.get("/detail", userauth(), controller.Member.detail);
  router.post("/checkEmail", verifycode, controller.Member.checkEmail);
  router.post("/resetPass", verifycode, controller.Member.resetPass);
  router.post("/updatePass", userauth(), controller.Member.updatePass);
  router.post("/updateUser", userauth(), controller.Member.updateUser);

  //评论收藏接口
  router.get("/comments", userauth(), controller.Comment.getComments);
  router.post("/comment", userauth(), commentSecurity(), controller.Comment.addComment);
  router.post("/commentAnonymous", controller.Comment.addCommentAnonymous);
  router.get("/deleteComment", userauth(), controller.Comment.deleteComment);
  router.post("/likeComment", userauth(), controller.Comment.likeComment);
  router.get("/articleComments", controller.Comment.articleComments);
  router.get("/favorites", userauth(), controller.Favorite.getFavorites);
  router.post("/favorite", userauth(), controller.Favorite.addFavorite);
  router.get("/deleteFavorite", userauth(), controller.Favorite.deleteFavorite);

  //后台会员管理接口
  router.get("/list", auth(), controller.Member.list);
  router.get("/search", auth(), controller.Member.search);
  router.get("/adminDetail", auth(), controller.Member.adminDetail);
  router.post("/updateStatus", auth(), controller.Member.updateStatus);
  router.post("/adminUpdateUser", auth(), controller.Member.adminUpdateUser);

  //后台评论收藏管理接口
  router.get("/comment/list", auth(), controller.Comment.commentList);
  router.post("/comment/audit", auth(), controller.Comment.commentAudit);
  router.get("/comment/delete", auth(), controller.Comment.commentDelete);
  router.get("/favorite/list", auth(), controller.Favorite.favoriteList);
  router.get("/favorite/delete", auth(), controller.Favorite.favoriteDelete);

  app.use("/member/v1", router);
};
