// jwt 配置
export const token = {
  KEY: process.env.TOKEN_KEY || "ChanCMS",
  TIME: process.env.TOKEN_TIME || "1d",
  REFRESH: process.env.TOKEN_REFRESH || false, //是否开启刷新token
};

// bcrypt 加盐
export const secretcms = {
  key: process.env.SECRET_CMS_KEY || 10,
};

// cookie签名密钥 - 不使用签名，因为JWT已经提供了安全性
export const cookieKey = false;

export default {
  token,
  secretcms,
  cookieKey,
};
