# ChanCMS内容管理系统

ChanCMS是一款基于Node、Express5、MySQL、Vue3研发的高质量实用型CMS系统。轻量、灵活、稳定、高性能、易扩展，让开发更简单。

> 🌟 开发友好，推崇JS优先。适合全栈开发者，独立而高效、优雅的代码、极致的性能、稳定的生产实践，灵活强大。

## 🌈系统特色

* **自研框架**。基于自研 ChanJS 轻量级 MVC 框架实现，轻量、灵活、稳定、高性能、可持续，遵循约定优于配置理念
* **SEO 优化**。专注于 SEO 优化，支持伪静态 HTML 和拼音导航，灵活设置关键词和描述，提升搜索引擎友好度
* **安全可靠**。基于 Knex.js SQL 查询构建器，高防 SQL 注入，接口权限校验，XSS 防护，密码加密，为系统安全提供全方位保障
* **灵活配置**。JSON 配置按需生成页面模板数据，碎片功能支持零碎文案配置，方便各类灵活文案管理和动态内容管理
* **高扩展性**。支持扩展模型、字段配置，可动态生成数据表，超强扩展能力，满足各种定制化需求
* **模块化设计**。一切模块相互独立，互不干扰，按需加载，易于维护和升级
* **插件化架构**。灵活开发插件系统，支持完整功能模块扩展，实现功能的热插拔
* **无头 CMS**。为多端（微信、App、小程序、H5）提供标准化 API 接口支持，实现一次开发多端复用
* **多编辑器支持**。内置富文本和 Markdown 双编辑器，满足不同内容创作需求
* **多语言支持**。内置多语言系统，支持国际化，轻松搭建多语言网站
* **会员系统**。完整的会员管理体系，支持会员注册登录、社交登录、会员中心、会员管理等功能
* **采集功能**。强大的内容采集功能，支持自定义采集规则，快速聚合内容

## 🚧功能介绍

### 系统管理 (Base)
* 用户管理 - 系统用户、权限分配
* 角色管理 - 角色配置、菜单权限
* 菜单管理 - 系统菜单、功能导航
* 系统配置 - 参数配置、上传设置
* 系统公告 - 公告发布、通知管理
* 登录日志 - 登录记录、安全审计

### 内容管理 (CMS)
* 站点管理 - 网站信息、SEO配置、模板切换
* 栏目管理 - 栏目分类、导航管理、拼音路径
* 文章模块 - 文章发布、编辑（富文本&Markdown）、属性设置
* 标签管理 - 标签分类、标签统计
* 轮播图管理 - 首页轮播图配置
* 碎片管理 - 广告、文案、公司信息等万能模块
* 友情链接 - 外部链接管理
* 在线留言 - 访客留言管理

### 扩展功能 (Plus)
* 扩展模型 - 自定义模型、动态表单
* 扩展字段 - 字段配置、类型设置
* 文章采集 - 规则配置、内容采集
* 模板编辑 - 在线修改模板
* OSS管理 - 上传静态资源管理，如图片、视频、压缩包、文本等

### 支持功能

* 多语言 - 多语言切换、国际化支持
* 文件上传 - 本地上传、七牛云存储
* 日志功能 - 系统日志、操作记录
* PDF预览 - 在线PDF查看（按需加载）

### 会员系统 (Member)

* 会员注册登录 - 邮箱注册，账号密码登录
* 社交登录 - 微信登录、扫码登录、分享功能
* 会员中心 - 会员登录、会员邮箱注册、个人信息管理
* 会员管理 - 会员信息、密码修改
* 收藏功能 - 用户收藏管理
* 评论功能 - 文章评论管理
* 浏览历史 - 用户浏览历史记录


## ⛱️软件环境

* nodejs v22.18.0
* pm2 v6.0.8

## 🛠 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Node.js** | v22.18.0+ | JavaScript 运行时环境 |
| **ChanJS** | ^2.6.1 | 基于 Express 的轻量级 MVC 框架 |
| **Express** | 内置 | Web 应用框架 |
| **Zod** | ^4.1.11 | Schema 校验库，保障数据安全 |
| **Knex.js** | 内置 | SQL 查询构建器（ChanJS 内置） |
| **MySQL** | v5.7.26+ | 关系型数据库 |
| **PM2** | v6.0.8 | 生产环境进程管理与守护 |
| **JWT** | ^9.0.2 | JSON Web Token 身份认证 |
| **Marked** | ^17.0.3 | Markdown 解析器 |
| **DayJS** | ^1.11.13 | 轻量级日期时间处理库 |
| **Axios** | ^1.11.0 | HTTP 客户端 |
| **Multer** | ^2.0.2 | 文件上传中间件 |
| **Qiniu** | ^7.14.0 | 七牛云存储 SDK |
| **Cheerio** | ^1.1.2 | 服务器端 jQuery 实现，用于内容采集 |
| **Bcryptjs** | ^3.0.2 | 密码加密库 |
| **XSS** | ^1.0.15 | XSS 攻击防护 |
| **Crypto-JS** | ^4.2.0 | 加密解密库 |
| **Nodemailer** | ^7.0.6 | 邮件发送库 |
| **Node-Schedule** | ^2.1.1 | 定时任务调度 |
| **Adm-Zip** | ^0.5.16 | ZIP 文件处理 |
| **Mitt** | ^3.0.1 | 轻量级事件总线 |
| **XML2JS** | ^0.6.2 | XML 解析器 |

### ✨项目架构 遵循约定优于配置 JS优先

函数式架构，模块化设计，易于扩展和重构。

