-- 添加匿名评论字段
ALTER TABLE `member_comment` ADD COLUMN `anonymous_nickname` varchar(50) DEFAULT NULL COMMENT '匿名评论昵称' AFTER `like_count`;
ALTER TABLE `member_comment` ADD COLUMN `anonymous_email` varchar(100) DEFAULT NULL COMMENT '匿名评论邮箱' AFTER `anonymous_nickname`;

-- 修改 member_id 允许为 0（匿名用户）
ALTER TABLE `member_comment` MODIFY COLUMN `member_id` int(11) NOT NULL DEFAULT 0 COMMENT '会员ID，0表示匿名';
