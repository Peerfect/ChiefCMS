/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50723 (5.7.23)
 Source Host           : localhost:3306
 Source Schema         : init

 Target Server Type    : MySQL
 Target Server Version : 50723 (5.7.23)
 File Encoding         : 65001

 Date: 24/03/2026 19:00:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cms_article
-- ----------------------------
DROP TABLE IF EXISTS `cms_article`;
CREATE TABLE `cms_article` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '栏目id',
  `subCid` varchar(255) DEFAULT NULL COMMENT '其它栏目id',
  `title` varchar(255) NOT NULL COMMENT '标题',
  `shortTitle` varchar(255) DEFAULT NULL COMMENT '短标题',
  `tagId` varchar(255) DEFAULT NULL COMMENT '标签id',
  `attr` varchar(255) DEFAULT NULL COMMENT '1头条 2推荐 3轮播 4热门',
  `articleView` varchar(100) DEFAULT NULL COMMENT '详情页模板',
  `source` varchar(255) DEFAULT NULL COMMENT '来源',
  `author` varchar(255) DEFAULT NULL COMMENT '作者',
  `description` varchar(255) DEFAULT NULL COMMENT '文章简述',
  `img` varchar(255) DEFAULT NULL COMMENT '缩略图',
  `content` longtext NOT NULL COMMENT '文章内容',
  `status` tinyint(2) DEFAULT '0' COMMENT '0 发布 1 不发布',
  `pv` int(10) DEFAULT '0' COMMENT '浏览量',
  `link` varchar(255) DEFAULT NULL COMMENT '外链',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `cid` (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='文章表';

-- ----------------------------
-- Records of cms_article
-- ----------------------------
BEGIN;
INSERT INTO `cms_article` (`id`, `cid`, `subCid`, `title`, `shortTitle`, `tagId`, `attr`, `articleView`, `source`, `author`, `description`, `img`, `content`, `status`, `pv`, `link`, `createdAt`, `updatedAt`) VALUES (1, 2, '', 'ChanCMS内容管理系统', '', '2', '', '', '', '', 'ChanCMS是一款基于Node、Express、MySQL、Vue3研发的高质量实用型CMS系统。轻量、灵活、稳定、高性能、易扩展，让开发更简单。', '', '<p>ChanCMS是一款基于Node、Express、MySQL、Vue3研发的高质量实用型CMS系统。轻量、灵活、稳定、高性能、易扩展，让开发更简单。</p>\n<ul>\n<li>自研。基于自研chanjs轻量级mvc框架实现，轻量、灵活、稳定、高性能、可持续。</li>\n<li>SEO。专注于<code>seo</code>,伪静态<code>html</code>和拼音导航，灵活设置关键词和描述。</li>\n<li>安全。基于<code>knex</code>,高防<code>sql</code>注入，接口权限校验，为安全提供保障。</li>\n<li>灵活。碎片功能，支持零碎文案配置，方便各类灵活文案配置。</li>\n<li>高扩展。支持扩展模型，字段配置，可动态生成表，超强扩展。</li>\n<li>模块化。一切模块相互独立，互不干扰。</li>\n<li>插件化。灵活开发，支持完整功能模块。</li>\n<li>无头cms，为多端提供接口支持。</li>\n</ul>', 0, 32, '', '2024-09-13 22:49:28', '2026-03-24 09:40:39');
INSERT INTO `cms_article` (`id`, `cid`, `subCid`, `title`, `shortTitle`, `tagId`, `attr`, `articleView`, `source`, `author`, `description`, `img`, `content`, `status`, `pv`, `link`, `createdAt`, `updatedAt`) VALUES (2, 3, '', 'ChanCMS山水图：风景图', '', '2', '', '', '', '', '山峰树林湖泊', '/public/cover/04.jpg', '<p><img src=\"https://q5.itc.cn/q_70/images03/20240706/62869b54ec3c4ea5a842b97ac9722630.jpeg\" alt=\"\" width=\"2062\" height=\"1200\"></p>', 0, 54, '', '2024-09-13 22:55:57', '2025-11-22 19:11:45');
INSERT INTO `cms_article` (`id`, `cid`, `subCid`, `title`, `shortTitle`, `tagId`, `attr`, `articleView`, `source`, `author`, `description`, `img`, `content`, `status`, `pv`, `link`, `createdAt`, `updatedAt`) VALUES (3, 4, '', 'ChanCMS后台基本操作', '', '2', '', '', '', '', 'ChanCMS后台基本操作', '', '<p><iframe src=\"//player.bilibili.com/player.html?isOutside=true&aid=877077167&bvid=BV17N4y1Y7WC&cid=1362009352&p=1\" height=\"520\" frameborder=\"no\" scrolling=\"no\" allowfullscreen=\"allowfullscreen\"></iframe></p>', 0, 37, '', '2024-09-13 22:59:58', '2026-03-24 09:40:41');
INSERT INTO `cms_article` (`id`, `cid`, `subCid`, `title`, `shortTitle`, `tagId`, `attr`, `articleView`, `source`, `author`, `description`, `img`, `content`, `status`, `pv`, `link`, `createdAt`, `updatedAt`) VALUES (4, 7, '', 'ChanCMS简介', '', '2', '', '', '', '', 'ChanCMS简介', '', '<p><strong>ChanCMS内容管理系统</strong></p>\n<p>ChanCMS是一款基于Node、Express、MySQL、Vue3研发的高质量实用型CMS系统。轻量、灵活、稳定、高性能、易扩展，让开发更简单。</p>\n<p><strong>系统特色</strong></p>\n<p>自研。基于自研chanjs轻量级mvc框架实现，轻量、灵活、稳定、高性能、可持续。</p>\n<p>SEO。专注于seo,伪静态html和拼音导航，灵活设置关键词和描述。</p>\n<p>安全。基于knex,高防sql注入，接口权限校验，为安全提供保障。</p>\n<p>灵活。碎片功能，支持零碎文案配置，方便各类灵活文案配置。</p>\n<p>高扩展。支持扩展模型，字段配置，可动态生成表，超强扩展。</p>\n<p>模块化。一切模块相互独立，互不干扰。</p>\n<p>插件化。灵活开发，支持完整功能模块。</p>\n<p>无头cms，为多端提供接口支持。</p>\n<p><strong>软件架构</strong></p>\n<p>后台管理FE</p>\n<pre class=\"language-markup\"><code>vue3\nvue-router\npina\nelement-plus\nvite4\ntinymce</code></pre>\n<p>服务端技术栈</p>\n<pre class=\"language-markup\"><code>nodejs v20.16.0+\nexpress 4.18+\nmysql v5.7.26\nknex (sql操作)\nart-tempate v4.13.2+\npm2 v5.2.2\njwt\npm2 (prd)\nnodemon (dev)</code></pre>', 0, 102, '', '2024-09-13 23:06:30', '2026-03-24 09:40:45');
INSERT INTO `cms_article` (`id`, `cid`, `subCid`, `title`, `shortTitle`, `tagId`, `attr`, `articleView`, `source`, `author`, `description`, `img`, `content`, `status`, `pv`, `link`, `createdAt`, `updatedAt`) VALUES (5, 3, '', 'ChanCMS山水图：桂林山水', '', '2', '', '', '', '', '', '/public/cover/06.jpg', '<p><img src=\"https://img-qn.51miz.com/preview/element/00/01/30/75/E-1307587-924E2CBE.png!/quality/90/unsharp/true/compress/true/format/png/fwfh/900x640\" alt=\"\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://p3-pc-sign.douyinpic.com/tos-cn-i-0813c001/ogKHZvfQQ30BGWXEzfeP2BQ70OA5AA7AAdyJgF~tplv-dy-aweme-images-v2:3000:3000:q75.webp?biz_tag=aweme_images&from=327834062&s=PackSourceEnum_AWEME_DETAIL&sc=image&se=false&x-expires=1729130400&x-signature=vl4RUOePzX7s4npn4oARkHH6EAc%3D\" alt=\"\" width=\"896\" height=\"1536\"></p>', 0, 27, '', '2024-09-17 10:53:54', '2025-11-22 19:46:07');
INSERT INTO `cms_article` (`id`, `cid`, `subCid`, `title`, `shortTitle`, `tagId`, `attr`, `articleView`, `source`, `author`, `description`, `img`, `content`, `status`, `pv`, `link`, `createdAt`, `updatedAt`) VALUES (6, 3, '', 'ChanCMSAIGC图片美女', '', '2', '', '', '', '', '', '/public/cover/10.jpg', '<p><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://p9-heycan-hgt-sign.byteimg.com/tos-cn-i-3jr8j4ixpe/31f5581b6dee463bb23c6f4a31d1b204~tplv-3jr8j4ixpe-aigc_resize:0:0.png?lk3s=43402efa&x-expires=1728864000&x-signature=AP23D4sBKcal3LurrbHp9WWra8M%3D&format=.png\" alt=\"\"></p>', 0, 28, '', '2024-09-27 10:06:09', '2025-11-22 19:17:34');
INSERT INTO `cms_article` (`id`, `cid`, `subCid`, `title`, `shortTitle`, `tagId`, `attr`, `articleView`, `source`, `author`, `description`, `img`, `content`, `status`, `pv`, `link`, `createdAt`, `updatedAt`) VALUES (7, 3, '', 'ChanCMS图片美女', '', '2', '', '', '', '', '', '/public/cover/06.jpg', '<p style=\"text-align: center;\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://p3-heycan-hgt-sign.byteimg.com/tos-cn-i-3jr8j4ixpe/b9255497ccf94fcf9a1c873eda23b78f~tplv-3jr8j4ixpe-aigc_resize:0:0.png?lk3s=43402efa&x-expires=1728864000&x-signature=xU2jY9QGyZY5ZeG56f%2BZgRyJ4Yk%3D&format=.png\" alt=\"\"></p>', 0, 32, '', '2024-09-27 10:07:52', '2025-11-30 16:36:20');
INSERT INTO `cms_article` (`id`, `cid`, `subCid`, `title`, `shortTitle`, `tagId`, `attr`, `articleView`, `source`, `author`, `description`, `img`, `content`, `status`, `pv`, `link`, `createdAt`, `updatedAt`) VALUES (8, 3, '', 'ChanCMS图片美女', '', '2', '', '', '', '', '', '/public/cover/07.jpg', '<p><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://p3-heycan-hgt-sign.byteimg.com/tos-cn-i-3jr8j4ixpe/9266d858c987459a96ff3a1847d8c9fb~tplv-3jr8j4ixpe-aigc_resize:0:0.png?lk3s=43402efa&x-expires=1728864000&x-signature=%2F%2BWXysOaMFc6Gm%2Fkiv%2FyT2d%2FoAQ%3D&format=.png\" alt=\"\"></p>', 0, 49, '', '2024-09-27 10:37:12', '2026-03-24 09:40:37');
INSERT INTO `cms_article` (`id`, `cid`, `subCid`, `title`, `shortTitle`, `tagId`, `attr`, `articleView`, `source`, `author`, `description`, `img`, `content`, `status`, `pv`, `link`, `createdAt`, `updatedAt`) VALUES (9, 6, '', 'Node.js技术专题', '', '1', '', '', '', '', '深入探索Node.js核心技术、异步编程、框架应用等内容', '/public/cover/08.jpg', '<h2>Node.js技术专题介绍</h2><p>Node.js是一个基于Chrome V8引擎的JavaScript运行时环境，它使得JavaScript可以脱离浏览器在服务器端运行。</p><h3>核心特性</h3><ul><li>非阻塞I/O模型</li><li>事件驱动架构</li><li>单线程但高效</li><li>跨平台支持</li></ul><h3>应用场景</h3><p>实时应用、API服务、命令行工具、微服务等</p>', 0, 19, '', '2024-10-01 10:00:00', '2026-03-24 09:38:46');
INSERT INTO `cms_article` (`id`, `cid`, `subCid`, `title`, `shortTitle`, `tagId`, `attr`, `articleView`, `source`, `author`, `description`, `img`, `content`, `status`, `pv`, `link`, `createdAt`, `updatedAt`) VALUES (10, 6, '', 'Vue3框架专题', '', '1', '', '', '', '', '全面解析Vue3的Composition API、响应式原理、性能优化等', '/public/cover/09.jpg', '<h2>Vue3框架专题</h2><p>Vue3是Vue.js的最新版本，带来了许多令人兴奋的新特性和改进。</p><h3>主要特性</h3><ul><li>Composition API</li><li>更好的TypeScript支持</li><li>性能提升</li><li>更小的包体积</li></ul><h3>核心概念</h3><p>响应式系统、组件化、虚拟DOM、模板语法等</p>', 0, 22, '', '2024-10-02 14:30:00', '2025-11-30 16:30:00');
INSERT INTO `cms_article` (`id`, `cid`, `subCid`, `title`, `shortTitle`, `tagId`, `attr`, `articleView`, `source`, `author`, `description`, `img`, `content`, `status`, `pv`, `link`, `createdAt`, `updatedAt`) VALUES (11, 6, '', '数据库优化专题1', '', '1', '', '', '', '', 'MySQL性能优化、索引设计、SQL调优等实战技巧', '/public/cover/10.jpg', '<h2>数据库优化专题</h2><p>数据库性能优化是后端开发中的重要环节，直接影响系统性能。</p><h3>优化策略</h3><ul><li>索引优化</li><li>查询优化</li><li>表结构设计</li><li>缓存策略</li></ul><h3>实战经验</h3><p>从慢查询分析到索引优化，全面提升数据库性能</p>', 0, 66, '', '2024-10-03 09:15:00', '2026-03-24 09:40:43');
COMMIT;

-- ----------------------------
-- Table structure for cms_articletag
-- ----------------------------
DROP TABLE IF EXISTS `cms_articletag`;
CREATE TABLE `cms_articletag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) DEFAULT NULL COMMENT '文章id',
  `tid` int(11) DEFAULT NULL COMMENT '标签id',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `id` (`id`) USING BTREE,
  KEY `aid` (`aid`) USING BTREE,
  KEY `tid` (`tid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='文章-标签表';

-- ----------------------------
-- Records of cms_articletag
-- ----------------------------
BEGIN;
INSERT INTO `cms_articletag` (`id`, `aid`, `tid`) VALUES (1, 15, 2);
INSERT INTO `cms_articletag` (`id`, `aid`, `tid`) VALUES (2, 16, 2);
INSERT INTO `cms_articletag` (`id`, `aid`, `tid`) VALUES (3, 16, 1);
COMMIT;

-- ----------------------------
-- Table structure for cms_category
-- ----------------------------
DROP TABLE IF EXISTS `cms_category`;
CREATE TABLE `cms_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '栏目id',
  `pid` int(11) NOT NULL DEFAULT '0' COMMENT '父级栏目',
  `seoTitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'seo标题',
  `seoKeywords` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'seo关键字',
  `seoDescription` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'seo描述',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '栏目名称',
  `pinyin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '栏目标识',
  `path` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '栏目路径',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '栏目描述',
  `type` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '0 栏目 1 页面',
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '网址',
  `orderBy` tinyint(2) DEFAULT '0' COMMENT '排序',
  `target` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '打开方式 0 当前页面打开 1 新页面打开',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '0 显示 1隐藏',
  `mid` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '模型id',
  `listView` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'list.html' COMMENT '列表页模板',
  `articleView` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'article.html' COMMENT '详情页模板',
  `dataConfig` json DEFAULT NULL COMMENT '栏目数据配置',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='网站栏目';

-- ----------------------------
-- Records of cms_category
-- ----------------------------
BEGIN;
INSERT INTO `cms_category` (`id`, `pid`, `seoTitle`, `seoKeywords`, `seoDescription`, `name`, `pinyin`, `path`, `description`, `type`, `url`, `orderBy`, `target`, `status`, `mid`, `listView`, `articleView`, `createdAt`, `updatedAt`) VALUES (1, 0, '', '', '', '首页', 'home', '/home', '', '1', '', 1, '0', '0', '0', 'index.html', 'index.html', '2024-09-13 22:38:12', '2025-11-29 19:52:38');
INSERT INTO `cms_category` (`id`, `pid`, `seoTitle`, `seoKeywords`, `seoDescription`, `name`, `pinyin`, `path`, `description`, `type`, `url`, `orderBy`, `target`, `status`, `mid`, `listView`, `articleView`, `createdAt`, `updatedAt`) VALUES (2, 0, '', '', '', '文章', 'art3', '/art3', '', '0', '', 2, '0', '0', '0', 'list.html', 'article.html', '2024-09-13 22:38:12', '2025-11-25 11:25:10');
INSERT INTO `cms_category` (`id`, `pid`, `seoTitle`, `seoKeywords`, `seoDescription`, `name`, `pinyin`, `path`, `description`, `type`, `url`, `orderBy`, `target`, `status`, `mid`, `listView`, `articleView`, `createdAt`, `updatedAt`) VALUES (3, 0, '', '', '', '图片', 'pics', '/pics', '', '0', '', 3, '0', '0', '0', 'list-img.html', 'article-img.html', '2024-09-13 22:39:02', '2025-11-25 11:25:21');
INSERT INTO `cms_category` (`id`, `pid`, `seoTitle`, `seoKeywords`, `seoDescription`, `name`, `pinyin`, `path`, `description`, `type`, `url`, `orderBy`, `target`, `status`, `mid`, `listView`, `articleView`, `createdAt`, `updatedAt`) VALUES (4, 0, '', '', '', '视频', 'video', '/video', '', '0', '', 4, '0', '0', '0', 'list.html', 'article.html', '2024-09-13 22:39:22', '2025-11-25 11:25:35');
INSERT INTO `cms_category` (`id`, `pid`, `seoTitle`, `seoKeywords`, `seoDescription`, `name`, `pinyin`, `path`, `description`, `type`, `url`, `orderBy`, `target`, `status`, `mid`, `listView`, `articleView`, `createdAt`, `updatedAt`) VALUES (5, 0, '', '', '', '下载', 'down', '/down', '', '0', '', 5, '0', '0', '1', 'list.html', 'article-down.html', '2024-09-13 22:39:44', '2025-11-25 11:25:45');
INSERT INTO `cms_category` (`id`, `pid`, `seoTitle`, `seoKeywords`, `seoDescription`, `name`, `pinyin`, `path`, `description`, `type`, `url`, `orderBy`, `target`, `status`, `mid`, `listView`, `articleView`, `createdAt`, `updatedAt`) VALUES (6, 0, '', '', '', '专题', 'topic', '/topic', '', '1', '', 6, '0', '0', '0', 'list.html', 'special.html', '2024-09-13 22:42:10', '2025-11-25 11:25:51');
INSERT INTO `cms_category` (`id`, `pid`, `seoTitle`, `seoKeywords`, `seoDescription`, `name`, `pinyin`, `path`, `description`, `type`, `url`, `orderBy`, `target`, `status`, `mid`, `listView`, `articleView`, `createdAt`, `updatedAt`) VALUES (7, 0, '', '', '', '关于', 'about', '/about', '', '1', '', 7, '0', '0', '0', 'list.html', 'page.html', '2024-09-13 22:42:55', '2025-11-25 11:25:57');
INSERT INTO `cms_category` (`id`, `pid`, `seoTitle`, `seoKeywords`, `seoDescription`, `name`, `pinyin`, `path`, `description`, `type`, `url`, `orderBy`, `target`, `status`, `mid`, `listView`, `articleView`, `createdAt`, `updatedAt`) VALUES (8, 2, '', '', '', '文档', 'doc', '/art2/doc', '', '0', '', 0, '0', '0', '0', 'list.html', 'article.html', '2024-12-05 22:35:58', '2025-01-07 21:41:13');
INSERT INTO `cms_category` (`id`, `pid`, `seoTitle`, `seoKeywords`, `seoDescription`, `name`, `pinyin`, `path`, `description`, `type`, `url`, `orderBy`, `target`, `status`, `mid`, `listView`, `articleView`, `createdAt`, `updatedAt`) VALUES (9, 7, '', '', '', '作者', 'zuozhe', '/about/zuozhe', '', '1', '', 0, '0', '0', '0', 'list.html', 'page.html', '2024-12-05 23:25:44', '2024-12-05 23:34:37');
COMMIT;

-- ----------------------------
-- Table structure for cms_field
-- ----------------------------
DROP TABLE IF EXISTS `cms_field`;
CREATE TABLE `cms_field` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mid` int(11) DEFAULT NULL COMMENT '模型id',
  `cname` varchar(60) DEFAULT NULL COMMENT '模型字段中文名称',
  `ename` varchar(60) DEFAULT '' COMMENT '模型字段英文名称',
  `type` varchar(10) DEFAULT NULL COMMENT '表单类型\r\n1单行文本	\r\n2.多行文本 \r\n3.下拉菜单 \r\n4.单选 \r\n5.多选 \r\n6.时间和日期 7.数字',
  `val` varchar(255) DEFAULT NULL COMMENT '字段配置 下拉菜单多选等选项配置',
  `defaultVal` varchar(255) DEFAULT NULL COMMENT '默认值',
  `orderBy` varchar(255) DEFAULT '0' COMMENT '字段顺序',
  `length` varchar(255) DEFAULT NULL COMMENT '字段长度',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `model_id` (`mid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='字段字典';

-- ----------------------------
-- Records of cms_field
-- ----------------------------
BEGIN;
INSERT INTO `cms_field` (`id`, `mid`, `cname`, `ename`, `type`, `val`, `defaultVal`, `orderBy`, `length`) VALUES (1, 1, '文件名称', 'fileName', '1', '', '', '0', '');
INSERT INTO `cms_field` (`id`, `mid`, `cname`, `ename`, `type`, `val`, `defaultVal`, `orderBy`, `length`) VALUES (2, 1, '文件版本', 'fileVersion', '1', '', '', '0', '');
INSERT INTO `cms_field` (`id`, `mid`, `cname`, `ename`, `type`, `val`, `defaultVal`, `orderBy`, `length`) VALUES (3, 1, '文件链接', 'fileLink', '1', '', '', '0', '');
INSERT INTO `cms_field` (`id`, `mid`, `cname`, `ename`, `type`, `val`, `defaultVal`, `orderBy`, `length`) VALUES (4, 1, '测试1', 'test1', '4', '', '{\"options\":[{\"label\":\"本地下载\",\"value\":\"1\"},{\"label\":\"电信下载\",\"value\":\"2\"}]}', '0', '');
INSERT INTO `cms_field` (`id`, `mid`, `cname`, `ename`, `type`, `val`, `defaultVal`, `orderBy`, `length`) VALUES (5, 1, 'test1', 'booktest1', '1', '', '', '0', '');
COMMIT;

-- ----------------------------
-- Table structure for cms_frag
-- ----------------------------
DROP TABLE IF EXISTS `cms_frag`;
CREATE TABLE `cms_frag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT '' COMMENT '名称',
  `mark` varchar(50) DEFAULT NULL COMMENT '标识',
  `content` longtext COMMENT '内容',
  `type` tinytext COMMENT '类型 1 富文本 2 文本框',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='碎片';

-- ----------------------------
-- Records of cms_frag
-- ----------------------------
BEGIN;
INSERT INTO `cms_frag` (`id`, `name`, `mark`, `content`, `type`, `createdAt`, `updatedAt`) VALUES (1, 'chancms简介', 'chancms', '<p><span style=\"font-size: 14px;\">ChanCMS是一款基于Node、Express、MySQL、Vue3研发的高质量实用型CMS系统。轻量、灵活、稳定、高性能、易扩展，让开发更简单。</span></p>', '1', '2024-09-13 22:53:33', '2024-09-27 10:51:41');
INSERT INTO `cms_frag` (`id`, `name`, `mark`, `content`, `type`, `createdAt`, `updatedAt`) VALUES (2, 'PowerBy', 'PowerBy', '<p style=\"text-align: center;\">Powder By <a href=\"http://www.chancms.top\" target=\"_blank\" rel=\"noopener\">ChanCMS v3.0.14</a></p>', '1', '2024-09-27 11:00:03', '2025-02-12 22:13:21');
INSERT INTO `cms_frag` (`id`, `name`, `mark`, `content`, `type`, `createdAt`, `updatedAt`) VALUES (3, '测试使用', 'test1', '<p>欢迎使用ChanCMS系统1</p>', '1', '2026-02-26 09:30:27', '2026-03-08 12:59:36');
COMMIT;

-- ----------------------------
-- Table structure for cms_friendlink
-- ----------------------------
DROP TABLE IF EXISTS `cms_friendlink`;
CREATE TABLE `cms_friendlink` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT '链接名称',
  `link` varchar(255) DEFAULT NULL COMMENT '链接地址',
  `orderBy` tinyint(255) DEFAULT '0' COMMENT '排序',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='友情链接';

-- ----------------------------
-- Records of cms_friendlink
-- ----------------------------
BEGIN;
INSERT INTO `cms_friendlink` (`id`, `title`, `link`, `orderBy`, `createdAt`, `updatedAt`) VALUES (1, 'ChanCMS官网', 'https://www.chancms.top', 0, '2024-10-02 14:12:45', '2024-10-02 14:12:45');
COMMIT;

-- ----------------------------
-- Table structure for cms_message
-- ----------------------------
DROP TABLE IF EXISTS `cms_message`;
CREATE TABLE `cms_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('1','2','3','4') DEFAULT NULL COMMENT '留言分类 1->咨询 2->建议 3->投诉 4->其它',
  `title` varchar(255) DEFAULT NULL COMMENT '留言标题',
  `name` varchar(100) DEFAULT NULL COMMENT '姓名',
  `tel` varchar(50) DEFAULT NULL COMMENT '电话',
  `wechat` varchar(50) DEFAULT NULL COMMENT '微信',
  `company` varchar(100) DEFAULT NULL COMMENT '公司名称',
  `content` varchar(500) DEFAULT NULL COMMENT '留言内容',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='留言';

-- ----------------------------
-- Records of cms_message
-- ----------------------------
BEGIN;
INSERT INTO `cms_message` (`id`, `type`, `title`, `name`, `tel`, `wechat`, `company`, `content`, `createdAt`, `updatedAt`) VALUES (1, '1', '1', '1111', '1', '1', '1', '1', '2025-04-02 15:47:25', '2025-04-02 15:47:25');
INSERT INTO `cms_message` (`id`, `type`, `title`, `name`, `tel`, `wechat`, `company`, `content`, `createdAt`, `updatedAt`) VALUES (2, '2', '112', '12', '13366826071', '', '', '1212', '2026-02-26 09:36:02', '2026-02-26 09:36:02');
COMMIT;

-- ----------------------------
-- Table structure for cms_model
-- ----------------------------
DROP TABLE IF EXISTS `cms_model`;
CREATE TABLE `cms_model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(10) DEFAULT NULL COMMENT '模型名称',
  `tableName` varchar(50) DEFAULT NULL COMMENT '模型对应的表名',
  `status` varchar(1) DEFAULT '1' COMMENT '1->开启 0->关闭',
  `remark` varchar(50) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='模型字典';

-- ----------------------------
-- Records of cms_model
-- ----------------------------
BEGIN;
INSERT INTO `cms_model` (`id`, `model`, `tableName`, `status`, `remark`) VALUES (1, '下载模型', 'ext_download', '1', '下载模型');
COMMIT;

-- ----------------------------
-- Table structure for cms_site
-- ----------------------------
DROP TABLE IF EXISTS `cms_site`;
CREATE TABLE `cms_site` (
  `id` int(2) NOT NULL AUTO_INCREMENT COMMENT '站点id',
  `name` varchar(20) DEFAULT NULL COMMENT '网站名称',
  `logo` varchar(500) DEFAULT NULL COMMENT '网站logo',
  `domain` varchar(30) DEFAULT NULL COMMENT '网站域名',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `wx` varchar(30) DEFAULT NULL COMMENT '微信',
  `icp` varchar(100) DEFAULT NULL COMMENT 'ICP备案号',
  `code` varchar(255) DEFAULT NULL COMMENT '站点统计代码',
  `json` text COMMENT '万能配置',
  `title` varchar(50) DEFAULT NULL COMMENT '页面标题',
  `keywords` varchar(100) DEFAULT NULL COMMENT '页面关键词',
  `description` varchar(255) DEFAULT NULL COMMENT '页面描述',
  `template` varchar(50) DEFAULT 'default' COMMENT 'view模板名称',
  `uploadWay` char(1) DEFAULT '1' COMMENT '上传方式 1->普通 2->七牛云',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='网站信息';

-- ----------------------------
-- Records of cms_site
-- ----------------------------
BEGIN;
INSERT INTO `cms_site` (`id`, `name`, `logo`, `domain`, `email`, `wx`, `icp`, `code`, `json`, `title`, `keywords`, `description`, `template`, `uploadWay`, `createdAt`, `updatedAt`) VALUES (1, 'ChanCMS', '/public/view/default/img/logo.png', 'www.chancms.top', '867528315@qq.com', NULL, '皖ICP备2024030927号-1', '', '', 'ChanCMS演示站', 'ChanCMS演示站', 'ChanCMS是一款基于Express和MySQL研发的高质量实用型CMS管理系统。它具备多种类型网站开发，易扩展、基于模块化和插件化开发模式，适用于商用企业级程序开发。', 'default', '1', NULL, '2026-03-01 00:37:14');
COMMIT;

-- ----------------------------
-- Table structure for cms_slide
-- ----------------------------
DROP TABLE IF EXISTS `cms_slide`;
CREATE TABLE `cms_slide` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标题',
  `imgUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '轮播图',
  `linkUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '轮播链接',
  `content` text COLLATE utf8mb4_unicode_ci COMMENT '轮播文案',
  `mark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `sort` tinyint(2) DEFAULT '0' COMMENT '排序',
  `status` tinyint(2) DEFAULT '0' COMMENT '0 发布 1 不发布',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='轮播图';

-- ----------------------------
-- Records of cms_slide
-- ----------------------------
BEGIN;
INSERT INTO `cms_slide` (`id`, `title`, `imgUrl`, `linkUrl`, `content`, `mark`, `sort`, `status`, `createdAt`, `updatedAt`) VALUES (1, '测试轮播图1', '/public/view/default/img/01.jpg', '', '<h2 class=\"text-4xl font-bold mb-4\">环保科技引领未来</h2>\n<p class=\"text-xl mb-6\">专业的环保解决方案提供商</p>\n<p><a href=\"about.html\" class=\"bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300\">联系我们</a></p>', NULL, NULL, 0, '2024-09-17 10:52:05', '2026-03-01 13:29:22');
INSERT INTO `cms_slide` (`id`, `title`, `imgUrl`, `linkUrl`, `content`, `mark`, `sort`, `status`, `createdAt`, `updatedAt`) VALUES (2, '测试轮播图2', '/public/view/default/img/03.jpg', '', NULL, NULL, NULL, 0, '2025-07-05 20:51:11', '2026-03-01 13:29:32');
INSERT INTO `cms_slide` (`id`, `title`, `imgUrl`, `linkUrl`, `content`, `mark`, `sort`, `status`, `createdAt`, `updatedAt`) VALUES (3, '测试轮播图3', '/public/view/default/img/04.jpg', '', '<p>是否211</p>', NULL, 0, 0, '2026-02-25 20:23:57', '2026-03-01 13:29:41');
COMMIT;

-- ----------------------------
-- Table structure for cms_tag
-- ----------------------------
DROP TABLE IF EXISTS `cms_tag`;
CREATE TABLE `cms_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) DEFAULT NULL COMMENT '标签名称',
  `path` varchar(255) DEFAULT '' COMMENT '标识',
  `count` int(11) DEFAULT '0' COMMENT '引用次数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='标签';

-- ----------------------------
-- Records of cms_tag
-- ----------------------------
BEGIN;
INSERT INTO `cms_tag` (`id`, `name`, `path`, `count`) VALUES (1, '图片', 'pic', 7);
INSERT INTO `cms_tag` (`id`, `name`, `path`, `count`) VALUES (2, 'chancms', 'chancms', 8);
INSERT INTO `cms_tag` (`id`, `name`, `path`, `count`) VALUES (3, '122', '1', 1);
COMMIT;

-- ----------------------------
-- Table structure for ext_download
-- ----------------------------
DROP TABLE IF EXISTS `ext_download`;
CREATE TABLE `ext_download` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `fileName` varchar(250) DEFAULT '',
  `fileVersion` varchar(255) DEFAULT NULL,
  `fileLink` varchar(250) DEFAULT '',
  `test1` text,
  `booktest1` varchar(250) DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `aid` (`aid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='下载模型';

-- ----------------------------
-- Records of ext_download
-- ----------------------------
BEGIN;
INSERT INTO `ext_download` (`id`, `aid`, `fileName`, `fileVersion`, `fileLink`, `test1`, `booktest1`) VALUES (1, 13, '文件下载', 'v2022', 'https://www.chancms.top', '1', '');
INSERT INTO `ext_download` (`id`, `aid`, `fileName`, `fileVersion`, `fileLink`, `test1`, `booktest1`) VALUES (2, 10, 'ChanCMS', 'v3.6', 'http://www.chancms.top', '1', '测试');
COMMIT;

-- ----------------------------
-- Table structure for ext_test
-- ----------------------------
DROP TABLE IF EXISTS `ext_test`;
CREATE TABLE `ext_test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='1';

-- ----------------------------
-- Records of ext_test
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for member
-- ----------------------------
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '会员id',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户名',
  `nickname` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '会员昵称',
  `password` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '密码',
  `sex` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '性别（0-未知 1-男 2-女 ）',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `wechat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '微信',
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电话号码',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像',
  `status` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '状态 1-启用 2-关闭',
  `login_ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录ip',
  `loginDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后一次登录时间',
  `pwdUpdateDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后一次修改密码时间',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '注册日期',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE,
  UNIQUE KEY `member_email` (`email`) USING BTREE,
  KEY `status` (`status`) USING BTREE,
  KEY `loginDate` (`loginDate`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='会员表(核心)';

-- ----------------------------
-- Records of member
-- ----------------------------
BEGIN;
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (1, 'zhangyong', NULL, '$2b$12$7nPtIZ9upiEUiRftPipqmOX7mi1/QCfvbmyJ9YStHzZGUgCkVngqG', '0', 'zhangyong_1430@163.com', NULL, NULL, NULL, NULL, NULL, '2025-09-12 09:47:00', '2025-09-12 09:47:00', '2025-09-12 09:47:00', '2025-09-12 09:47:00', NULL);
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (2, 'yanyutao1', NULL, '$2b$12$pQ1uUgg9ySD93fxtFPoJl.GHduP/6djp2xuc22Ni1xs/zWSjV/opO', '0', '8675283151@qq.com', NULL, NULL, NULL, NULL, NULL, '2025-09-12 11:31:44', '2025-09-12 11:31:44', '2025-09-12 11:31:44', '2025-09-12 11:31:44', NULL);
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (3, 'yanyutao2023', NULL, '$2b$12$oXfmsnZLyxzq.199E9VA3O1YSpK1Xz6CWvvmoHGi48AdFM3uXZ2aK', '0', 'yanyutao2023@163.com', NULL, NULL, NULL, NULL, NULL, '2025-09-26 13:37:10', '2025-09-26 13:37:10', '2025-09-26 13:37:10', '2025-09-26 13:37:10', NULL);
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (4, 'wx_mhkokn1l_9707', 'wx_yhWv4k', NULL, '0', NULL, NULL, NULL, '', '1', '122.96.14.142', '2025-11-23 22:36:17', '2025-11-23 22:36:17', '2025-11-04 22:45:07', '2025-11-23 22:36:17', NULL);
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (5, 'wx_mhobaf5h_c623', 'wx__qkAYw', NULL, '0', NULL, NULL, NULL, '', '1', '58.16.130.22', '2025-11-07 11:44:20', '2025-11-07 11:44:20', '2025-11-07 11:44:20', '2025-11-07 11:44:20', NULL);
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (6, 'wx_mhobaydr_9c3a', 'wx_UHpbe8', NULL, '0', NULL, NULL, NULL, '', '1', '113.88.92.176', '2025-11-07 11:44:44', '2025-11-07 11:44:44', '2025-11-07 11:44:45', '2025-11-07 11:44:45', NULL);
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (7, 'wx_mhobba0a_eacf', 'wx_k__DF4', NULL, '0', NULL, NULL, NULL, '', '1', '116.21.134.33', '2025-11-07 11:45:00', '2025-11-07 11:45:00', '2025-11-07 11:45:00', '2025-11-07 11:45:00', NULL);
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (8, 'wx_mhobq4hi_82ed', 'wx_rQePXk', NULL, '0', NULL, NULL, NULL, '', '1', '20.222.140.205', '2025-11-07 11:56:32', '2025-11-07 11:56:32', '2025-11-07 11:56:33', '2025-11-07 11:56:33', NULL);
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (9, 'wx_mhoe1uf0_abe9', 'wx_Fh-2a8', NULL, '0', NULL, NULL, NULL, '', '1', '111.204.255.130', '2025-11-07 13:01:38', '2025-11-07 13:01:38', '2025-11-07 13:01:39', '2025-11-07 13:01:39', NULL);
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (10, 'wx_mhshtv4c_f4e9', 'wx_GPsJ_Q', NULL, '0', NULL, NULL, NULL, '', '1', '223.160.208.3', '2025-11-10 09:58:29', '2025-11-10 09:58:29', '2025-11-10 09:58:30', '2025-11-10 09:58:30', NULL);
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (11, 'setvet', NULL, '$2b$12$DBETVWNW48wcpnNL1nZgYeDzT0x0Aag6BtNJmbL5ed9gxKhQ2VFZ.', '0', '424052164@qq.com', NULL, NULL, NULL, NULL, NULL, '2025-11-22 16:00:43', '2025-11-22 16:00:43', '2025-11-22 16:00:43', '2025-11-22 16:00:43', NULL);
INSERT INTO `member` (`id`, `username`, `nickname`, `password`, `sex`, `email`, `wechat`, `phone`, `avatar`, `status`, `login_ip`, `loginDate`, `pwdUpdateDate`, `createdAt`, `updatedAt`, `remark`) VALUES (12, 'yanyutao', 'v', '$2b$12$WOjUKAF5PLgkHVAZm81O9edqin6WzvcdL5H7NPlI48WbCG3pngWaK', '0', '867528315@qq.com', 'v', '13366826071', NULL, '1', NULL, '2026-03-23 17:52:01', '2026-03-23 17:52:01', '2026-02-26 17:42:56', '2026-03-23 17:52:01', NULL);
COMMIT;

-- ----------------------------
-- Table structure for member_comment
-- ----------------------------
DROP TABLE IF EXISTS `member_comment`;
CREATE TABLE `member_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `member_id` int(11) NOT NULL COMMENT '会员ID',
  `article_id` int(11) NOT NULL COMMENT '文章ID',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评论内容',
  `status` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT '2' COMMENT '审核状态 1-待审核 2-已通过 3-已拒绝',
  `audit_time` datetime DEFAULT NULL COMMENT '审核时间',
  `audit_user_id` int(11) DEFAULT NULL COMMENT '审核人ID',
  `audit_remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '审核备注',
  `parent_id` int(11) DEFAULT NULL COMMENT '父评论ID（用于回复功能）',
  `reply_to_member_id` int(11) DEFAULT NULL COMMENT '回复的会员ID',
  `like_count` int(11) DEFAULT '0' COMMENT '点赞数',
  `anonymous_nickname` varchar(50) DEFAULT NULL COMMENT '匿名评论昵称',
  `anonymous_email` varchar(100) DEFAULT NULL COMMENT '匿名评论邮箱',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `member_id` (`member_id`) USING BTREE,
  KEY `article_id` (`article_id`) USING BTREE,
  KEY `status` (`status`) USING BTREE,
  KEY `parent_id` (`parent_id`) USING BTREE,
  KEY `createdAt` (`createdAt`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='会员评论表';

-- ----------------------------
-- Records of member_comment
-- ----------------------------
BEGIN;
INSERT INTO `member_comment` (`id`, `member_id`, `article_id`, `content`, `status`, `audit_time`, `audit_user_id`, `audit_remark`, `parent_id`, `reply_to_member_id`, `like_count`, `createdAt`, `updatedAt`) VALUES (1, 12, 1, '我去', '2', NULL, NULL, NULL, NULL, NULL, 0, '2026-03-20 15:13:06', '2026-03-20 15:13:06');
COMMIT;

-- ----------------------------
-- Table structure for member_comment_like
-- ----------------------------
DROP TABLE IF EXISTS `member_comment_like`;
CREATE TABLE `member_comment_like` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `comment_id` int(11) NOT NULL COMMENT '评论ID',
  `member_id` int(11) NOT NULL COMMENT '会员ID',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uniq_comment_member` (`comment_id`,`member_id`) USING BTREE,
  KEY `comment_id` (`comment_id`) USING BTREE,
  KEY `member_id` (`member_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='评论点赞表';

-- ----------------------------
-- Records of member_comment_like
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for member_favorite
-- ----------------------------
DROP TABLE IF EXISTS `member_favorite`;
CREATE TABLE `member_favorite` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `member_id` int(11) NOT NULL COMMENT '会员ID',
  `article_id` int(11) NOT NULL COMMENT '文章ID',
  `article_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章标题（冗余字段）',
  `article_cover` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章封面（冗余字段）',
  `article_summary` text COLLATE utf8mb4_unicode_ci COMMENT '文章摘要（冗余字段）',
  `article_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章URL',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uniq_member_article` (`member_id`,`article_id`) USING BTREE,
  KEY `member_id` (`member_id`) USING BTREE,
  KEY `article_id` (`article_id`) USING BTREE,
  KEY `createdAt` (`createdAt`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='会员收藏表';

-- ----------------------------
-- Records of member_favorite
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for member_level
-- ----------------------------
DROP TABLE IF EXISTS `member_level`;
CREATE TABLE `member_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '等级代码 super0注册 super1 月 super2 季  super3年 super9永久会员',
  `level_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '等级显示名称',
  `days_valid` int(11) DEFAULT NULL COMMENT '有效天数（null表示永久）',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `level_code` (`level_code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='会员等级';

-- ----------------------------
-- Records of member_level
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for member_levelship
-- ----------------------------
DROP TABLE IF EXISTS `member_levelship`;
CREATE TABLE `member_levelship` (
  `member_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  PRIMARY KEY (`member_id`) USING BTREE,
  KEY `level_id` (`level_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='会员等级关系(核心)';

-- ----------------------------
-- Records of member_levelship
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for member_order
-- ----------------------------
DROP TABLE IF EXISTS `member_order`;
CREATE TABLE `member_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) NOT NULL,
  `order_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('alipay') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'alipay',
  `status` enum('pending','paid','expired','refunded') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `paid_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `order_no` (`order_no`) USING BTREE,
  KEY `member_id` (`member_id`) USING BTREE,
  KEY `product_id` (`product_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='订单表';

-- ----------------------------
-- Records of member_order
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for member_product
-- ----------------------------
DROP TABLE IF EXISTS `member_product`;
CREATE TABLE `member_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '产品名称（月/季/年会员）',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `level_id` int(11) NOT NULL COMMENT '关联的会员等级',
  `duration_days` int(255) DEFAULT NULL COMMENT '有效天数',
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `level_id` (`level_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='产品表';

-- ----------------------------
-- Records of member_product
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for member_reading_record
-- ----------------------------
DROP TABLE IF EXISTS `member_reading_record`;
CREATE TABLE `member_reading_record` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `read_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `member_id` (`member_id`) USING BTREE,
  KEY `article_id` (`article_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='阅读记录表';

-- ----------------------------
-- Records of member_reading_record
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for member_social_login
-- ----------------------------
DROP TABLE IF EXISTS `member_social_login`;
CREATE TABLE `member_social_login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '逻辑关联 user.id（无外键）',
  `platform` enum('wechat','qq') NOT NULL COMMENT '第三方平台',
  `openid` varchar(255) NOT NULL COMMENT '平台OpenID',
  `unionid` varchar(255) DEFAULT NULL COMMENT '微信UnionID（跨应用唯一）',
  `sex` tinyint(1) DEFAULT '0' COMMENT '第三方性别',
  `country` varchar(50) DEFAULT NULL COMMENT '国家',
  `province` varchar(50) DEFAULT NULL COMMENT '省份',
  `city` varchar(50) DEFAULT NULL COMMENT '城市',
  `access_token` varchar(255) DEFAULT NULL COMMENT '访问令牌',
  `refresh_token` varchar(255) DEFAULT NULL COMMENT '刷新令牌',
  `expires_in` int(11) DEFAULT '7200' COMMENT '过期时间（秒）',
  `token_updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'token更新时间',
  `last_login_ip` varchar(255) DEFAULT NULL COMMENT '最后登录ip',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uniq_platform_openid` (`platform`,`openid`) USING BTREE,
  UNIQUE KEY `uniq_unionid` (`unionid`,`platform`) USING BTREE,
  KEY `idx_user_id` (`user_id`) USING BTREE,
  KEY `idx_unionid` (`unionid`) USING BTREE,
  KEY `idx_created_at` (`created_at`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='第三方登录表';

-- ----------------------------
-- Records of member_social_login
-- ----------------------------
BEGIN;
INSERT INTO `member_social_login` (`id`, `user_id`, `platform`, `openid`, `unionid`, `sex`, `country`, `province`, `city`, `access_token`, `refresh_token`, `expires_in`, `token_updated_at`, `last_login_ip`, `created_at`, `updated_at`) VALUES (1, 10000013, 'wechat', 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, 0, '', '', '', '97_oP_Br_VA40Uo0o_m3qvMJrr4thpkB5HZURMzZ4v98uSpBzjt9Kr2RZXjj5W5cKaQ4XkDhLGtaRNMgsGcUk2NwKDJ_o3lfBTz7Gm0gCX_be4', '97_c9t9ZHe9-CXsD2fh4DvJoVKbu041uWVqvnFzm4xybNVbcGnN2bnbiF4Cw_Rty4H1l3szUqy7gy9Mxu2LxvkQcB7w4OZvaIfMUnPq8YX-Jhg', 7200, '2025-11-23 22:36:17', '122.96.14.142', '2025-11-04 22:45:07', '2025-11-23 22:36:17');
INSERT INTO `member_social_login` (`id`, `user_id`, `platform`, `openid`, `unionid`, `sex`, `country`, `province`, `city`, `access_token`, `refresh_token`, `expires_in`, `token_updated_at`, `last_login_ip`, `created_at`, `updated_at`) VALUES (2, 10000014, 'wechat', 'oPW1t2KC7YTW2ZlfuX2HrJ_qkAYw', NULL, 0, '', '', '', NULL, NULL, 7200, '2025-11-07 11:44:20', NULL, '2025-11-07 11:44:20', '2025-11-07 11:44:20');
INSERT INTO `member_social_login` (`id`, `user_id`, `platform`, `openid`, `unionid`, `sex`, `country`, `province`, `city`, `access_token`, `refresh_token`, `expires_in`, `token_updated_at`, `last_login_ip`, `created_at`, `updated_at`) VALUES (3, 10000015, 'wechat', 'oPW1t2LK2ubjCwIeDdCMwSUHpbe8', NULL, 0, '', '', '', NULL, NULL, 7200, '2025-11-07 11:44:44', NULL, '2025-11-07 11:44:45', '2025-11-07 11:44:45');
INSERT INTO `member_social_login` (`id`, `user_id`, `platform`, `openid`, `unionid`, `sex`, `country`, `province`, `city`, `access_token`, `refresh_token`, `expires_in`, `token_updated_at`, `last_login_ip`, `created_at`, `updated_at`) VALUES (4, 10000016, 'wechat', 'oPW1t2LpL2h1RRUPLTaVvZk__DF4', NULL, 0, '', '', '', NULL, NULL, 7200, '2025-11-07 11:45:00', NULL, '2025-11-07 11:45:00', '2025-11-07 11:45:00');
INSERT INTO `member_social_login` (`id`, `user_id`, `platform`, `openid`, `unionid`, `sex`, `country`, `province`, `city`, `access_token`, `refresh_token`, `expires_in`, `token_updated_at`, `last_login_ip`, `created_at`, `updated_at`) VALUES (5, 10000017, 'wechat', 'oPW1t2EQwBBvf1OTo8UXV6rQePXk', NULL, 0, '', '', '', NULL, NULL, 7200, '2025-11-07 11:56:32', NULL, '2025-11-07 11:56:33', '2025-11-07 11:56:33');
INSERT INTO `member_social_login` (`id`, `user_id`, `platform`, `openid`, `unionid`, `sex`, `country`, `province`, `city`, `access_token`, `refresh_token`, `expires_in`, `token_updated_at`, `last_login_ip`, `created_at`, `updated_at`) VALUES (6, 10000018, 'wechat', 'oPW1t2BGDQfPMX3KX8lTBvFh-2a8', NULL, 0, '', '', '', NULL, NULL, 7200, '2025-11-07 13:01:38', NULL, '2025-11-07 13:01:39', '2025-11-07 13:01:39');
INSERT INTO `member_social_login` (`id`, `user_id`, `platform`, `openid`, `unionid`, `sex`, `country`, `province`, `city`, `access_token`, `refresh_token`, `expires_in`, `token_updated_at`, `last_login_ip`, `created_at`, `updated_at`) VALUES (7, 10000019, 'wechat', 'oPW1t2MsoyBhHKgNoG0kxvGPsJ_Q', NULL, 0, '', '', '', NULL, NULL, 7200, '2025-11-10 09:58:29', NULL, '2025-11-10 09:58:30', '2025-11-10 09:58:30');
COMMIT;

-- ----------------------------
-- Table structure for member_verification_codes
-- ----------------------------
DROP TABLE IF EXISTS `member_verification_codes`;
CREATE TABLE `member_verification_codes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `email` varchar(255) NOT NULL COMMENT '邮箱地址',
  `code` char(6) NOT NULL COMMENT '6位验证码',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1-未使用\r\n2-已使用 3-已过期',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `expires_at` datetime DEFAULT NULL COMMENT '过期时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `udx_email_scene` (`email`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of member_verification_codes
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for plus_collect
-- ----------------------------
DROP TABLE IF EXISTS `plus_collect`;
CREATE TABLE `plus_collect` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `taskName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '任务名称',
  `targetUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '采集地址',
  `listTag` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '列表tag标签',
  `startNum` int(11) DEFAULT '1' COMMENT '开始页面',
  `endNum` int(11) DEFAULT NULL COMMENT '结束页面',
  `increment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '1' COMMENT '递增数量默认1',
  `titleTag` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标题',
  `articleTag` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章内容',
  `charset` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '编码 1-> utf-8  2-> gb2312',
  `pages` text COLLATE utf8mb4_unicode_ci COMMENT '采集地址集合',
  `parseData` text COLLATE utf8mb4_unicode_ci COMMENT '格式化数据函数',
  `cid` int(11) NOT NULL COMMENT '存储到栏目',
  `status` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT '1' COMMENT '发布状态 1 草稿 2 发布',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `cid` (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='采集';

-- ----------------------------
-- Records of plus_collect
-- ----------------------------
BEGIN;
INSERT INTO `plus_collect` (`id`, `taskName`, `targetUrl`, `listTag`, `startNum`, `endNum`, `increment`, `titleTag`, `articleTag`, `charset`, `pages`, `parseData`, `cid`, `status`, `createdAt`, `updatedAt`) VALUES (1, '人民网-top文章', 'http://www.people.com.cn/', '#rm_topline a', 1, 1, '1', 'h1', '.rm_txt_con', '1', 'http://opinion.people.com.cn/n1/2025/1021/c1003-40585875.html', '{\n \"removeSelectors\":\".paper_num\"\n}', 8, '2', '2024-08-22 16:27:19', '2025-10-21 16:57:42');
COMMIT;

-- ----------------------------
-- Table structure for plus_gather
-- ----------------------------
DROP TABLE IF EXISTS `plus_gather`;
CREATE TABLE `plus_gather` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `taskName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '任务名称',
  `targetUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '采集地址',
  `parseData` text COLLATE utf8mb4_unicode_ci COMMENT '格式化数据函数',
  `cid` int(11) NOT NULL COMMENT '存储到栏目',
  `status` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT '1' COMMENT '发布状态 1 草稿 2 发布',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `cid` (`cid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='开源接口采集';

-- ----------------------------
-- Records of plus_gather
-- ----------------------------
BEGIN;
INSERT INTO `plus_gather` (`id`, `taskName`, `targetUrl`, `parseData`, `cid`, `status`, `createdAt`, `updatedAt`) VALUES (1, '每日新闻60s', 'https://60api.09cdn.xyz/v2/60s?encoding=json', '{\n    \"title\": {\n        \"path\": \"data.tip\"\n    },\n    \"content\": {\n        \"path\": \"data.news\",\n        \"isArray\": true,\n        \"wrap\": \"p\"\n    }\n}', 8, '2', '2023-11-29 19:10:45', '2025-10-22 13:59:38');
COMMIT;

-- ----------------------------
-- Table structure for sys_config
-- ----------------------------
DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type_code` varchar(50) NOT NULL COMMENT '关联配置类型',
  `config_key` varchar(100) NOT NULL COMMENT '配置键',
  `config_value` text NOT NULL COMMENT '配置值',
  `status` char(1) NOT NULL DEFAULT '1' COMMENT '开启（1 开启 2 关闭）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `config_key` (`config_key`) USING BTREE,
  KEY `sys_config_ibfk_1` (`type_code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统配置表';

-- ----------------------------
-- Records of sys_config
-- ----------------------------
BEGIN;
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (1, 'wechat_minip', 'appid', '231', '1', '2025-03-07 14:50:13', '2026-02-26 09:40:55', '小程序appId');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (2, 'wechat_minip', 'secret', '23', '1', '2025-03-07 14:54:36', '2025-03-07 22:11:33', '');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (3, 'qiniu_oss', 'accessKey', '5xoT5V81UHKLCVnVcGnoVWVtrw2fdJk_n7X8Pt0o', '1', '2025-03-07 14:59:31', '2025-08-27 11:11:22', '');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (4, 'qiniu_oss', 'secretKey', 'N9V-UkYmjIi7nxi1eL_WhLHR9TUIQFh0fxBct7bx', '1', '2025-03-07 14:59:51', '2025-08-27 11:11:22', '');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (5, 'qiniu_oss', 'bucket', 'ohm', '1', '2025-03-07 15:00:08', '2025-08-27 11:11:22', '');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (6, 'cms_config', 'uploadWay', '1', '1', '2025-03-07 15:00:42', '2025-03-07 15:00:42', '');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (7, 'qiniu_oss', 'domain', 'resource.ohmvehicles.com', '1', '2025-03-07 17:48:50', '2025-08-27 11:11:22', NULL);
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (8, 'cms_data', 'init', '{\"category\": {\"method\": \"category\"}, \"friendlink\": {\"method\": \"friendLink\", \"params\": {\"pageSize\": 10}}, \"frag\": {\"method\": \"frag\", \"params\": {\"pageSize\": 50}}, \"tag\": {\"method\": \"tag\", \"params\": {\"pageSize\": 10}}}', '1', '2025-07-30 11:11:47', '2025-11-30 16:37:45', '模板全局数据');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (9, 'cms_data', 'home', '{\r\n  \"banner\": {\r\n    \"method\": \"bannerSlide\",\r\n    \"show\": true\r\n  },\r\n  \"slide\": {\r\n    \"method\": \"getArticleList\",\r\n    \"params\": {\r\n      \"start\": 0,\r\n      \"len\": 1,\r\n      \"attr\": [\r\n        \"3\"\r\n      ]\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"link\",\r\n      \"img\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"top\": {\r\n    \"method\": \"getArticleList\",\r\n    \"params\": {\r\n      \"start\": 0,\r\n      \"len\": 1,\r\n      \"attr\": [\r\n        \"1\"\r\n      ],\r\n      \"type\": 1\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"description\",\r\n      \"img\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"news\": {\r\n    \"method\": \"getArticleList\",\r\n    \"params\": {\r\n      \"start\": 0,\r\n      \"len\": 3,\r\n      \"excludeAttr\": [\r\n        \"1\"\r\n      ]\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"createdAt\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"article\": {\r\n    \"method\": \"getArticleListByCids\",\r\n    \"params\": {\r\n      \"cid\": [],\r\n      \"len\": 5,\r\n      \"toplen\": 1,\r\n      \"attr\": [\r\n        \"1\",\r\n        \"2\"\r\n      ]\r\n    },\r\n    \"show\": true\r\n  },\r\n  \"imgs\": {\r\n    \"method\": \"getNewImgList\",\r\n    \"params\": {\r\n      \"len\": 8\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"img\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"recommend\": {\r\n    \"method\": \"getArticleList\",\r\n    \"params\": {\r\n      \"start\": 0,\r\n      \"len\": 10,\r\n      \"attr\": [\r\n        \"2\"\r\n      ]\r\n    },\r\n    \"show\": true\r\n  },\r\n  \"hot\": {\r\n    \"method\": \"getArticlePvList\",\r\n    \"show\": true\r\n  },\r\n  \"recommendImgs\": {\r\n    \"method\": \"getNewImgList\",\r\n    \"params\": {\r\n      \"len\": 10,\r\n      \"id\": \"\",\r\n      \"attr\": [\r\n        \"2\"\r\n      ]\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"img\",\r\n      \"description\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"friendlink\": {\r\n    \"method\": \"friendLink\",\r\n    \"params\": {\r\n      \"pageSize\": 10\r\n    },\r\n    \"show\": true\r\n  }\r\n}', '1', '2025-07-30 11:15:24', '2025-11-30 16:37:55', '模板首页数据');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (10, 'cms_data', 'list', '{\r\n  \"articleList\": {\r\n    \"method\": \"list\",\r\n    \"params\": {\r\n      \"pageSize\": 10\r\n    }\r\n  },\r\n  \"recommend\": {\r\n    \"method\": \"getArticleListByCid\",\r\n    \"params\": {\r\n      \"len\": 5,\r\n      \"attr\": [\r\n        \"2\"\r\n      ]\r\n    },\r\n    \"show\": true\r\n  },\r\n  \"hot\": {\r\n    \"method\": \"getArticlePvList\",\r\n    \"params\": {\r\n      \"len\": 10\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"imgs\": {\r\n    \"method\": \"getNewImgList\",\r\n    \"params\": {\r\n      \"len\": 5\r\n    },\r\n    \"show\": true\r\n  }\r\n}', '1', '2025-07-30 11:22:19', '2025-11-30 16:38:07', '模板列表数据');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (11, 'cms_data', 'article', '{\r\n  \"news\": {\r\n    \"method\": \"getArticleListByCid\",\r\n    \"params\": {\r\n      \"len\": 10\r\n    }\r\n  },\r\n  \"hot\": {\r\n    \"method\": \"getArticlePvList\",\r\n    \"params\": {\r\n      \"len\": 10\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"pv\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"imgs\": {\r\n    \"method\": \"getNewImgList\",\r\n    \"params\": {\r\n      \"len\": 5\r\n    }\r\n  },\r\n  \"tags\": {\r\n    \"method\": \"fetchTagsByArticleId\",\r\n    \"params\": {\r\n      \"len\": 5\r\n    }\r\n  },\r\n  \"count\": {\r\n    \"method\": \"count\"\r\n  },\r\n  \"pre\": {\r\n    \"method\": \"prev\"\r\n  },\r\n  \"next\": {\r\n    \"method\": \"next\"\r\n  }\r\n}', '1', '2025-07-30 11:22:53', '2025-11-30 16:38:17', '模板详情数据');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (12, 'cms_data', 'page', '{\r\n  \"page\": {\r\n    \"method\": \"list\",\r\n    \"params\": {\r\n      \"pageSize\": 10\r\n    }\r\n  }\r\n}', '1', '2025-07-30 11:23:25', '2025-11-30 16:38:27', '模板单页数据');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (13, 'cms_data', 'search', '{\r\n  \"search\": {\r\n    \"method\": \"search\",\r\n    \"params\": {\r\n      \"pageSize\": 10,\r\n      \"cid\": 0\r\n    }\r\n  }\r\n}', '1', '2025-07-30 11:23:53', '2025-11-30 16:38:58', '模板搜索列表数据');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (14, 'cms_data', 'tags', '{\r\n  \"tags\": {\r\n    \"method\": \"tags\",\r\n    \"params\": {\r\n      \"pageSize\": 10\r\n    }\r\n  }\r\n}', '1', '2025-07-30 11:24:06', '2025-11-30 16:38:48', '模板tag列表数据');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (15, 'upload_config', 'logoSize', '51200', '1', '2026-03-01 00:00:00', '2026-03-01 00:00:00', 'Logo上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (16, 'upload_config', 'imgSize', '1073152', '1', '2026-03-01 00:00:00', '2026-03-01 00:00:00', '图片上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (17, 'upload_config', 'fileSize', '10485760', '1', '2026-03-01 00:00:00', '2026-03-01 00:00:00', '通用文件上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (18, 'upload_config', 'videoSize', '20971520', '1', '2026-03-01 00:00:00', '2026-03-01 00:00:00', '视频上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (19, 'upload_config', 'pdfSize', '11485760', '1', '2026-03-01 00:00:00', '2026-03-01 22:03:39', 'PDF上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (20, 'upload_config', 'musicSize', '5242880', '1', '2026-03-01 00:00:00', '2026-03-01 00:00:00', '音乐上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (21, 'upload_config', 'cssSize', '2097152', '1', '2026-03-01 00:00:00', '2026-03-01 00:00:00', 'CSS上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (22, 'upload_config', 'jsSize', '2097152', '1', '2026-03-01 00:00:00', '2026-03-01 00:00:00', 'JS上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (23, 'upload_config', 'fontSize', '2097152', '1', '2026-03-01 00:00:00', '2026-03-01 00:00:00', '字体上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (24, 'upload_config', 'archiveSize', '52428800', '1', '2026-03-01 00:00:00', '2026-03-01 00:00:00', '压缩包上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (25, 'upload_config', 'htmlSize', '5242880', '1', '2026-03-01 00:00:00', '2026-03-01 00:00:00', 'HTML上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (26, 'upload_config', 'txtSize', '1048576', '1', '2026-03-01 00:00:00', '2026-03-01 00:00:00', 'TXT上传大小限制（字节）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (27, 'comment_config', 'minLength', '1', '1', '2026-03-20 00:00:00', '2026-03-20 15:11:02', '评论最小字数');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (28, 'comment_config', 'maxLength', '50', '1', '2026-03-20 00:00:00', '2026-03-20 15:11:10', '评论最大字数');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (29, 'comment_config', 'maxLinks', '0', '1', '2026-03-20 00:00:00', '2026-03-20 15:11:23', '单条评论最大链接数');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (30, 'comment_config', 'spamInterval', '60', '1', '2026-03-20 00:00:00', '2026-03-20 00:00:00', '刷屏防护时间窗口（秒）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (31, 'comment_config', 'spamLimit', '3', '1', '2026-03-20 00:00:00', '2026-03-20 00:00:00', '刷屏防护窗口内最大评论数');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (32, 'comment_config', 'sensitiveWords', 'cao,操,woqu,习近平,党\n微信,wx,WeChat,QQ,加群,拉人,进群,私聊,私信,联系方式,电话,手机号,微信号,QQ号,二维码,链接,网址,www,http,https,.com,.cn,.net,.vip,推广,广告,代理,加盟,招商,刷单,返利,红包,福利,免费送,低价,代购,微商,引流,涨粉,点赞,关注,投票,傻逼,傻比,智障,脑残,废物,垃圾,去死,滚蛋,操,cao,mb,ma,sb操你妈,妈的,草泥马,cnm,nm,狗东西,贱人,杂种,畜生,傻逼玩意,傻缺,二逼,2b,煞笔,窝囊废,神经病,脑子有病,智障儿,脑瘫,去死吧,滚远点,妈的批,mp,狗娘养的,不要脸,无耻,下贱,傻逼货,赌博,博彩,六合彩,彩票,棋牌,打鱼,上分,下分,提现,充值,色情,黄片,约炮,嫖娼,卖淫,裸聊,偷拍,毒品,大麻,冰毒,枪支,弹药,管制刀具,诈骗,洗钱,传销,邪教,涉政,敏感,反社会,恐怖,暴力,杀人,放火,爆炸,毒品交易,微❤,微芯,薇信,wei信,W信,微X,Ⅴ信,+v,党,政府,国家,公安,国际,习近平,江泽民,胡景涛', '1', '2026-03-20 00:00:00', '2026-03-20 15:38:20', '敏感词列表（逗号分隔）');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (33, 'comment_config', 'enableSensitiveFilter', '1', '1', '2026-03-20 00:00:00', '2026-03-20 00:00:00', '是否启用敏感词过滤');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (34, 'comment_config', 'enableXSSFilter', '1', '1', '2026-03-20 00:00:00', '2026-03-20 00:00:00', '是否启用XSS过滤');
INSERT INTO `sys_config` (`id`, `type_code`, `config_key`, `config_value`, `status`, `create_time`, `update_time`, `remark`) VALUES (35, 'comment_config', 'enableLinkFilter', '1', '1', '2026-03-20 00:00:00', '2026-03-20 00:00:00', '是否启用链接限制');
COMMIT;

-- ----------------------------
-- Table structure for sys_config_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_config_type`;
CREATE TABLE `sys_config_type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `type_code` varchar(50) NOT NULL COMMENT '类型标识（如 qiniu, wechat_mini）',
  `type_name` varchar(50) NOT NULL COMMENT '类型名称（如七牛云存储、微信小程序）',
  `status` char(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `type_code` (`type_code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='配置类型表';

-- ----------------------------
-- Records of sys_config_type
-- ----------------------------
BEGIN;
INSERT INTO `sys_config_type` (`id`, `type_code`, `type_name`, `status`, `remark`, `create_time`, `update_time`) VALUES (1, 'wechat_minip', '微信小程序', '1', '微信小程序登录appId appkey', '2025-03-01 21:02:10', '2025-03-07 14:20:35');
INSERT INTO `sys_config_type` (`id`, `type_code`, `type_name`, `status`, `remark`, `create_time`, `update_time`) VALUES (2, 'qiniu_oss', '七牛云配置', '1', '七牛云oss配置', '2025-03-01 21:03:35', '2025-03-07 14:20:21');
INSERT INTO `sys_config_type` (`id`, `type_code`, `type_name`, `status`, `remark`, `create_time`, `update_time`) VALUES (3, 'cms_config', '应用设置', '1', '站点常用配置', '2025-03-04 19:10:51', '2025-03-07 14:21:05');
INSERT INTO `sys_config_type` (`id`, `type_code`, `type_name`, `status`, `remark`, `create_time`, `update_time`) VALUES (4, 'cms_data', '模板数据', '1', '页面模板接口配置数据', '2025-07-30 10:25:04', '2025-11-30 16:39:29');
INSERT INTO `sys_config_type` (`id`, `type_code`, `type_name`, `status`, `remark`, `create_time`, `update_time`) VALUES (5, 'upload_config', '上传配置', '1', '文件上传大小限制配置', '2026-03-01 00:00:00', '2026-03-01 00:00:00');
INSERT INTO `sys_config_type` (`id`, `type_code`, `type_name`, `status`, `remark`, `create_time`, `update_time`) VALUES (6, 'comment_config', '评论安全配置', '1', '用户评论安全防护配置', '2026-03-20 00:00:00', '2026-03-20 00:00:00');
COMMIT;

-- ----------------------------
-- Table structure for sys_loginlog
-- ----------------------------
DROP TABLE IF EXISTS `sys_loginlog`;
CREATE TABLE `sys_loginlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '用户id',
  `ip` varchar(45) DEFAULT NULL COMMENT 'ip',
  `country` varchar(50) DEFAULT NULL COMMENT '国家',
  `prov` varchar(50) DEFAULT NULL COMMENT '省',
  `city` varchar(50) DEFAULT NULL COMMENT '市',
  `district` varchar(50) DEFAULT NULL COMMENT '区',
  `isp` varchar(50) DEFAULT NULL COMMENT '网络提供商',
  `lat` varchar(15) DEFAULT NULL COMMENT '纬度',
  `lng` varchar(15) DEFAULT NULL COMMENT '经度',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `uid` (`uid`,`createdAt`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='登录日志';

-- ----------------------------
-- Records of sys_loginlog
-- ----------------------------
BEGIN;
INSERT INTO `sys_loginlog` (`id`, `uid`, `ip`, `country`, `prov`, `city`, `district`, `isp`, `lat`, `lng`, `createdAt`) VALUES (1, 2, '112.80.160.210', '中国', '江苏', '南京', '', 'China Unicom CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2026-03-02 00:07:06');
INSERT INTO `sys_loginlog` (`id`, `uid`, `ip`, `country`, `prov`, `city`, `district`, `isp`, `lat`, `lng`, `createdAt`) VALUES (2, 2, '112.80.160.210', '中国', '江苏', '南京', '', 'China Unicom CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2026-03-08 13:47:09');
INSERT INTO `sys_loginlog` (`id`, `uid`, `ip`, `country`, `prov`, `city`, `district`, `isp`, `lat`, `lng`, `createdAt`) VALUES (3, 2, '101.125.4.179', '中国', '江苏', '南京', '', 'CHINAUNICOM CHINA169 Jiangsu Province Network', '32.0858', '118.886', '2026-03-20 15:10:27');
INSERT INTO `sys_loginlog` (`id`, `uid`, `ip`, `country`, `prov`, `city`, `district`, `isp`, `lat`, `lng`, `createdAt`) VALUES (4, 2, '122.96.46.121', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2026-03-20 16:42:59');
COMMIT;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `pid` int(11) DEFAULT '0' COMMENT '父菜单ID',
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜单名称',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '路由名称',
  `order_num` int(4) DEFAULT '0' COMMENT '显示顺序',
  `path` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '路由地址',
  `component` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '组件路径',
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '菜单图标',
  `query` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '路由参数',
  `perms` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '权限标识',
  `type` char(1) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '菜单类型（M目录 C菜单 F按钮）',
  `is_frame` char(1) COLLATE utf8mb4_unicode_ci DEFAULT '2' COMMENT '是否为外链（1是 2否）',
  `is_cache` char(1) COLLATE utf8mb4_unicode_ci DEFAULT '2' COMMENT '是否缓存（1缓存 2不缓存）',
  `is_show` char(1) COLLATE utf8mb4_unicode_ci DEFAULT '1' COMMENT '是否显示（1显示 2隐藏）',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '菜单状态（1开启 2停用）',
  `create_by` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='菜单权限表';

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (1, 0, '网站信息', 'dashboard', 0, '/dashboard', '@/views/base/dashboard/index.vue', 'DataLine', NULL, '', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (2, 0, '站点管理', '', 0, '/site', '', 'Monitor', NULL, '', 'M', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (3, 2, '站点设置', 'siteinfo', 0, '/siteinfo', '@/views/cms/site/index.vue', '', NULL, 'cms:site:info', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (4, 0, '内容管理', '', 0, '/content', '', 'Grid', NULL, '', 'M', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (5, 4, '栏目管理', 'category-index', 0, '/category', '@/views/cms/category/index.vue', '', NULL, 'cms:category:find', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (6, 5, '栏目新增', 'category-add', 0, '/category/add', '@/views/cms/category/add.vue', '', NULL, 'cms:category:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (7, 5, '栏目修改', 'category-edit', 0, '/category/edit/:id', '@/views/cms/category/edit.vue', '', NULL, 'cms:category:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (8, 5, '栏目删除', '', 0, '', '', '', NULL, 'cms:category:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (9, 5, '栏目查询', '', 0, '', '', '', NULL, 'cms:category:find', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (10, 4, '文章管理', 'article-index', 0, '/article', '@/views/cms/article/index.vue', '', NULL, 'cms:article:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (11, 10, '文章新增', 'article-add', 0, '/article/add', '@/views/cms/article/add.vue', '', NULL, 'cms:article:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (12, 10, '文章修改', 'article-edit', 0, '/article/edit/:id', '@/views/cms/article/edit.vue', '', NULL, 'cms:article:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (13, 10, '文章删除', '', 0, '', NULL, '', NULL, 'cms:article:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (14, 10, '文章详情', '', 0, '', NULL, '', NULL, 'cms:article:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (15, 4, '轮播管理', 'slide-index', 0, '/slide', '@/views/cms/slide/index.vue', '', NULL, 'cms:slide:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (16, 15, '轮播新增', 'slide-add', 0, '/slide/add', '@/views/cms/slide/add.vue', '', NULL, 'cms:slide:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (17, 15, '轮播修改', 'slide-edit', 0, '/slide/edit/:id', '@/views/cms/slide/edit.vue', '', NULL, 'cms:slide:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (18, 15, '轮播删除', '', 0, '', NULL, '', NULL, 'cms:slide:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (19, 15, '轮播详情', '', 0, '', NULL, '', NULL, 'cms:slide:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (20, 4, '标签管理', 'tag-index', 0, '/tag', '@/views/cms/tag/index.vue', '', NULL, 'cms:tag:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (21, 20, '标签新增', 'tag-add', 0, '/tag/add', '@/views/cms/tag/add.vue', '', NULL, 'cms:tag:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (22, 20, '标签修改', 'tag-edit', 0, '/tag/edit/:id', '@/views/cms/tag/edit.vue', '', NULL, 'cms:tag:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (23, 20, '标签删除', '', 0, '', NULL, '', NULL, 'cms:tag:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (24, 20, '标签详情', '', 0, '', NULL, '', NULL, 'cms:tag:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (25, 4, '碎片管理', 'frag-index', 0, '/frag', '@/views/cms/frag/index.vue', '', NULL, 'cms:frag:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (26, 25, '碎片新增', 'frag-add', 0, '/frag/add', '@/views/cms/frag/add.vue', '', NULL, 'cms:frag:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (27, 25, '碎片编辑', 'frag-edit', 0, '/frag/edit/:id', '@/views/cms/frag/edit.vue', '', NULL, 'cms:frag:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (28, 25, '碎片删除', '', 0, '', NULL, '', NULL, 'cms:frag:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (29, 25, '碎片详情', '', 0, '', NULL, '', NULL, 'cms:frag:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (30, 40, '页面采集', 'collect-index', 0, '/collect', '@/views/cms/collect/index.vue', '', NULL, 'cms:collect:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (31, 30, '采集新增', 'collect-add', 0, '/collect/add', '@/views/cms/collect/add.vue', '', NULL, 'cms:collect:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (32, 30, '采集修改', 'collect-edit', 0, '/collect/:id', '@/views/cms/collect/edit.vue', '', NULL, 'cms:collect:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (33, 30, '采集删除', '', 0, '', NULL, '', NULL, 'cms:collect:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (34, 30, '采集查询', '', 0, '', NULL, '', NULL, 'cms:collect:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (35, 40, '接口采集', 'gather-index', 0, '/gather', '@/views/cms/gather/index.vue', '', NULL, 'cms:gather:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (36, 35, '采集新增', 'gather-add', 0, '/gather/add', '@/views/cms/gather/add.vue', '', NULL, 'cms:gather:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (37, 35, '采集修改', 'gather-edit', 0, '/gather/edit/:id', '@/views/cms/gather/edit.vue', '', NULL, 'cms:gather:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (38, 35, '采集删除', '', 0, '', NULL, '', NULL, 'cms:gather:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (39, 35, '采集详情', '', 0, '', NULL, '', NULL, 'cms:gather:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (40, 0, '功能管理', '', 0, '/extend', NULL, 'Operation', NULL, NULL, 'M', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (41, 40, '模型管理', 'model-index', 0, '/model', '@/views/cms/model/index.vue', '', NULL, 'cms:model:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (42, 41, '模型新增', 'model-add', 0, '/model/add', '@/views/cms/model/add.vue', '', NULL, 'cms:model:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (43, 41, '模型修改', 'model-edit', 0, '/model/edit/:id', '@/views/cms/model/edit.vue', '', NULL, 'cms:model:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (44, 41, '模型删除', '', 0, '', NULL, '', NULL, 'cms:model:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (45, 41, '模型详情', '', 0, '', NULL, '', NULL, 'cms:model:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (46, 41, '字段管理', 'field-index', 0, '/model/field', '@/views/cms/field/index.vue', '', NULL, 'cms:field:list', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (47, 46, '字段新增', 'field-add', 0, '/model/field/add', '@/views/cms/field/add.vue', '', NULL, 'cms:field:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (48, 46, '字段修改', 'field-edit', 0, '/model/field/edit', '@/views/cms/field/edit.vue', '', NULL, 'cms:field:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (49, 46, '字段删除', '', 0, '', NULL, '', NULL, 'cms:field:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (50, 46, '字段详情', '', 0, '', NULL, '', NULL, 'cms:field:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (51, 4, '友情链接', 'friendlink-index', 0, '/friendlink', '@/views/cms/friendlink/index.vue', '', NULL, 'cms:friendlink:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (52, 51, '友链新增', 'friendlink-add', 0, '/friendlink/add', '@/views/cms/friendlink/add.vue', '', NULL, 'cms:friendlink:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (53, 51, '友链修改', 'friendlink-edit', 0, '/friendlink/edit/:id', '@/views/cms/friendlink/edit.vue', '', NULL, 'cms:friendlink:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (54, 51, '友链删除', '', 0, '', NULL, '', NULL, 'cms:friendlink:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (55, 51, '友链详情', '', 0, '', NULL, '', NULL, 'cms:friendlink:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (56, 4, '消息管理', 'message-index', 0, '/message', '@/views/cms/message/index.vue', '', NULL, 'cms:message:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (57, 56, '消息新增', 'message-add', 0, '/message/add', '@/views/cms/message/add.vue', '', NULL, 'cms:message:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (58, 56, '消息修改', 'message-edit', 0, '/message/edit/:id', '@/views/cms/message/edit.vue', '', NULL, 'cms:message:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (59, 56, '消息删除', '', 0, '', NULL, '', NULL, 'cms:message:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (60, 56, '消息详情', '', 0, '', NULL, '', NULL, 'cms:message:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (61, 0, '系统管理', '', 0, '/sys', '', 'Setting', NULL, NULL, 'M', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (62, 61, '用户管理', 'user-index', 0, '/user', '@/views/base/user/index.vue', '', NULL, 'base:user:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (63, 62, '用户新增', 'user-add', 0, '/user/add', '@/views/base/user/add.vue', '', NULL, 'base:user:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (64, 62, '用户修改', 'user-edit', 0, '/user/edit/:id', '@/views/base/user/edit.vue', '', NULL, 'base:user:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (65, 62, '用户删除', '', 0, '', NULL, '', NULL, 'base:user:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (66, 62, '用户详情', '', 0, '', NULL, '', NULL, 'base:user:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (67, 61, '角色管理', 'role-index', 0, '/role', '@/views/base/role/index.vue', '', NULL, 'base:role:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (68, 67, '角色新增', 'role-add', 0, '/role/add', '@/views/base/role/add.vue', '', NULL, 'base:role:create', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (69, 67, '角色编辑', 'role-edit', 0, '/role/edit/:id', '@/views/base/role/edit.vue', '', NULL, 'base:role:update', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (70, 67, '角色删除', '', 0, '', NULL, '', NULL, 'base:role:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (71, 67, '角色详情', '', 0, '', NULL, '', NULL, 'base:role:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (72, 61, '菜单管理', 'menu', 0, '/menu', '@/views/base/menu/index.vue', '', NULL, 'base:menu:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (73, 72, '菜单新增', '', 0, '', NULL, '', NULL, 'base:menu:create', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (74, 72, '菜单修改', '', 0, '', NULL, '', NULL, 'base:menu:update', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (75, 72, '菜单删除', '', 0, '', NULL, '', NULL, 'base:menu:delete', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (76, 72, '菜单详情', '', 0, '', NULL, '', NULL, 'base:menu:detail', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (77, 61, '登录日志', 'loginlog', 0, '/loginlog', '@/views/cms/loginlog/index.vue', '', NULL, 'cms:loginLog:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (78, 2, '站点更新', '', 0, '', '', '', NULL, 'cms:site:update', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (79, 61, '配置字典', 'configtype', 0, '/configtype', '@/views/base/config-type/index.vue', '', NULL, 'base:config-type:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (80, 79, '配置列表', 'config', 0, '/configtype/:id', '@/views/base/config/index.vue', '', NULL, 'base:config:list', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (81, 79, '字典新增', '', 0, '', '', '', NULL, 'base:config-type:create', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (82, 79, '字典修改', '', 0, '', '', '', NULL, 'base:config-type:update', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (83, 79, '字典删除', '', 0, '', '', '', NULL, 'base:config-type:delete', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (84, 79, '字典查询', '', 0, '', '', '', NULL, 'base:config-type:detail', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (85, 80, '新增配置', '', 0, '', '', '', NULL, 'base:config:create', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (86, 80, '配置修改', '', 0, '', '', '', NULL, 'base:config:update', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (87, 80, '配置删除', '', 0, '', '', '', NULL, 'base:config:delete', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (88, 80, '配置查询', '', 0, '', '', '', NULL, 'base:config:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (89, 0, '资源管理', 'resource', 0, '/resource', '', 'Postcard', NULL, '', 'M', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (90, 89, '前端模板', 'template', 0, '/template', '@/views/vip/codeEditor/index.vue', '', NULL, 'vip:v1:file:tree', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (91, 90, '模板更新', 'template-edit', 0, '', '', '', NULL, 'vip:v1:file:save', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');

INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (92, 89, '附件管理', '', 0, '/oss', '@/views/vip/oss.vue', '', NULL, 'oss:local:oss', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (93, 72, '全部菜单', '', 0, '', NULL, '', NULL, 'base:menu:allRouter', 'I', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (94, 5, '栏目ID查找', '', 0, '', '', '', NULL, 'cms:category:findId', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (95, 5, '子栏目ID查找', '', 0, '', '', '', NULL, 'cms:category:findSubId', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (96, 5, '栏目搜索', '', 0, '', '', '', NULL, 'cms:category:search', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (97, 10, '文章列表', '', 0, '', '', '', NULL, 'cms:article:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (98, 10, '文章统计', '', 0, '', '', '', NULL, 'cms:article:statistics', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (99, 10, '查找字段', '', 0, '', '', '', NULL, 'cms:article:findField', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (100, 10, '文章搜索', '', 0, '', '', '', NULL, 'cms:article:search', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (101, 93, '七牛上传Token', '', 0, '', '', '', NULL, 'oss:qiniu:getUploadToken', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (102, 93, '七牛上传', '', 0, '', '', '', NULL, 'oss:qiniu:upload', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (103, 41, '模型使用情况', '', 0, '', '', '', NULL, 'cms:model:hasUse', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (104, 46, '字段列表', '', 0, '', '', '', NULL, 'cms:field:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (105, 25, '碎片列表', '', 0, '', '', '', NULL, 'cms:frag:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (106, 25, '碎片搜索', '', 0, '', '', '', NULL, 'cms:frag:search', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (107, 20, '标签列表', '', 0, '', '', '', NULL, 'cms:tag:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (108, 20, '标签检查', '', 0, '', '', '', NULL, 'cms:tag:has', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (109, 20, '标签搜索', '', 0, '', '', '', NULL, 'cms:tag:search', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (110, 51, '友情链接列表', '', 0, '', '', '', NULL, 'cms:friendlink:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (111, 56, '留言列表', '', 0, '', '', '', NULL, 'cms:message:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (112, 56, '留言搜索', '', 0, '', '', '', NULL, 'cms:message:search', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (113, 15, '轮播列表', '', 0, '', '', '', NULL, 'cms:slide:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (114, 15, '轮播搜索', '', 0, '', '', '', NULL, 'cms:slide:search', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (115, 30, '获取页面', '', 0, '', '', '', NULL, 'cms:collect:getPages', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (116, 30, '获取采集文章', '', 0, '', '', '', NULL, 'cms:collect:getArticle', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (117, 30, '采集搜索', '', 0, '', '', '', NULL, 'cms:collect:search', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (118, 35, '获取接口文章', '', 0, '', '', '', NULL, 'cms:gather:getArticle', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (119, 35, '接口采集列表', '', 0, '', '', '', NULL, 'cms:gather:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (120, 35, '接口采集搜索', '', 0, '', '', '', NULL, 'cms:gather:search', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (121, 77, '创建登录日志', '', 0, '', '', '', NULL, 'cms:loginLog:create', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (122, 77, '删除登录日志', '', 0, '', '', '', NULL, 'cms:loginLog:delete', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (123, 77, '登录日志列表', '', 0, '', '', '', NULL, 'cms:loginLog:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (124, 62, '用户角色详情', '', 0, '', '', '', NULL, 'base:userRole:detail', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (125, 67, '角色菜单列表', '', 0, '', '', '', NULL, 'base:roleMenu:list', 'I', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (126, 80, '配置获取列表', '', 0, '', '', '', NULL, 'base:config:getlist', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (127, 80, '配置批量更新', '', 0, '', '', '', NULL, 'base:config:updateMany', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (129, 67, '角色列表', '', 0, '', '', '', NULL, 'base:role:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (130, 92, '上传Logo', '', 0, '', '', '', NULL, 'oss:local:logo', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (131, 92, '上传多图片', '', 0, '', '', '', NULL, 'oss:local:imgs', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (132, 92, '上传文件', '', 0, '', '', '', NULL, 'oss:local:files', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (133, 2, '运行环境', '', 0, '', '', '', NULL, 'cms:site:runEnv', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (134, 2, '系统应用查找', '', 0, '', '', '', NULL, 'cms:sysApp:find', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (135, 2, '系统应用视图', '', 0, '', '', '', NULL, 'cms:sysApp:views', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (136, 2, '系统应用文件夹', '', 0, '', '', '', NULL, 'cms:sysApp:folder', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (137, 2, '系统应用更新', '', 0, '', '', '', NULL, 'cms:sysApp:update', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (138, 72, '菜单列表', '', 0, '', '', '', NULL, 'base:menu:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (139, 79, '配置类型详情', '', 0, '', '', '', NULL, 'base:config-type:detail', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (140, 80, '配置详情', '', 0, '', '', '', NULL, 'base:config:detail', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (141, 90, '模板内容', '', 0, '', '', '', NULL, 'vip:v1:file:content', 'I', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (142, 92, '删除文件', '', 0, '', '', '', NULL, 'oss:local:delete', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (143, 92, '解压文件', '', 0, '', '', '', NULL, 'oss:local:extract', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (144, 92, '复制文件', '', 0, '', '', '', NULL, 'oss:local:copy', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (145, 92, '移动文件', '', 0, '', '', '', NULL, 'oss:local:move', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (146, 92, '重命名', '', 0, '', '', '', NULL, 'oss:local:rename', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (163, 92, '创建文件夹', '', 0, '', '', '', NULL, 'oss:local:createFolder', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (164, 92, '压缩文件', '', 0, '', '', '', NULL, 'oss:local:compress', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (162, 92, '文件列表', '', 0, '', '', '', NULL, 'vip:v1:file:oss', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');

INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (147, 0, '会员管理', '', 0, '/member', '', 'User', NULL, '', 'M', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (148, 152, '会员列表查询', '', 0, '', '', '', NULL, 'member:v1:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (149, 152, '会员搜索', '', 0, '', '', '', NULL, 'member:v1:search', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (150, 152, '会员详情', '', 0, '', '', '', NULL, 'member:v1:adminDetail', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (151, 152, '会员状态更新', '', 0, '', '', '', NULL, 'member:v1:updateStatus', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (152, 147, '会员列表', 'user-list', 0, '/user-list', '@/views/cms/user-list/index.vue', '', NULL, 'member:v1:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (153, 152, '会员信息更新', '', 0, '', '', '', NULL, 'member:v1:adminUpdateUser', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (154, 30, '采集列表', '', 0, '', '', '', NULL, 'cms:collect:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (155, 147, '评论列表', 'comment-page', 6, '/comment', '@/views/vip/comment/index.vue', '', NULL, 'member:v1:comment:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (156, 155, '评论列表查询', '', 0, '', '', '', NULL, 'member:v1:comment:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (157, 155, '评论审核', '', 0, '', '', '', NULL, 'member:v1:comment:audit', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (158, 155, '评论删除', '', 0, '', '', '', NULL, 'member:v1:comment:delete', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (159, 147, '收藏列表', 'favorite-page', 7, '/favorite', '@/views/vip/favorite/index.vue', '', NULL, 'member:v1:favorite:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (160, 159, '收藏列表查询', '', 0, '', '', '', NULL, 'member:v1:favorite:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` (`id`, `pid`, `title`, `name`, `order_num`, `path`, `component`, `icon`, `query`, `perms`, `type`, `is_frame`, `is_cache`, `is_show`, `status`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (161, 159, '收藏删除', '', 0, '', '', '', NULL, 'member:v1:favorite:delete', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
COMMIT;

-- ----------------------------
-- Table structure for sys_notice
-- ----------------------------
DROP TABLE IF EXISTS `sys_notice`;
CREATE TABLE `sys_notice` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` varchar(50) NOT NULL COMMENT '公告标题',
  `type` char(1) NOT NULL COMMENT '公告类型（1通知 2公告）',
  `content` longtext COMMENT '公告内容',
  `status` char(1) DEFAULT NULL COMMENT '公告状态（0关闭  1正常）',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='通知公告表';

-- ----------------------------
-- Records of sys_notice
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色名称',
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色权限字符串(super/admin)',
  `sort` int(4) NOT NULL COMMENT '显示顺序',
  `status` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '角色状态（1正常 2停用）',
  `del_flag` char(1) COLLATE utf8mb4_unicode_ci DEFAULT '1' COMMENT '删除标志（1代表存在 2代表删除）',
  `create_by` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='角色信息表';

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` (`id`, `name`, `key`, `sort`, `status`, `del_flag`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (1, '超级管理员', 'super', 0, '1', '1', '', NULL, '', NULL, NULL);
INSERT INTO `sys_role` (`id`, `name`, `key`, `sort`, `status`, `del_flag`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (2, '普通管理员', 'admin', 0, '1', '1', '', NULL, '', NULL, NULL);
INSERT INTO `sys_role` (`id`, `name`, `key`, `sort`, `status`, `del_flag`, `create_by`, `create_time`, `update_by`, `update_time`, `remark`) VALUES (3, '游客', 'visitor', 0, '1', '1', '', NULL, '', NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `menu_id` int(11) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`,`menu_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='角色和菜单关联表';

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 1);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 2);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 3);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 4);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 5);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 6);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 7);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 8);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 9);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 10);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 11);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 12);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 13);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 14);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 15);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 16);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 17);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 18);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 19);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 20);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 21);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 22);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 23);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 24);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 25);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 26);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 27);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 28);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 29);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 30);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 31);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 32);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 33);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 34);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 35);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 36);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 37);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 38);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 39);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 40);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 41);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 42);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 43);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 44);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 45);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 46);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 47);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 48);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 49);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 50);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 51);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 52);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 53);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 54);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 55);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 56);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 57);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 58);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 59);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 60);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 61);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 62);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 63);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 64);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 65);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 66);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 67);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 68);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 69);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 70);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 71);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 72);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 73);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 74);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 75);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 76);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 77);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 78);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 79);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 80);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 81);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 82);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 83);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 84);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 85);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 86);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 87);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 88);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 89);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 90);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 91);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 92);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 93);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 94);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 95);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 96);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 97);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 98);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 99);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 100);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 101);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 102);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 103);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 104);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 105);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 106);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 107);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 108);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 109);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 110);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 111);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 112);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 113);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 114);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 115);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 116);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 117);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 118);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 119);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 120);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 121);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 122);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 123);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 124);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 125);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 126);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 127);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 129);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 130);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 131);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 132);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 133);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 134);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 135);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 136);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 137);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 138);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 139);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 140);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 141);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 142);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 143);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 144);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 145);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 146);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 162);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 163);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 164);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 147);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 148);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 149);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 150);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 151);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 152);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 153);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 154);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 155);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 156);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 157);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 158);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 159);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 160);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 161);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 1);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 2);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 3);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 4);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 5);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 6);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 7);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 8);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 9);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 10);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 11);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 12);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 13);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 14);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 15);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 16);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 17);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 18);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 19);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 20);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 21);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 22);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 23);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 24);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 25);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 26);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 27);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 28);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 29);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 41);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 42);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 43);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 44);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 45);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 46);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 47);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 48);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 49);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 50);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 51);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 52);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 53);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 54);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 55);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 56);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 57);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 58);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 59);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 60);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 62);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 63);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 64);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 65);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 66);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 77);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 78);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 79);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 80);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 81);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 82);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 83);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 84);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 85);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 86);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 87);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 88);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 95);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 96);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 97);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 98);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 99);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 100);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 101);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 104);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 105);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 106);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 107);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 108);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 109);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 110);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 111);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 112);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 113);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 114);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 115);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 122);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 123);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 124);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 125);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 127);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 128);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 134);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 135);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 136);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 137);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 138);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 140);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 141);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 1);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 3);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 9);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 14);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 19);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 24);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 29);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 34);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 39);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 45);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 50);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 55);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 60);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 66);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 93);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 94);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 95);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 96);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 97);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 98);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 99);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 100);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 102);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 106);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 107);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 108);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 109);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 110);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 111);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 112);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 114);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 115);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 116);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 120);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 121);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 122);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 123);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 125);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 126);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 127);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 128);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 130);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 131);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 132);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 134);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 136);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 140);
COMMIT;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '登录账号',
  `nickname` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '用户昵称',
  `password` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '密码',
  `salt` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '盐加密',
  `avatar` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '头像路径',
  `sex` char(1) COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '用户性别（0男 1女 2未知）',
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '用户邮箱',
  `phonenumber` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '手机号码',
  `login_ip` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '最后登录IP',
  `login_date` datetime DEFAULT NULL COMMENT '最后登录时间',
  `create_by` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `pwd_update_date` datetime DEFAULT NULL COMMENT '密码最后更新时间',
  `status` char(1) COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '帐号状态（0正常 1停用）',
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='用户信息表';

