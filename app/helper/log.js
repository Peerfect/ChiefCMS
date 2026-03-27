
import { helper } from "chanjs";

const { getIp } = helper;

export const LogError = (req, data) => {
  console.error("接口异常-->:", {
    url: req.url,
    ip: getIp(req),
    data
  });
};
