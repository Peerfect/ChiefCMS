import { checkKeywords } from "chanjs/helper/checker.js";

/**
 * @description 验证评论内容长度
 * @param {string} content - 评论内容
 * @param {Object} config - 配置对象
 * @returns {Object} - 验证结果对象
 */
function validateContentLength(content, config) {
  if (content.length < config.minLength) {
    return { valid: false, msg: `评论内容至少${config.minLength}个字符` };
  }
  
  if (content.length > config.maxLength) {
    return { valid: false, msg: `评论内容不能超过${config.maxLength}个字符` };
  }
  
  return { valid: true };
}

/**
 * @description 验证评论内容是否包含敏感词
 * @param {string} content - 评论内容
 * @param {Object} config - 配置对象
 * @returns {Object} - 验证结果对象
 */
function validateSensitiveWords(content, config) {
  if (!config.enableSensitiveFilter || !config.sensitiveWords) {
    return { valid: true };
  }
  
  const words = config.sensitiveWords.split(',').map(w => w.trim()).filter(w => w);
  for (const word of words) {
    if (content.toLowerCase().includes(word.toLowerCase())) {
      return { valid: false, msg: '评论内容包含敏感词' };
    }
  }
  
  return { valid: true };
}

/**
 * @description 验证评论内容是否包含链接
 * @param {string} content - 评论内容
 * @param {Object} config - 配置对象
 * @returns {Object} - 验证结果对象
 */
function validateLinks(content, config) {
  if (!config.enableLinkFilter) {
    return { valid: true };
  }
  
  const linkPattern = /https?:\/\/[^\s]+/gi;
  const links = content.match(linkPattern) || [];
  if (links.length > config.maxLinks) {
    return { valid: false, msg: `单条评论最多包含${config.maxLinks}个链接` };
  }
  
  return { valid: true };
}

/**
 * @description 验证评论内容是否包含非法内容
 * @param {string} content - 评论内容
 * @returns {Object} - 验证结果对象
 */
function validateMaliciousContent(content) {
  const result = checkKeywords(content);
  if (result) {
    return { valid: false, msg: '评论内容包含非法内容' };
  }
  
  return { valid: true };
}

/**
 * @description 验证评论内容是否符合安全要求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 * @param {Object} - 验证结果对象
 */
export default () => {
  return async (req, res, next) => {
    try {
      const { content } = req.body;
      //内容是否为空
      if (!content || typeof content !== 'string') {
        return res.json({ success: false, msg: '评论内容不能为空' });
      }
        
      //获取评论配置
      const configs = await Chan.db('sys_config')
        .where({ type_code: 'comment_config', status: '1' })
        .select('config_key', 'config_value');
      
      const configMap = {};
      configs.forEach(c => {
        configMap[c.config_key] = c.config_value;
      });
      
      const config = {
        minLength: parseInt(configMap.minLength) || 5,
        maxLength: parseInt(configMap.maxLength) || 500,
        maxLinks: parseInt(configMap.maxLinks) || 2,
        spamInterval: parseInt(configMap.spamInterval) || 60,
        spamLimit: parseInt(configMap.spamLimit) || 3,
        sensitiveWords: configMap.sensitiveWords || '',
        enableSensitiveFilter: configMap.enableSensitiveFilter === '1',
        enableLinkFilter: configMap.enableLinkFilter === '1'
      };
      
      //验证评论内容长度
      const lengthValidation = validateContentLength(content, config);
      if (!lengthValidation.valid) {
        return res.json({ success: false, msg: lengthValidation.msg });
      }
      
      //验证评论内容是否包含敏感词
      const sensitiveValidation = validateSensitiveWords(content, config);
      if (!sensitiveValidation.valid) {
        return res.json({ success: false, msg: sensitiveValidation.msg });
      }
      
      //验证评论内容是否包含链接
      const linkValidation = validateLinks(content, config);
      if (!linkValidation.valid) {
        return res.json({ success: false, msg: linkValidation.msg });
      }
      
      //验证评论内容是否包含非法内容
      const maliciousValidation = validateMaliciousContent(content);
      if (!maliciousValidation.valid) {
        return res.json({ success: false, msg: maliciousValidation.msg });
      }
      
      next();
    } catch (error) {
      console.error('[CommentSecurity] 验证失败:', error);
      next(error);
    }
  };
};