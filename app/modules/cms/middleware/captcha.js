import { common } from "chanjs";

const { fail } = common;

export default function() {
  return (req, res, next) => {
    const { captcha, timestamp, ...saveData } = req.body;
    
    if (!req.cookies || !req.cookies._captcha) {
      res.json(fail({ msg: '验证码已过期，请刷新验证码' }));
      return;
    }
    
    const serverCaptcha = req.cookies._captcha;
    const userCaptcha = captcha;
    
    if (!userCaptcha || !serverCaptcha) {
      res.json(fail({ msg: '请输入验证码' }));
      return;
    }
    
    if (serverCaptcha.toLowerCase() !== userCaptcha.toLowerCase()) {
      res.json(fail({ msg: '验证码错误，请重新输入' }));
      return;
    }

    res.clearCookie('_captcha');
    req.body = saveData;
    next();
  };
}
