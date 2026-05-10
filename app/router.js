import { helper } from "chanjs";
const { getIp } = helper;

const routers = (app, router, config) => {
  const { template = "default" } = config;

  

  //404处理
  router.use((req, res, next) => {
    console.error(
      `[异常访问-404]  url-->:${req.url} ip-->:${getIp(req)} UA-->:${req.get(
        "User-Agent",
      )}`,
    );
    if (req.is("html") || req.is("htm")) {
      res.render(`${template}/404.html`, { url: req.url });
    } else {
      res.json({ code: 404, msg: "页面不存在" });
    }
  });

  //500处理错误
  router.use((err, req, res) => {
    let data = {
      message: err.message,
      url: req.url,
      method: req.method,
    };
    let other = {
      stack: err.stack,
      ip: getIp(req),
      userAgent: req.get("User-Agent") || "",
      referer: req.get("Referer") || "",
    };
    console.error(`[接口异常-500]-->`, data, other);
    if (req.is("html") || req.is("html") == null) {
      res.render(`${template}/500.html`, { data });
    } else {
      res.json({ code: 500, data }); // 已移除冗余msg字段
    }
  });
};

export default routers;
