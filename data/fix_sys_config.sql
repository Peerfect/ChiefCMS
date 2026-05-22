-- 修复 sys_config 表结构，使其与代码匹配
ALTER TABLE `sys_config` CHANGE COLUMN `key` `config_key` varchar(100) NOT NULL COMMENT '配置键';
ALTER TABLE `sys_config` CHANGE COLUMN `value` `config_value` text NOT NULL COMMENT '配置值';
ALTER TABLE `sys_config` ADD COLUMN `status` char(1) NOT NULL DEFAULT '1' COMMENT '状态' AFTER `config_value`;
ALTER TABLE `sys_config` ADD COLUMN `create_time` datetime DEFAULT CURRENT_TIMESTAMP AFTER `status`;
ALTER TABLE `sys_config` ADD COLUMN `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `create_time`;
ALTER TABLE `sys_config` ADD COLUMN `remark` varchar(255) DEFAULT NULL COMMENT '备注' AFTER `update_time`;

-- 插入上传配置
INSERT INTO `sys_config` (`type_code`, `config_key`, `config_value`, `status`, `remark`) VALUES
('upload_config', 'logoSize', '512000', '1', 'Logo上传大小限制（500KB）'),
('upload_config', 'imgSize', '10485760', '1', '图片上传大小限制（10MB）'),
('upload_config', 'fileSize', '52428800', '1', '通用文件上传大小限制（50MB）'),
('upload_config', 'videoSize', '209715200', '1', '视频上传大小限制（200MB）'),
('upload_config', 'pdfSize', '52428800', '1', 'PDF上传大小限制（50MB）'),
('upload_config', 'musicSize', '20971520', '1', '音乐上传大小限制（20MB）'),
('upload_config', 'cssSize', '5242880', '1', 'CSS上传大小限制（5MB）'),
('upload_config', 'jsSize', '5242880', '1', 'JS上传大小限制（5MB）'),
('upload_config', 'fontSize', '10485760', '1', '字体上传大小限制（10MB）'),
('upload_config', 'archiveSize', '104857600', '1', '压缩包上传大小限制（100MB）'),
('upload_config', 'htmlSize', '10485760', '1', 'HTML上传大小限制（10MB）'),
('upload_config', 'txtSize', '5242880', '1', 'TXT上传大小限制（5MB）')
ON DUPLICATE KEY UPDATE 
  `config_value` = VALUES(`config_value`),
  `remark` = VALUES(`remark`);