```javascript

|- app
    |- helper      //工具函数
    |- common      //业务逻辑(分页, 文件上传等)
    |- extend      //第三方包扩展（可选）
    |- middleware  //全局中间件
    |- modules     //多模块mvc
        |- api 
            |- controller 
            |- service 
            |- guard  //权限控制 (可选) 
            |- middleware  //模块中间件 (可选)
            |- model  //数据库模型 (可选)
            |- router.js 
        |- base 
            |- controller 
            |- service 
            |- router.js
        |- cms 
            |- controller 
            |- service 
            |- router.js
        |- web 
            |- controller 
            |- service 
            |- router.js
    |- plugin //插件（可选）
        |- plus-module1 
            |- controller 
            |- service 
            |- router.js 
        |- module2 
            |- controller 
            |- service 
            |- router.js
|- view
    |- default       //默认模板
    |- test          //测试模板
|- config 
|- public
|- index.js
|-.env.dev
|-.env.prd
```

* **注:ChanCMS自带基于vue3+element-plus+js研发的后台管理界面,如果不满足你编码风格，如native等其它UI，或热衷于如react + antd +TS技术，可以自行调用接口进行二次开发**
* **后台管理ChanAdmin源码以及接口参考 [https://gitee.com/yanyutao0402/ChanAdmin](https://gitee.com/yanyutao0402/ChanAdmin)**

### 案例🍅️

* [南充市顺庆区妇幼保健院](https://www.sqqfy.cn/）
* [国际科技创新中心](https://cms.gongxudj.com/）
* [福建华膜](https://www.huamocj.com/）
* [广东数智云科](http://ifckj.com/)
* [前行者 EWEADN](https://www.eweadn.cn)
* [北京辉达科技](http://www.huidaep.com/ )
* [北京诺丰科技](http://www.novontrade.com/ )
* [北京智慧城市供需对接平台](https://gongxudj.com/#/headerNav/newHome)
* [上海昂翊信息](http://www.angyi-iot.com/)
* [广东天波股份](https://sec.telpo.cn/)
* [广东HANSA中国](http://www.hansa-asia.com/)
* [萌狮换电](http://www.51mshd.com/)
* [南京玄武中等专业学校](http://xxtyxy.aiwx.org.cn/)
* [武汉微科智汇](http://www.whwkzh.cn/)
* [浙江金卡实业](http://zjjksy.com/)
* [浙江华宇科技](http://www.kinka.net.cn/)
* [西安圣豆电子](https://www.sundaytek.com/)
* [石家庄诺德房产](https://www.nuodefangchan.com/)
* [山西蝌蚪云](https://kd-yun.top/)
* [海南省海洋经济发展与资源保护研究院](https://hnimer.org.cn/)
* [粤港澳大湾区教育创新协会](https://hk.bossyun.com/)
* [香港日报](http://www.hongkongdaily.net/)
* [国际健康健美长寿论坛](http://www.internationjms.cn/)
* [世界大健康运动联盟](http://www.worldhealthgames.com/)
* [世界气功网](http://www.shijieqigong.com/)
* [香港大湾区](https://hk.bossyun.com/)
* [七弈国象](https://doc.7yi.link/)
* [有道IT官网](http://www.wmjtyd.net/)

<!-- * [历史人物网](https://ancestries.cn/) -->
<!-- * [同宇宙官网](http://www.zdmedia.com.cn:81/) -->
<!-- * 十 [超前端](https://zoye.top/) -->
<!-- * 演示站1 [雅俗共赏](http://www.cqsmservices.cn/) -->

## 👵开发文档

* **官网:<https://www.chancms.top>**
* **官网文档 ：<https://www.chancms.top/docs/index.html>**
* **官网演示站：<https://vip.chancms.top>**
* **视频教程：<https://space.bilibili.com/1885628820>**

## ❤️项目关注

* **码云：<https://gitee.com/chancms/ChanCMS>** 实时更新
* **github:<https://github.com/chancms/ChanCMS>** 备份更新

## 👴项目交流

 如果喜欢我们的项目，请点个 Star。
 微信群交流请联系微信: `yanyutao2014` 🧒 👧 👱 🧔 👴,纯技术交流，广告党勿扰，谢谢合作！！！

## 许可证

本项目采用 [Apache License 2.0](LICENSE) 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 警告

* 禁止用于任何非法商业用途或其他任何违法或不道德的行为。
* 不当使用本项目中的代码或资源而导致的任何直接或间接损失，项目维护者及贡献者概不负责。
* 请尊重法律和道德规范，合理合法地使用本项目的资源。
* 任何违反上述规定的行为都将受到法律追究。

## 管理后台部分截图

![login.png](https://pic1.imgdb.cn/item/69a94658a1838fcbddfc776d.png)
![dashboard.png](https://pic1.imgdb.cn/item/69a94657a1838fcbddfc776b.png)
![siteinfo.png](https://pic1.imgdb.cn/item/69a946c8a1838fcbddfc7798.png)
![category.png](https://pic1.imgdb.cn/item/69a94656a1838fcbddfc7768.png)
![article.png](https://pic1.imgdb.cn/item/69a94657a1838fcbddfc776a.png)
![menu.png](https://pic1.imgdb.cn/item/69a94657a1838fcbddfc7769.png)
![oss.png](https://pic1.imgdb.cn/item/69a94655a1838fcbddfc7767.png)
![template.png](https://pic1.imgdb.cn/item/69a946c8a1838fcbddfc779a.png)
![use.png](https://pic1.imgdb.cn/item/69a946c8a1838fcbddfc7799.png)