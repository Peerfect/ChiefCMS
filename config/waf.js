/**
 * WAF (Web Application Firewall) 配置
 * 在 packages/index.js 的 loadMiddleware 中使用
 */

export const waf = {
  enabled: true,

  rateLimit: {
    key: 'waf_rate_limit',
    max: 200,
    windowMs: '1h',
    secretKey: 'chancms',
    httpOnly: true,
    secure: ['prd', 'production'].includes(process.env.NODE_ENV),
    sameSite: 'Strict',
    ignorePaths: [
      '/health',
      '/favicon.ico',
      '/static',
      '/public',
    ],
  },
};

export default {
  waf,
};