-- ----------------------------
-- Records of sys_user
-- ----------------------------
BEGIN;
INSERT INTO `sys_user` (`id`, `username`, `nickname`, `password`, `salt`, `avatar`, `sex`, `email`, `phonenumber`, `login_ip`, `login_date`, `create_by`, `create_time`, `update_by`, `update_time`, `pwd_update_date`, `status`, `remark`) VALUES (1, 'admin', '', '$2b$12$MNOt0mXmoftvWoilZODR6.Zzu2/4xHBzKDxMy5tToxHCz0mAl3zYa', '', '', '0', '', '', '', NULL, '', NULL, '', NULL, NULL, '1', NULL);
INSERT INTO `sys_user` (`id`, `username`, `nickname`, `password`, `salt`, `avatar`, `sex`, `email`, `phonenumber`, `login_ip`, `login_date`, `create_by`, `create_time`, `update_by`, `update_time`, `pwd_update_date`, `status`, `remark`) VALUES (2, 'chancms', '', '$2b$12$dpe9JuqruCRtDhUvAyISru2uUEQ.8LEvf6HSTayn5Sipim..Pn0QG', '', '', '0', '', '', '', NULL, '', NULL, '', NULL, NULL, '1', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`,`role_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='用户和角色关联表';

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_user_role` (`user_id`, `role_id`) VALUES (1, 2);
INSERT INTO `sys_user_role` (`user_id`, `role_id`) VALUES (2, 1);
COMMIT;

-- ----------------------------
-- Table structure for wechat_scan_login
-- ----------------------------
DROP TABLE IF EXISTS `wechat_scan_login`;
CREATE TABLE `wechat_scan_login` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `scan_id` varchar(64) NOT NULL COMMENT '唯一扫码标识（生成二维码时创建，格式如 scan_xxxx）',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态：0=未扫码，1=已关注待登录，2=已登录，3=已过期',
  `openid` varchar(64) DEFAULT NULL COMMENT '扫码用户的微信openid（用户关注后填充）',
  `unionid` varchar(64) DEFAULT NULL COMMENT '扫码用户的微信unionid（如有则填充，用于多公众号统一用户）',
  `expire_time` datetime NOT NULL COMMENT '二维码过期时间（默认5分钟，与微信临时二维码有效期一致）',
  `client_ip` varchar(45) DEFAULT NULL COMMENT '生成二维码时的客户端IP（可选，用于日志追溯）',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间（自动更新）',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_scan_id` (`scan_id`) USING BTREE COMMENT '唯一索引：确保scan_id不重复',
  KEY `idx_openid` (`openid`) USING BTREE COMMENT '普通索引：优化按openid查询的效率',
  KEY `idx_status_expire` (`status`,`expire_time`) USING BTREE COMMENT '联合索引：优化按状态+过期时间查询的效率'
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='微信公众号扫码登录状态表';

-- ----------------------------
-- Records of wechat_scan_login
-- ----------------------------
BEGIN;
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (1, 'scan_95ff7f98a7aff3aee6072940', 0, NULL, NULL, '2025-11-01 22:33:39', '127.0.0.1', '2025-11-01 22:28:39', '2025-11-01 22:28:39');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (2, 'scan_9b2540c847a78867f2f1d81f', 0, NULL, NULL, '2025-11-01 22:36:49', '127.0.0.1', '2025-11-01 22:31:49', '2025-11-01 22:31:49');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (3, 'scan_d759686fde151a46d29af3fc', 0, NULL, NULL, '2025-11-01 22:37:05', '127.0.0.1', '2025-11-01 22:32:05', '2025-11-01 22:32:05');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (4, 'scan_b9822bab85d115cbf09d348a', 0, NULL, NULL, '2025-11-01 22:38:56', '127.0.0.1', '2025-11-01 22:33:57', '2025-11-01 22:33:57');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (5, 'scan_ac166311eace9db93cc6bce3', 0, NULL, NULL, '2025-11-01 22:39:01', '127.0.0.1', '2025-11-01 22:34:02', '2025-11-01 22:34:02');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (6, 'scan_f4ab3301b6fe2f8b47e669a3', 0, NULL, NULL, '2025-11-01 22:40:08', '127.0.0.1', '2025-11-01 22:35:09', '2025-11-01 22:35:09');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (7, 'scan_c7384d1ff76884fc786f24f8', 0, NULL, NULL, '2025-11-01 22:40:45', '127.0.0.1', '2025-11-01 22:35:45', '2025-11-01 22:35:45');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (8, 'scan_aef3191e028c096bed5d2955', 0, NULL, NULL, '2025-11-01 22:45:16', '127.0.0.1', '2025-11-01 22:40:16', '2025-11-01 22:40:16');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (9, 'scan_c0d1fb183ffad55fea8a2c6f', 0, NULL, NULL, '2025-11-01 22:49:35', '127.0.0.1', '2025-11-01 22:44:35', '2025-11-01 22:44:35');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (10, 'scan_0cbdf2e87af30fa6c96fe473', 3, NULL, NULL, '2025-11-01 22:50:06', '127.0.0.1', '2025-11-01 22:45:06', '2025-11-01 22:50:06');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (11, 'scan_1e3b72a46ec51748af86f43e', 0, NULL, NULL, '2025-11-01 22:58:02', '127.0.0.1', '2025-11-01 22:53:03', '2025-11-01 22:53:03');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (12, 'scan_f2a89d59b6f3cbb0fb58ec40', 0, NULL, NULL, '2025-11-01 22:58:11', '127.0.0.1', '2025-11-01 22:53:11', '2025-11-01 22:53:11');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (13, 'scan_6532b6a98bdd2e22037eb843', 0, NULL, NULL, '2025-11-01 23:00:28', '127.0.0.1', '2025-11-01 22:55:29', '2025-11-01 22:55:29');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (14, 'scan_541c95b3914d474600df660b', 0, NULL, NULL, '2025-11-01 23:00:37', '127.0.0.1', '2025-11-01 22:55:37', '2025-11-01 22:55:37');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (15, 'scan_a8c3d4cc654721e867858d0e', 0, NULL, NULL, '2025-11-01 23:01:15', '127.0.0.1', '2025-11-01 22:56:16', '2025-11-01 22:56:16');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (16, 'scan_b63e26d56cc5dd11f30f75cd', 0, NULL, NULL, '2025-11-01 23:06:32', '127.0.0.1', '2025-11-01 23:01:32', '2025-11-01 23:01:32');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (17, 'scan_6ece1870e762b5e47463b821', 0, NULL, NULL, '2025-11-01 23:06:41', '127.0.0.1', '2025-11-01 23:01:42', '2025-11-01 23:01:42');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (18, 'scan_4b8c3f53d68d823e2eb76253', 0, NULL, NULL, '2025-11-01 23:06:55', '127.0.0.1', '2025-11-01 23:01:56', '2025-11-01 23:01:56');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (19, 'scan_6d4be695f5174204c099b424', 0, NULL, NULL, '2025-11-01 23:11:24', '127.0.0.1', '2025-11-01 23:06:24', '2025-11-01 23:06:24');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (20, 'scan_1a91f678abec179d137515c7', 0, NULL, NULL, '2025-11-01 23:12:05', '127.0.0.1', '2025-11-01 23:07:06', '2025-11-01 23:07:06');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (21, 'scan_d78435326bdef0029dbe1f45', 0, NULL, NULL, '2025-11-04 16:16:56', '101.125.4.179', '2025-11-04 16:11:56', '2025-11-04 16:11:56');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (22, 'scan_fd47b335c4b866d0cf110649', 0, NULL, NULL, '2025-11-04 16:53:02', '101.125.4.179', '2025-11-04 16:48:02', '2025-11-04 16:48:02');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (23, 'scan_938e08054c9d1affa11687ac', 0, NULL, NULL, '2025-11-04 22:22:46', '122.96.14.142', '2025-11-04 22:17:47', '2025-11-04 22:17:47');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (24, 'scan_b73ba71f2136152bd809c855', 0, NULL, NULL, '2025-11-04 22:25:31', '122.96.14.142', '2025-11-04 22:20:31', '2025-11-04 22:20:31');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (25, 'scan_d37780461b73caeb3d8a327f', 0, NULL, NULL, '2025-11-04 22:29:15', '122.96.14.142', '2025-11-04 22:24:15', '2025-11-04 22:24:15');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (26, 'scan_31fe9b64a28fdcddce71d39b', 0, NULL, NULL, '2025-11-04 22:31:56', '122.96.14.142', '2025-11-04 22:26:57', '2025-11-04 22:26:57');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (27, 'scan_e4388511b9dd7cacf2449cea', 3, NULL, NULL, '2025-11-04 22:36:22', '122.96.14.142', '2025-11-04 22:31:23', '2025-11-04 22:44:52');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (28, 'scan_87daa0731f6008ddc7a5bceb', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-04 22:49:56', '122.96.14.142', '2025-11-04 22:44:56', '2025-11-04 22:45:07');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (29, 'scan_1b2c180f52d502d6ea5e0787', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-06 20:16:16', '122.96.47.125', '2025-11-06 20:11:17', '2025-11-06 20:11:31');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (30, 'scan_66d8e16698736c425b5d8879', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-06 20:17:18', '122.96.47.125', '2025-11-06 20:12:18', '2025-11-06 20:12:26');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (31, 'scan_2cbda57152677fdbca19d8c4', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-06 20:19:12', '122.96.47.125', '2025-11-06 20:14:13', '2025-11-06 20:14:29');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (32, 'scan_0a54fa986acf556bdbb2dc5e', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-06 20:21:39', '122.96.47.125', '2025-11-06 20:16:40', '2025-11-06 20:16:48');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (33, 'scan_362b020107f87641e513c110', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-07 10:56:49', '122.96.47.125', '2025-11-07 10:51:49', '2025-11-07 10:52:03');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (34, 'scan_a3c2fbede67c5802bcbe3703', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-07 10:58:23', '122.96.47.125', '2025-11-07 10:53:24', '2025-11-07 10:53:30');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (35, 'scan_476c28ad6b487c97584320c8', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-07 11:00:47', '122.96.47.125', '2025-11-07 10:55:47', '2025-11-07 10:55:55');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (36, 'scan_c7b5dd1bbad3e743211903aa', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-07 11:08:18', '122.96.47.125', '2025-11-07 11:03:19', '2025-11-07 11:03:27');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (37, 'scan_263badedf83adf16e8137057', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-07 11:19:55', '122.96.47.125', '2025-11-07 11:14:55', '2025-11-07 11:15:03');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (38, 'scan_319a733e6233b3bccaadf2de', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-07 11:20:37', '122.96.47.125', '2025-11-07 11:15:37', '2025-11-07 11:15:45');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (39, 'scan_20be72f044314811147cdbf8', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-07 11:28:43', '122.96.47.125', '2025-11-07 11:23:44', '2025-11-07 11:23:50');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (40, 'scan_2f751923d59058c7617de01a', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-07 11:36:12', NULL, '2025-11-07 11:31:13', '2025-11-07 11:31:21');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (41, 'scan_bb3dc88c016a4fd0433fe4d9', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-07 11:37:34', NULL, '2025-11-07 11:32:35', '2025-11-07 11:32:43');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (42, 'scan_53742bab6fceac91af7219b3', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-07 11:43:57', '122.96.47.125', '2025-11-07 11:38:58', '2025-11-07 11:39:06');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (43, 'scan_5df37f7955ddae87a082dfd5', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-07 11:45:14', '122.96.47.125', '2025-11-07 11:40:15', '2025-11-07 11:40:23');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (44, 'scan_ce5cb04959ee4b4fd16935f6', 0, NULL, NULL, '2025-11-07 11:45:42', '122.96.47.125', '2025-11-07 11:40:42', '2025-11-07 11:40:42');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (45, 'scan_3432ddd5b09487d36cd897cc', 0, NULL, NULL, '2025-11-07 11:45:54', '122.96.47.125', '2025-11-07 11:40:54', '2025-11-07 11:40:54');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (46, 'scan_cd11b9683f869023df59a426', 2, 'oPW1t2KC7YTW2ZlfuX2HrJ_qkAYw', NULL, '2025-11-07 11:49:01', '58.16.130.22', '2025-11-07 11:44:01', '2025-11-07 11:44:20');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (47, 'scan_8a1fadc0946f682b05b410d6', 2, 'oPW1t2LK2ubjCwIeDdCMwSUHpbe8', NULL, '2025-11-07 11:49:24', NULL, '2025-11-07 11:44:24', '2025-11-07 11:44:44');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (48, 'scan_f564ab770f25a4ed7a0411f4', 2, 'oPW1t2LpL2h1RRUPLTaVvZk__DF4', NULL, '2025-11-07 11:49:39', '116.21.134.33', '2025-11-07 11:44:39', '2025-11-07 11:45:00');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (49, 'scan_55187b9f94e73261aba90d16', 0, NULL, NULL, '2025-11-07 11:51:31', '58.16.130.22', '2025-11-07 11:46:31', '2025-11-07 11:46:31');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (50, 'scan_75b902a19355389fafe715d7', 0, NULL, NULL, '2025-11-07 11:51:40', '58.16.130.22', '2025-11-07 11:46:40', '2025-11-07 11:46:40');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (51, 'scan_185aafe8fbd78f721e9f564c', 0, NULL, NULL, '2025-11-07 11:58:45', '122.96.47.125', '2025-11-07 11:53:45', '2025-11-07 11:53:45');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (52, 'scan_3e9c7d7ebacba2f2837f3a82', 2, 'oPW1t2EQwBBvf1OTo8UXV6rQePXk', NULL, '2025-11-07 12:00:51', '20.222.140.205', '2025-11-07 11:55:52', '2025-11-07 11:56:32');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (53, 'scan_5ca1b9db9b39f074674c68eb', 2, 'oPW1t2BGDQfPMX3KX8lTBvFh-2a8', NULL, '2025-11-07 13:05:56', '111.204.255.130', '2025-11-07 13:00:56', '2025-11-07 13:01:38');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (54, 'scan_cc9d902602c369fa2940f9d7', 0, NULL, NULL, '2025-11-07 17:32:22', '46.232.56.242', '2025-11-07 17:27:22', '2025-11-07 17:27:22');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (55, 'scan_841f25e53a119a26fcf25046', 0, NULL, NULL, '2025-11-10 09:52:19', '223.160.208.3', '2025-11-10 09:47:20', '2025-11-10 09:47:20');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (56, 'scan_f2f69ba7e9288888ebe455bd', 0, NULL, NULL, '2025-11-10 09:53:35', '223.160.208.3', '2025-11-10 09:48:36', '2025-11-10 09:48:36');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (57, 'scan_fbc8017991adce2cf8e0f2b4', 0, NULL, NULL, '2025-11-10 09:53:40', '223.160.208.3', '2025-11-10 09:48:40', '2025-11-10 09:48:40');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (58, 'scan_7c14194d23cdb193cb5a9487', 0, NULL, NULL, '2025-11-10 09:53:42', '223.160.208.3', '2025-11-10 09:48:43', '2025-11-10 09:48:43');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (59, 'scan_d7dc95b0c2ee8186220e4ba1', 0, NULL, NULL, '2025-11-10 09:53:51', NULL, '2025-11-10 09:48:52', '2025-11-10 09:48:52');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (60, 'scan_3c24746bc405247d87d809dc', 0, NULL, NULL, '2025-11-10 09:53:56', '223.160.208.3', '2025-11-10 09:48:57', '2025-11-10 09:48:57');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (61, 'scan_d849a789e02895d86e335796', 0, NULL, NULL, '2025-11-10 09:54:01', '223.160.208.3', '2025-11-10 09:49:01', '2025-11-10 09:49:01');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (62, 'scan_29301f0e9618485f4e8f9eed', 0, NULL, NULL, '2025-11-10 09:54:04', '223.160.208.3', '2025-11-10 09:49:04', '2025-11-10 09:49:04');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (63, 'scan_079285fa021f3dbf8f484b30', 0, NULL, NULL, '2025-11-10 09:54:08', '223.160.208.3', '2025-11-10 09:49:08', '2025-11-10 09:49:08');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (64, 'scan_cdf1c55e46307ffe6d30bc0a', 0, NULL, NULL, '2025-11-10 09:54:13', '223.160.208.3', '2025-11-10 09:49:13', '2025-11-10 09:49:13');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (65, 'scan_d5b9919e150477df28c9f65f', 0, NULL, NULL, '2025-11-10 09:54:17', '223.160.208.3', '2025-11-10 09:49:18', '2025-11-10 09:49:18');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (66, 'scan_15ff5d1421961af01ae8bfa9', 0, NULL, NULL, '2025-11-10 09:54:20', '223.160.208.3', '2025-11-10 09:49:20', '2025-11-10 09:49:20');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (67, 'scan_7f0694f358ba718ccdb108ff', 0, NULL, NULL, '2025-11-10 09:54:24', '223.160.208.3', '2025-11-10 09:49:25', '2025-11-10 09:49:25');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (68, 'scan_d7afbb5b0bae4b0f81d35dea', 0, NULL, NULL, '2025-11-10 09:54:29', '223.160.208.3', '2025-11-10 09:49:30', '2025-11-10 09:49:30');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (69, 'scan_9e1f02b628389ee1408a1ea9', 0, NULL, NULL, '2025-11-10 09:54:34', '223.160.208.3', '2025-11-10 09:49:34', '2025-11-10 09:49:34');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (70, 'scan_22f85fc7006d7dcf2e50a974', 0, NULL, NULL, '2025-11-10 09:54:36', '223.160.208.3', '2025-11-10 09:49:37', '2025-11-10 09:49:37');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (71, 'scan_fd6d545127b250955fee1818', 0, NULL, NULL, '2025-11-10 09:54:41', '223.160.208.3', '2025-11-10 09:49:41', '2025-11-10 09:49:41');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (72, 'scan_8894c86299b1fede67d18c50', 0, NULL, NULL, '2025-11-10 09:54:44', '223.160.208.3', '2025-11-10 09:49:44', '2025-11-10 09:49:44');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (73, 'scan_20655fad5203bda880a4628c', 0, NULL, NULL, '2025-11-10 09:54:48', '223.160.208.3', '2025-11-10 09:49:49', '2025-11-10 09:49:49');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (74, 'scan_96f0282ef608b8681dec4f2b', 0, NULL, NULL, '2025-11-10 09:55:01', '223.160.208.3', '2025-11-10 09:50:02', '2025-11-10 09:50:02');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (75, 'scan_23ffa91d611e7dc7ba910794', 0, NULL, NULL, '2025-11-10 09:55:06', '223.160.208.3', '2025-11-10 09:50:06', '2025-11-10 09:50:06');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (76, 'scan_3b233907552bbdbd5091a4b3', 0, NULL, NULL, '2025-11-10 09:55:09', '223.160.208.3', '2025-11-10 09:50:09', '2025-11-10 09:50:09');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (77, 'scan_78407bb8ce03b99e096c17d5', 0, NULL, NULL, '2025-11-10 09:55:15', NULL, '2025-11-10 09:50:16', '2025-11-10 09:50:16');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (78, 'scan_855207daa3fe2627a5ec3238', 0, NULL, NULL, '2025-11-10 09:55:18', '223.160.208.3', '2025-11-10 09:50:18', '2025-11-10 09:50:18');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (79, 'scan_a72e6d98977ec80976cf1cb7', 0, NULL, NULL, '2025-11-10 09:55:21', '223.160.208.3', '2025-11-10 09:50:21', '2025-11-10 09:50:21');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (80, 'scan_1a6f76189b38a3ebde6dfc7d', 0, NULL, NULL, '2025-11-10 09:55:23', '223.160.208.3', '2025-11-10 09:50:23', '2025-11-10 09:50:23');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (81, 'scan_2b562edc4bbb0511dfe8428b', 0, NULL, NULL, '2025-11-10 09:55:25', '223.160.208.3', '2025-11-10 09:50:26', '2025-11-10 09:50:26');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (82, 'scan_c69fdff93b971ae5a77cb946', 0, NULL, NULL, '2025-11-10 09:55:28', '223.160.208.3', '2025-11-10 09:50:28', '2025-11-10 09:50:28');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (83, 'scan_80a869a27c328e54ebb88444', 0, NULL, NULL, '2025-11-10 09:55:30', '223.160.208.3', '2025-11-10 09:50:31', '2025-11-10 09:50:31');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (84, 'scan_5684c6e8eaab6961795fa7d0', 0, NULL, NULL, '2025-11-10 09:55:33', '223.160.208.3', '2025-11-10 09:50:33', '2025-11-10 09:50:33');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (85, 'scan_05fd23e55f143fbfd8418679', 0, NULL, NULL, '2025-11-10 09:55:35', '223.160.208.3', '2025-11-10 09:50:36', '2025-11-10 09:50:36');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (86, 'scan_26937a60648cc1ffd134d083', 0, NULL, NULL, '2025-11-10 09:55:38', '223.160.208.3', '2025-11-10 09:50:38', '2025-11-10 09:50:38');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (87, 'scan_db0a725d0cd12643c29bb1f5', 0, NULL, NULL, '2025-11-10 09:55:40', '223.160.208.3', '2025-11-10 09:50:41', '2025-11-10 09:50:41');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (88, 'scan_d1ec7f144a4dac1bb5547865', 0, NULL, NULL, '2025-11-10 09:55:43', '223.160.208.3', '2025-11-10 09:50:43', '2025-11-10 09:50:43');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (89, 'scan_c541a2b09b25130115562661', 0, NULL, NULL, '2025-11-10 09:55:45', '223.160.208.3', '2025-11-10 09:50:46', '2025-11-10 09:50:46');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (90, 'scan_ab256e688de559fd36ca4413', 0, NULL, NULL, '2025-11-10 09:55:48', '223.160.208.3', '2025-11-10 09:50:48', '2025-11-10 09:50:48');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (91, 'scan_bab72b35061a3c210bbd8aae', 0, NULL, NULL, '2025-11-10 09:55:50', '223.160.208.3', '2025-11-10 09:50:51', '2025-11-10 09:50:51');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (92, 'scan_06645b311669b07a543b534d', 0, NULL, NULL, '2025-11-10 09:55:53', '223.160.208.3', '2025-11-10 09:50:53', '2025-11-10 09:50:53');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (128, 'scan_5925fb0267a017918f77fb3f', 0, NULL, NULL, '2025-11-10 09:56:02', '223.160.208.3', '2025-11-10 09:51:02', '2025-11-10 09:51:02');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (93, 'scan_7936a6f77889768c88db7037', 0, NULL, NULL, '2025-11-10 09:56:18', '223.160.208.3', '2025-11-10 09:51:18', '2025-11-10 09:51:18');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (94, 'scan_88847c9dea0c02cd5c8819e0', 0, NULL, NULL, '2025-11-10 09:56:18', '223.160.208.3', '2025-11-10 09:51:18', '2025-11-10 09:51:18');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (95, 'scan_0937120e9dd3e4475bbbbb18', 0, NULL, NULL, '2025-11-10 09:56:19', '223.160.208.3', '2025-11-10 09:51:19', '2025-11-10 09:51:19');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (96, 'scan_741c48b2d411834b5891ed37', 0, NULL, NULL, '2025-11-10 09:56:19', '223.160.208.3', '2025-11-10 09:51:20', '2025-11-10 09:51:20');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (97, 'scan_0007c8f21910369d531a9fb3', 0, NULL, NULL, '2025-11-10 09:56:20', '223.160.208.3', '2025-11-10 09:51:20', '2025-11-10 09:51:20');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (98, 'scan_7e03ecf1a218f6fb7858dd75', 0, NULL, NULL, '2025-11-10 09:56:21', '223.160.208.3', '2025-11-10 09:51:21', '2025-11-10 09:51:21');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (99, 'scan_54d21fb00caebec00fb7c326', 0, NULL, NULL, '2025-11-10 09:56:21', '223.160.208.3', '2025-11-10 09:51:22', '2025-11-10 09:51:22');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (100, 'scan_f01f6cc31a9e70e0bd7597ce', 0, NULL, NULL, '2025-11-10 09:56:23', '223.160.208.3', '2025-11-10 09:51:23', '2025-11-10 09:51:23');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (101, 'scan_2727269fa2ee580923905335', 0, NULL, NULL, '2025-11-10 09:56:23', '223.160.208.3', '2025-11-10 09:51:23', '2025-11-10 09:51:23');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (102, 'scan_c0a874eb3fa18c809f9bac00', 0, NULL, NULL, '2025-11-10 09:56:23', '223.160.208.3', '2025-11-10 09:51:24', '2025-11-10 09:51:24');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (103, 'scan_ef9b1647054993b0e01b6142', 0, NULL, NULL, '2025-11-10 09:56:24', '223.160.208.3', '2025-11-10 09:51:25', '2025-11-10 09:51:25');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (104, 'scan_c42ab7d8909c7ca06cd70f00', 0, NULL, NULL, '2025-11-10 09:56:25', '223.160.208.3', '2025-11-10 09:51:25', '2025-11-10 09:51:25');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (105, 'scan_eac469ed70f503f1b0749e20', 0, NULL, NULL, '2025-11-10 09:56:26', '223.160.208.3', '2025-11-10 09:51:27', '2025-11-10 09:51:27');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (106, 'scan_4048cfb472912b03b052c4d5', 0, NULL, NULL, '2025-11-10 09:56:26', '223.160.208.3', '2025-11-10 09:51:26', '2025-11-10 09:51:26');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (107, 'scan_bc54724976b9efacf3d19674', 0, NULL, NULL, '2025-11-10 09:56:28', '223.160.208.3', '2025-11-10 09:51:29', '2025-11-10 09:51:29');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (108, 'scan_f1f9aef7efdd28bae1ed5947', 0, NULL, NULL, '2025-11-10 09:56:29', '223.160.208.3', '2025-11-10 09:51:29', '2025-11-10 09:51:29');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (109, 'scan_1420829c05f35f85f02597ae', 0, NULL, NULL, '2025-11-10 09:56:28', '223.160.208.3', '2025-11-10 09:51:28', '2025-11-10 09:51:28');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (110, 'scan_cf344d12e5922ae3c801e0d2', 0, NULL, NULL, '2025-11-10 09:56:30', '223.160.208.3', '2025-11-10 09:51:31', '2025-11-10 09:51:31');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (113, 'scan_c4f0de733a92f667fb79aeab', 0, NULL, NULL, '2025-11-10 09:56:30', '223.160.208.3', '2025-11-10 09:51:30', '2025-11-10 09:51:30');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (115, 'scan_4419177f09a9195463b4f0c1', 0, NULL, NULL, '2025-11-10 09:56:31', '223.160.208.3', '2025-11-10 09:51:31', '2025-11-10 09:51:31');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (116, 'scan_fa4f66644c478f37f81c78f4', 0, NULL, NULL, '2025-11-10 09:56:35', '223.160.208.3', '2025-11-10 09:51:35', '2025-11-10 09:51:35');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (117, 'scan_22e42d6fddda4df616f0e926', 0, NULL, NULL, '2025-11-10 09:56:36', '223.160.208.3', '2025-11-10 09:51:36', '2025-11-10 09:51:36');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (123, 'scan_c055ec8ffb40374978fc6612', 0, NULL, NULL, '2025-11-10 09:56:35', '223.160.208.3', '2025-11-10 09:51:36', '2025-11-10 09:51:36');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (124, 'scan_dfdf6d227ebef8b0b77f69bc', 0, NULL, NULL, '2025-11-10 09:56:40', '223.160.208.3', '2025-11-10 09:51:41', '2025-11-10 09:51:41');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (125, 'scan_dfc723e181f9a444654b2fc3', 0, NULL, NULL, '2025-11-10 09:56:41', '223.160.208.3', '2025-11-10 09:51:41', '2025-11-10 09:51:41');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (126, 'scan_9cd6f389af61babb6f241952', 0, NULL, NULL, '2025-11-10 09:56:41', '223.160.208.3', '2025-11-10 09:51:42', '2025-11-10 09:51:42');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (129, 'scan_c4169f21f92932f8e03232e8', 0, NULL, NULL, '2025-11-10 09:56:42', '223.160.208.3', '2025-11-10 09:51:42', '2025-11-10 09:51:42');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (154, 'scan_d83cfeaf3652fb85272ad55a', 0, NULL, NULL, '2025-11-10 09:56:43', '223.160.208.3', '2025-11-10 09:51:43', '2025-11-10 09:51:43');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (130, 'scan_e535dba26759a804a982ceb0', 0, NULL, NULL, '2025-11-10 09:56:43', '223.160.208.3', '2025-11-10 09:51:44', '2025-11-10 09:51:44');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (131, 'scan_f278a7eb1984212eba6c728d', 0, NULL, NULL, '2025-11-10 09:56:45', '223.160.208.3', '2025-11-10 09:51:45', '2025-11-10 09:51:45');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (133, 'scan_3aa2a8a428f2e7e47a2f6bbe', 0, NULL, NULL, '2025-11-10 09:56:46', '223.160.208.3', '2025-11-10 09:51:47', '2025-11-10 09:51:47');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (135, 'scan_612b6b3ecd5258be5cf50ee1', 0, NULL, NULL, '2025-11-10 09:56:46', '223.160.208.3', '2025-11-10 09:51:46', '2025-11-10 09:51:46');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (136, 'scan_859daeba300cb4533c75f0d3', 0, NULL, NULL, '2025-11-10 09:56:48', '223.160.208.3', '2025-11-10 09:51:48', '2025-11-10 09:51:48');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (137, 'scan_88d21198de7d9e06497168bd', 0, NULL, NULL, '2025-11-10 09:56:48', '223.160.208.3', '2025-11-10 09:51:49', '2025-11-10 09:51:49');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (138, 'scan_0dc99e9282b4283016ab15f4', 0, NULL, NULL, '2025-11-10 09:56:49', '223.160.208.3', '2025-11-10 09:51:49', '2025-11-10 09:51:49');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (139, 'scan_e64323e6f24c5bdc915d9a19', 0, NULL, NULL, '2025-11-10 09:56:50', '223.160.208.3', '2025-11-10 09:51:50', '2025-11-10 09:51:50');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (140, 'scan_50387c1395b96ca17441dcbb', 0, NULL, NULL, '2025-11-10 09:56:50', '223.160.208.3', '2025-11-10 09:51:50', '2025-11-10 09:51:50');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (141, 'scan_3ceb2b7976180390a885a673', 0, NULL, NULL, '2025-11-10 09:56:50', '223.160.208.3', '2025-11-10 09:51:51', '2025-11-10 09:51:51');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (142, 'scan_efe3702aed1c764f4dea57d4', 0, NULL, NULL, '2025-11-10 09:56:51', '223.160.208.3', '2025-11-10 09:51:52', '2025-11-10 09:51:52');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (143, 'scan_027d4217ecf2d670cfc2a1e7', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-15 21:21:50', '122.96.14.142', '2025-11-15 21:16:51', '2025-11-15 21:17:05');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (144, 'scan_7c65aab318184d5b4aa12d7f', 0, NULL, NULL, '2025-11-22 12:15:27', '182.149.186.68', '2025-11-22 12:10:28', '2025-11-22 12:10:28');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (145, 'scan_267ae0b354d9cca1aecdd811', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 21:56:21', '122.96.14.142', '2025-11-23 21:51:22', '2025-11-23 21:51:30');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (146, 'scan_a452d8f9414909f0f6a17071', 0, NULL, NULL, '2025-11-23 21:57:19', NULL, '2025-11-23 21:52:20', '2025-11-23 21:52:20');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (147, 'scan_98378e0ee0a59e0f3ed5056f', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 21:57:33', '122.96.14.142', '2025-11-23 21:52:34', '2025-11-23 21:52:40');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (148, 'scan_5a737ca2eefccee3026f6eb3', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 22:09:17', '122.96.14.142', '2025-11-23 22:04:17', '2025-11-23 22:04:26');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (149, 'scan_e40f0a14627bdade6db97700', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 22:11:49', '122.96.14.142', '2025-11-23 22:06:49', '2025-11-23 22:06:55');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (150, 'scan_22e3add18f203f96de3352b8', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 22:13:22', '122.96.14.142', '2025-11-23 22:08:23', '2025-11-23 22:08:29');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (151, 'scan_7f28a5331a947e02430d3594', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 22:14:38', '122.96.14.142', '2025-11-23 22:09:38', '2025-11-23 22:09:46');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (152, 'scan_3eb1a56714f00d36ad820736', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 22:15:26', '122.96.14.142', '2025-11-23 22:10:27', '2025-11-23 22:10:35');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (153, 'scan_791aa6a7639aa7f6e6463d0c', 1, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 22:23:11', '122.96.14.142', '2025-11-23 22:18:12', '2025-11-23 22:18:17');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (163, 'scan_81702b47bd97c5aa99dd602c', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 22:26:39', '122.96.14.142', '2025-11-23 22:21:40', '2025-11-23 22:21:50');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (164, 'scan_feceb126eaa54555e73b58b3', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 22:30:58', '122.96.14.142', '2025-11-23 22:25:59', '2025-11-23 22:26:05');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (165, 'scan_ee86cb05f69bcf84e045f5f3', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 22:33:41', '122.96.14.142', '2025-11-23 22:28:41', '2025-11-23 22:28:49');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (166, 'scan_dc2136dfa725676dcb154dd2', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 22:39:22', '122.96.14.142', '2025-11-23 22:34:23', '2025-11-23 22:34:29');
INSERT INTO `wechat_scan_login` (`id`, `scan_id`, `status`, `openid`, `unionid`, `expire_time`, `client_ip`, `created_at`, `updated_at`) VALUES (167, 'scan_71e8073fb1afa44b238b6429', 2, 'oPW1t2AjdvEd307OFhF7A3yhWv4k', NULL, '2025-11-23 22:41:10', '122.96.14.142', '2025-11-23 22:36:11', '2025-11-23 22:36:17');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
