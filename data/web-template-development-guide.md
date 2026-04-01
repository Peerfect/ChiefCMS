# ChanCMS Web 模块 View 模板开发文档

## 一、概述

ChanCMS 的 web 模块采用模板引擎渲染页面，支持多模板切换，通过后台配置即可轻松切换不同的模板风格。本文档详细介绍从后台数据库配置到模板渲染的完整流程。

## 二、数据配置系统

### 2.1 配置表结构 (sys_config)

系统配置表 `sys_config` 用于存储各种配置数据，其中 `cms_data` 类型用于配置模板页面数据：

```sql
CREATE TABLE `sys_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_code` varchar(50) NOT NULL COMMENT '配置类型编码',
  `config_key` varchar(100) NOT NULL COMMENT '配置键',
  `config_value` text COMMENT '配置值',
  `status` tinyint(2) DEFAULT '1' COMMENT '状态',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `sys_config_ibfk_1` (`type_code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';
```

**关键字段说明：**
- `type_code`：配置类型编码，`cms_data` 表示模板数据配置
- `config_key`：配置键，对应不同的页面（init、home、list、article、page、search、tags）
- `config_value`：配置值，JSON 格式，包含数据获取的方法和参数

### 2.2 cms_data 配置项说明

| config_key | 说明 | 对应页面 |
|------------|------|----------|
| `init` | 模板全局数据 | 所有页面共享 |
| `home` | 模板首页数据 | 首页 |
| `list` | 模板列表数据 | 列表页 |
| `article` | 模板详情数据 | 文章详情页 |
| `page` | 模板单页数据 | 单页 |
| `search` | 模板搜索列表数据 | 搜索页 |
| `tags` | 模板tag列表数据 | 标签页 |

### 2.3 配置项结构

每个配置项的 `config_value` 都是 JSON 格式，包含以下结构：

```json
{
  "数据键名": {
    "method": "函数名",
    "params": {
      "参数名": "参数值"
    },
    "field": ["字段1", "字段2"],
    "show": true
  }
}
```

**配置项说明：**
- `method`：调用的函数名，对应 `common.js` 中的方法
- `params`：传递给函数的参数
- `field`：需要返回的字段数组（可选）
- `show`：是否显示该数据块（可选）

## 三、数据流程详解

### 3.1 完整流程图

```
用户访问页面
    ↓
路由解析 (Router)
    ↓
中间件处理 (Middleware)
    ├─ 获取站点配置 (cms_site)
    ├─ 获取栏目信息 (cms_category)
    ├─ 设置模板名称 (template)
    └─ 设置模板路径 (view/template)
    ↓
加载配置数据 (Load Config)
    ├─ 从 sys_config 表读取 cms_data 配置
    ├─ 根据页面类型读取对应配置
    └─ 解析 JSON 配置
    ↓
控制器处理 (Controller)
    ├─ 获取请求参数
    ├─ 调用 home.service 获取数据
    ├─ home.service 调用 getApiCalls 解析配置
    ├─ getApiCalls 根据配置调用 common.js 中的函数
    └─ 函数执行 SQL 查询获取数据
    ↓
数据准备 (Data Prepare)
    ├─ 合并查询结果
    ├─ 处理分页
    ├─ 处理面包屑
    └─ 准备模板变量
    ↓
模板渲染 (Template Engine)
    ├─ 加载模板文件 (view/template/page.html)
    ├─ 解析模板标签
    ├─ 绑定数据变量
    └─ 生成 HTML
    ↓
返回响应 (Response)
    └─ 发送 HTML 给浏览器
```

### 3.2 数据获取流程

#### 步骤 1：读取配置

从 `sys_config` 表中读取 `cms_data` 类型的配置：

```javascript
const config = Chan.config.data[pageType];
```

#### 步骤 2：解析配置

使用 `getApiCalls` 函数解析 JSON 配置：

```javascript
const apiCalls = getApiCalls(config, options, common);
```

**getApiCalls 函数作用：**
- 遍历配置中的每个数据键
- 解析 `method`、`params`、`field` 等配置
- 根据配置调用 `common.js` 中对应的函数
- 处理字段过滤
- 返回所有数据调用的 Promise 对象

#### 步骤 3：并行执行

使用 `Promise.all` 并行执行所有数据调用：

```javascript
let results = await Promise.all(Object.values(apiCalls));
```

#### 步骤 4：合并结果

将查询结果合并为一个对象：

```javascript
let resultObject = {};
let keys = Object.keys(apiCalls);
results.forEach((result, index) => {
  resultObject[keys[index]] = result;
});
```

## 四、配置详解

### 4.1 全局配置 (init)

**配置键：** `init`

**说明：** 所有页面共享的全局数据

**示例配置：**
```json
{
  "site": {
    "method": "site"
  },
  "category": {
    "method": "category"
  },
  "friendlink": {
    "method": "friendLink",
    "params": {
      "pageSize": 10
    }
  },
  "frag": {
    "method": "frag",
    "params": {
      "pageSize": 50
    }
  },
  "tag": {
    "method": "tag",
    "params": {
      "pageSize": 10
    }
  }
}
```

**函数说明：**
- `site()`：获取站点配置信息（cms_site）
  - SQL：`SELECT name, domain, email, wx, icp, code, title, keywords, description, json FROM cms_site`
  - 返回：站点信息对象

- `category()`：获取所有栏目信息（cms_category）
  - SQL：`SELECT * FROM cms_category ORDER BY orderBy ASC`
  - 返回：栏目数组

- `friendLink()`：获取友情链接（cms_friendlink）
  - SQL：`SELECT title, link FROM cms_friendlink ORDER BY orderBy DESC, id DESC LIMIT 10`
  - 返回：友情链接数组

- `frag()`：获取碎片内容（cms_frag）
  - SQL：`SELECT name, mark, content FROM cms_frag ORDER BY id DESC LIMIT 50`
  - 返回：碎片对象（以 mark 为键）

- `tag()`：获取标签列表（cms_tag）
  - SQL：`SELECT id, name, path, count FROM cms_tag ORDER BY count DESC LIMIT 10`
  - 返回：标签数组

### 4.2 首页配置 (home)

**配置键：** `home`

**说明：** 首页的所有数据块配置

**示例配置：**
```json
{
  "banner": {
    "method": "bannerSlide",
    "show": true
  },
  "slide": {
    "method": "getArticleList",
    "params": {
      "start": 0,
      "len": 1,
      "attr": ["3"]
    },
    "field": ["id", "title", "path", "link", "img"],
    "show": true
  },
  "top": {
    "method": "getArticleList",
    "params": {
      "start": 0,
      "len": 1,
      "attr": ["1"],
      "type": 1
    },
    "field": ["id", "title", "path", "description", "img"],
    "show": true
  },
  "news": {
    "method": "getArticleList",
    "params": {
      "start": 0,
      "len": 3,
      "excludeAttr": ["1"]
    },
    "field": ["id", "title", "path", "createdAt"],
    "show": true
  },
  "article": {
    "method": "getArticleListByCids",
    "params": {
      "cid": [],
      "len": 5,
      "toplen": 1,
      "attr": ["1", "2"]
    },
    "show": true
  },
  "imgs": {
    "method": "getNewImgList",
    "params": {
      "len": 8
    },
    "field": ["id", "title", "path", "img"],
    "show": true
  },
  "recommend": {
    "method": "getArticleList",
    "params": {
      "start": 0,
      "len": 10,
      "attr": ["2"]
    },
    "show": true
  },
  "hot": {
    "method": "getArticlePvList",
    "show": true
  },
  "recommendImgs": {
    "method": "getNewImgList",
    "params": {
      "len": 10,
      "id": "",
      "attr": ["2"]
    },
    "field": ["id", "title", "path", "img", "description"],
    "show": true
  },
  "friendlink": {
    "method": "friendLink",
    "params": {
      "pageSize": 10
    },
    "show": true
  }
}
```

**函数说明：**
- `bannerSlide()`：获取轮播图（cms_slide）
  - SQL：`SELECT id, title, imgUrl, linkUrl, content FROM cms_slide LIMIT 10`
  - 返回：轮播图数组

- `getArticleList()`：获取文章列表（cms_article + cms_category）
  - SQL：`SELECT a.id, a.title, a.img, a.createdAt, a.description, c.pinyin, c.name, c.path FROM cms_article AS a LEFT JOIN cms_category AS c ON a.cid = c.id WHERE a.status = 0 ORDER BY a.createdAt DESC LIMIT len OFFSET start`
  - 参数：
    - `start`：起始位置
    - `len`：获取数量
    - `attr`：文章属性（1头条 2推荐 3轮播 4热门）
    - `excludeAttr`：排除属性
    - `type`：文章类型
  - 返回：文章数组或单篇文章

- `getArticleListByCids()`：按栏目获取文章列表
  - SQL：`SELECT a.id, a.title, a.img, a.createdAt, a.description, c.pinyin, c.name, c.path FROM cms_article AS a LEFT JOIN cms_category AS c ON a.cid = c.id WHERE a.cid IN (ids) AND a.status = 0 ORDER BY a.createdAt DESC`
  - 参数：
    - `cid`：栏目ID数组
    - `len`：获取数量
    - `toplen`：头条文章数量
    - `attr`：文章属性
  - 返回：按栏目分组的文章对象

- `getNewImgList()`：获取最新图文文章
  - SQL：`SELECT a.id, a.title, a.img, a.createdAt, a.description, c.pinyin, c.name, c.path FROM cms_article AS a LEFT JOIN cms_category AS c ON a.cid = c.id WHERE a.img != '' AND a.status = 0 ORDER BY a.createdAt DESC LIMIT len`
  - 参数：
    - `pageSize`：获取数量
    - `cid`：栏目ID
    - `attr`：文章属性
  - 返回：文章数组

- `getArticlePvList()`：获取热门文章（按浏览量排序）
  - SQL：`SELECT a.id, a.title, a.img, a.createdAt, a.description, a.pv, c.pinyin, c.name, c.path FROM cms_article AS a LEFT JOIN cms_category AS c ON a.cid = c.id WHERE a.status = 0 ORDER BY a.pv DESC LIMIT len`
  - 参数：
    - `len`：获取数量
    - `cid`：栏目ID（可选）
  - 返回：文章数组

### 4.3 列表页配置 (list)

**配置键：** `list`

**说明：** 列表页的数据配置

**示例配置：**
```json
{
  "articleList": {
    "method": "list",
    "params": {
      "pageSize": 10
    }
  },
  "recommend": {
    "method": "getArticleListByCid",
    "params": {
      "len": 5,
      "attr": ["2"]
    },
    "show": true
  },
  "hot": {
    "method": "getArticlePvList",
    "params": {
      "len": 10
    },
    "field": ["id", "title", "path"],
    "show": true
  },
  "imgs": {
    "method": "getNewImgList",
    "params": {
      "len": 5
    },
    "show": true
  }
}
```

**函数说明：**
- `list()`：获取栏目文章列表（带分页）
  - SQL：`SELECT a.id, a.title, a.img, a.description, a.createdAt, a.author, a.pv, c.pinyin, c.name, c.path FROM cms_article AS a LEFT JOIN cms_category AS c ON a.cid = c.id WHERE a.cid IN (ids) AND a.status = 0 ORDER BY a.createdAt DESC LIMIT pageSize OFFSET (page-1)*pageSize`
  - 参数：
    - `cid`：栏目ID
    - `page`：页码
    - `pageSize`：每页数量
  - 返回：
    ```javascript
    {
      count: 总数,
      total: 总页数,
      page: 当前页,
      list: 文章数组
    }
    ```

### 4.4 文章详情页配置 (article)

**配置键：** `article`

**说明：** 文章详情页的数据配置

**示例配置：**
```json
{
  "news": {
    "method": "getArticleListByCid",
    "params": {
      "len": 10
    }
  },
  "hot": {
    "method": "getArticlePvList",
    "params": {
      "len": 10
    },
    "field": ["id", "title", "path", "pv"],
    "show": true
  },
  "imgs": {
    "method": "getNewImgList",
    "params": {
      "len": 5
    }
  },
  "tags": {
    "method": "fetchTagsByArticleId",
    "params": {
      "len": 5
    }
  },
  "count": {
    "method": "count"
  },
  "pre": {
    "method": "prev"
  },
  "next": {
    "method": "next"
  }
}
```

**函数说明：**
- `fetchTagsByArticleId()`：根据文章ID获取标签
  - SQL：`SELECT t.id, t.path, t.name FROM cms_tag AS t RIGHT JOIN cms_article AS a ON t.id IN (article.tagId) WHERE a.id = aid AND a.status = 0 LIMIT 10`
  - 参数：
    - `id`：文章ID
    - `pageSize`：获取数量
  - 返回：标签数组

- `count()`：增加文章浏览量
  - SQL：`UPDATE cms_article SET pv = pv + 1 WHERE id = id`
  - 参数：
    - `id`：文章ID
  - 返回：更新结果

- `prev()`：获取上一篇同栏目文章
  - SQL：`SELECT a.id, a.title, c.name, c.path FROM cms_article AS a LEFT JOIN cms_category AS c ON a.cid = c.id WHERE a.id < id AND a.cid = cid ORDER BY a.id DESC LIMIT 1`
  - 参数：
    - `id`：当前文章ID
    - `cid`：栏目ID
  - 返回：上一篇文章对象或null

- `next()`：获取下一篇同栏目文章
  - SQL：`SELECT a.id, a.title, c.name, c.path FROM cms_article AS a LEFT JOIN cms_category AS c ON a.cid = c.id WHERE a.id > id AND a.cid = cid ORDER BY a.id ASC LIMIT 1`
  - 参数：
    - `id`：当前文章ID
    - `cid`：栏目ID
  - 返回：下一篇文章对象或null

### 4.5 单页配置 (page)

**配置键：** `page`

**说明：** 单页的数据配置

**示例配置：**
```json
{
  "page": {
    "method": "list",
    "params": {
      "pageSize": 10
    }
  }
}
```

### 4.6 搜索页配置 (search)

**配置键：** `search`

**说明：** 搜索页的数据配置

**示例配置：**
```json
{
  "search": {
    "method": "search",
    "params": {
      "pageSize": 10,
      "cid": 0
    }
  }
}
```

**函数说明：**
- `search()`：搜索文章
  - SQL：`SELECT a.id, a.title, a.attr, a.tagId, a.description, a.cid, a.pv, a.createdAt, a.status, c.name, c.path FROM cms_article AS a LEFT JOIN cms_category AS c ON a.cid = c.id WHERE a.status = 0 AND a.title LIKE '%keywords%' ORDER BY a.id DESC LIMIT pageSize OFFSET (current-1)*pageSize`
  - 参数：
    - `keywords`：搜索关键词
    - `current`：当前页
    - `pageSize`：每页数量
    - `cid`：栏目ID（可选）
  - 返回：
    ```javascript
    {
      count: 总数,
      total: 总页数,
      current: 当前页,
      list: 文章数组
    }
    ```

### 4.7 标签页配置 (tags)

**配置键：** `tags`

**说明：** 标签页的数据配置

**示例配置：**
```json
{
  "tags": {
    "method": "tags",
    "params": {
      "pageSize": 10
    }
  }
}
```

**函数说明：**
- `tags()`：获取标签页的文章列表
  - SQL：`SELECT a.id, a.title, a.img, a.description, a.createdAt, a.author, a.pv, c.pinyin, c.name, c.path FROM cms_article AS a JOIN cms_category AS c ON a.cid = c.id WHERE EXISTS (SELECT 1 FROM cms_tag as t WHERE FIND_IN_SET(t.id, a.tagId) > 0 AND t.path = path) AND a.status = 0 ORDER BY a.createdAt DESC LIMIT pageSize OFFSET (page-1)*pageSize`
  - 参数：
    - `path`：标签路径
    - `page`：页码
    - `pageSize`：每页数量
  - 返回：
    ```javascript
    {
      count: 总数,
      total: 总页数,
      page: 当前页,
      list: 文章数组
    }
    ```

## 五、完整模板配置参考

### 5.1 已配置的模板

以下配置已在数据库中配置，可以直接使用：

| 配置键 | 说明 | 对应模板 | 配置值 |
|--------|------|----------|--------|
| **init** | 模板全局数据 | 所有页面共享 | `{"site": {"method": "site"}, "category": {"method": "category"}, "friendlink": {"method": "friendLink", "params": {"pageSize": 10}}, "frag": {"method": "frag", "params": {"pageSize": 50}}, "tag": {"method": "tag", "params": {"pageSize": 10}}}` |
| **home** | 模板首页数据 | index.html | `{"banner": {"method": "bannerSlide", "show": true}, "slide": {"method": "getArticleList", "params": {"start": 0, "len": 1, "attr": ["3"]}, "field": ["id", "title", "path", "link", "img"], "show": true}, "top": {"method": "getArticleList", "params": {"start": 0, "len": 1, "attr": ["1"], "type": 1}, "field": ["id", "title", "path", "description", "img"], "show": true}, "news": {"method": "getArticleList", "params": {"start": 0, "len": 3, "excludeAttr": ["1"]}, "field": ["id", "title", "path", "createdAt"], "show": true}, "article": {"method": "getArticleListByCids", "params": {"cid": [], "len": 5, "toplen": 1, "attr": ["1", "2"]}, "show": true}, "imgs": {"method": "getNewImgList", "params": {"len": 8}, "field": ["id", "title", "path", "img"], "show": true}, "recommend": {"method": "getArticleList", "params": {"start": 0, "len": 10, "attr": ["2"]}, "show": true}, "hot": {"method": "getArticlePvList", "show": true}, "recommendImgs": {"method": "getNewImgList", "params": {"len": 10, "id": "", "attr": ["2"]}, "field": ["id", "title", "path", "img", "description"], "show": true}, "friendlink": {"method": "friendLink", "params": {"pageSize": 10}, "show": true}}` |
| **list** | 模板列表数据 | list.html | `{"articleList": {"method": "list", "params": {"pageSize": 10}}, "recommend": {"method": "getArticleListByCid", "params": {"len": 5, "attr": ["2"]}, "show": true}, "hot": {"method": "getArticlePvList", "params": {"len": 10}, "field": ["id", "title", "path"], "show": true}, "imgs": {"method": "getNewImgList", "params": {"len": 5}, "show": true}}` |
| **article** | 模板详情数据 | article.html | `{"news": {"method": "getArticleListByCid", "params": {"len": 10}}, "hot": {"method": "getArticlePvList", "params": {"len": 10}, "field": ["id", "title", "path", "pv"], "show": true}, "imgs": {"method": "getNewImgList", "params": {"len": 5}}, "tags": {"method": "fetchTagsByArticleId", "params": {"len": 5}}, "count": {"method": "count"}, "pre": {"method": "prev"}, "next": {"method": "next"}}` |
| **page** | 模板单页数据 | page.html | `{"page": {"method": "list", "params": {"pageSize": 10}}}` |
| **search** | 模板搜索列表数据 | search.html | `{"search": {"method": "search", "params": {"pageSize": 10, "cid": 0}}}` |
| **tags** | 模板tag列表数据 | tag.html | `{"tags": {"method": "tags", "params": {"pageSize": 10}}}` |

### 5.2 建议的配置

以下配置尚未添加到数据库，如需使用请手动添加：

| 配置键 | 说明 | 对应模板 | 配置值 |
|--------|------|----------|--------|
| **list-img** | 模板图片列表数据 | list-img.html | `{"articleList": {"method": "list", "params": {"pageSize": 12}}, "recommend": {"method": "getArticleListByCid", "params": {"len": 6, "attr": ["2"]}, "show": true}, "hot": {"method": "getArticlePvList", "params": {"len": 8}, "field": ["id", "title", "path", "img"], "show": true}, "imgs": {"method": "getNewImgList", "params": {"len": 6}, "show": true}}` |
| **article-book** | 模板图书详情数据 | article-book.html | `{"news": {"method": "getArticleListByCid", "params": {"len": 10}}, "hot": {"method": "getArticlePvList", "params": {"len": 10}, "field": ["id", "title", "path", "pv"], "show": true}, "imgs": {"method": "getNewImgList", "params": {"len": 5}}, "tags": {"method": "fetchTagsByArticleId", "params": {"len": 5}}, "count": {"method": "count"}, "pre": {"method": "prev"}, "next": {"method": "next"}}` |
| **article-down** | 模板下载详情数据 | article-down.html | `{"news": {"method": "getArticleListByCid", "params": {"len": 10}}, "hot": {"method": "getArticlePvList", "params": {"len": 10}, "field": ["id", "title", "path", "pv"], "show": true}, "imgs": {"method": "getNewImgList", "params": {"len": 5}}, "tags": {"method": "fetchTagsByArticleId", "params": {"len": 5}}, "count": {"method": "count"}, "pre": {"method": "prev"}, "next": {"method": "next"}}` |
| **article-img** | 模板图片详情数据 | article-img.html | `{"news": {"method": "getArticleListByCid", "params": {"len": 10}}, "hot": {"method": "getArticlePvList", "params": {"len": 10}, "field": ["id", "title", "path", "pv"], "show": true}, "imgs": {"method": "getNewImgList", "params": {"len": 5}}, "tags": {"method": "fetchTagsByArticleId", "params": {"len": 5}}, "count": {"method": "count"}, "pre": {"method": "prev"}, "next": {"method": "next"}}` |
| **article-pdf** | 模板PDF详情数据 | article-pdf.html | `{"news": {"method": "getArticleListByCid", "params": {"len": 10}}, "hot": {"method": "getArticlePvList", "params": {"len": 10}, "field": ["id", "title", "path", "pv"], "show": true}, "imgs": {"method": "getNewImgList", "params": {"len": 5}}, "tags": {"method": "fetchTagsByArticleId", "params": {"len": 5}}, "count": {"method": "count"}, "pre": {"method": "prev"}, "next": {"method": "next"}}` |
| **article-video** | 模板视频详情数据 | article-video.html | `{"news": {"method": "getArticleListByCid", "params": {"len": 10}}, "hot": {"method": "getArticlePvList", "params": {"len": 10}, "field": ["id", "title", "path", "pv"], "show": true}, "imgs": {"method": "getNewImgList", "params": {"len": 5}}, "tags": {"method": "fetchTagsByArticleId", "params": {"len": 5}}, "count": {"method": "count"}, "pre": {"method": "prev"}, "next": {"method": "next"}}` |
| **special** | 模板专题数据 | special.html | `{"page": {"method": "list", "params": {"pageSize": 10}}, "tag": {"method": "tag", "params": {"pageSize": 10}}, "frag": {"method": "frag", "params": {"pageSize": 10}}}` |
| **message** | 模板留言数据 | message.html | `{"site": {"method": "site"}, "frag": {"method": "frag", "params": {"pageSize": 10}}}` |

**使用说明：**
1. 已配置的模板可以直接使用，无需额外配置
2. 建议的配置如需使用，请在后台系统配置中手动添加
3. 添加配置时，`type_code` 选择 `cms_data`，`config_key` 填写表格中的配置键，`config_value` 填写表格中的配置值（JSON 格式）

## 六、站点配置表 (cms_site)

### 6.1 表结构

站点配置表 `cms_site` 中有一个关键字段 `template`，用于指定当前使用的模板名称：

```sql
CREATE TABLE `cms_site` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '站点名称',
  `logo` varchar(255) DEFAULT NULL COMMENT '站点logo',
  `domain` varchar(255) DEFAULT NULL COMMENT '站点域名',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `wx` varchar(255) DEFAULT NULL COMMENT '微信',
  `icp` varchar(255) DEFAULT NULL COMMENT '备案号',
  `code` text COMMENT '统计代码',
  `json` text COMMENT '其他配置',
  `title` varchar(255) DEFAULT NULL COMMENT '网站标题',
  `keywords` varchar(255) DEFAULT NULL COMMENT '关键词',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `template` varchar(50) DEFAULT 'default' COMMENT 'view模板名称',
  `uploadWay` tinyint(2) DEFAULT '1' COMMENT '上传方式',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='站点配置表';
```

**关键字段说明：**
- `template`：指定当前使用的模板名称，默认值为 `default`
- `title`：网站标题，用于页面 `<title>` 标签
- `keywords`：网站关键词，用于 SEO 优化
- `description`：网站描述，用于 SEO 优化
- `name`：站点名称，显示在页面中

### 5.2 配置示例

```sql
INSERT INTO `cms_site` (`id`, `name`, `logo`, `domain`, `email`, `wx`, `icp`, `code`, `json`, `title`, `keywords`, `description`, `template`, `uploadWay`, `createdAt`, `updatedAt`) 
VALUES 
(1, 'ChanCMS', '/public/view/default/img/logo.png', 'www.chancms.top', '867528315@qq.com', NULL, '皖ICP备2024030927号-1', '', '', 'ChanCMS演示站', 'ChanCMS演示站', 'ChanCMS是一款基于Express和MySQL研发的高质量实用型CMS管理系统。它具备多种类型网站开发，易扩展、基于模块化和插件化开发模式，适用于商用企业级程序开发。', 'default', '1', NULL, '2026-03-01 00:37:14');
```

## 七、模板目录结构

### 9.1 模板目录位置

模板文件存放在 `/view/` 目录下，每个模板对应一个子目录：

```
view/
├── default/              # 默认模板
│   ├── common/           # 公共模板文件
│   │   ├── header.html   # 头部导航
│   │   ├── footer.html   # 底部信息
│   │   ├── nav.html     # 导航菜单
│   │   ├── meta.html    # meta 信息
│   │   ├── js.html      # JS 脚本引用
│   │   ├── audio.html   # 音频播放器
│   │   ├── debug.html  # 调试信息
│   │   ├── lang.html   # 语言切换
│   │   ├── nav-top.html # 顶部导航
│   │   ├── search.html # 搜索框
│   │   └── wap-nav.html # 移动端导航
│   ├── index.html       # 首页
│   ├── list.html       # 列表页
│   ├── article.html    # 文章详情页
│   ├── page.html       # 单页
│   ├── search.html     # 搜索页
│   ├── tag.html       # 标签页
│   ├── 404.html      # 404 错误页
│   ├── 500.html      # 500 错误页
│   ├── special.html   # 专题页
│   ├── message.html   # 留言页
│   ├── article-img.html   # 图文文章页
│   ├── article-video.html # 视频文章页
│   ├── article-pdf.html   # PDF 文章页
│   ├── article-book.html  # 书籍文章页
│   ├── article-down.html  # 下载文章页
│   ├── list-img.html     # 图文列表页
│   └── chanyue.html     # 畅阅页
└── test/               # 测试模板
    ├── common/
    │   └── ...         # 与 default 相同的公共文件
    ├── index.html
    ├── list.html
    └── ...             # 其他页面文件
```

### 9.2 公共模板文件说明

| 文件名 | 说明 | 用途 |
|--------|------|------|
| `header.html` | 头部导航 | 包含网站 Logo、主导航菜单 |
| `footer.html` | 底部信息 | 包含版权信息、友情链接等 |
| `nav.html` | 导航菜单 | 栏目导航菜单 |
| `meta.html` | Meta 信息 | SEO 相关的 meta 标签 |
| `js.html` | JS 脚本 | 引入公共 JavaScript 文件 |
| `audio.html` | 音频播放器 | 音频播放组件 |
| `debug.html` | 调试信息 | 开发调试信息 |
| `lang.html` | 语言切换 | 多语言支持 |
| `nav-top.html` | 顶部导航 | 顶部快捷导航 |
| `search.html` | 搜索框 | 搜索功能组件 |
| `wap-nav.html` | 移动端导航 | 移动端导航菜单 |

## 八、默认模板页面说明

### 8.1 首页 (index.html)

**路由：** `/`

**功能：** 展示网站首页内容，包括轮播图、头条文章、最新文章、推荐文章等。

**数据源：**
```javascript
const data = await home.home();
```

**可用变量：**
- `site` - 站点配置信息
- `nav` - 导航菜单
- `banner` - 轮播图数据
- `top` - 头条文章
- `news` - 最新文章列表
- `article.list` - 按栏目分类的文章列表
- `imgs` - 图文文章列表
- `recommend` - 推荐文章列表
- `tag` - 标签列表
- `friendlink` - 友情链接
- `frag` - 碎片内容

**模板示例：**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{site.title}}-{{site.name}}</title>
    {{include './common/meta.html'}}
</head>
<body>
    {{include './common/header.html'}}
    
    <main class="bg-f2f2f pt-10 pb-20 flex">
        <div class="main center mt-10 flex gap-20">
            <!-- 轮播图 -->
            {{if banner&&banner.length>0}}
            <div class="swiper">
                <div class="swiper-wrapper">
                    {{each banner}}
                    <div class="swiper-slide">
                        <a href="{{$value.linkUrl}}" title="{{$value.title}}">
                            <img src="{{$value.imgUrl}}" alt="{{$value.title}}">
                        </a>
                    </div>
                    {{/each}}
                </div>
            </div>
            {{/if}}
            
            <!-- 头条文章 -->
            {{if top}}
            <div class="top-article">
                <h2>{{top.title}}</h2>
                <p>{{top.description}}</p>
            </div>
            {{/if}}
            
            <!-- 最新文章 -->
            {{if news}}
            <ul class="news-list">
                {{each news}}
                <li>
                    <a href="{{$value.path}}/article-{{$value.id}}.html">
                        {{$value.title}}
                    </a>
                    <time>{{ dateFormat($value.createdAt, 'YYYY-MM-DD') }}</time>
                </li>
                {{/each}}
            </ul>
            {{/if}}
            
            <!-- 按栏目分类的文章 -->
            {{each article.list}}
            <div class="category-articles">
                <h3>{{$value.category.name}}</h3>
                {{if $value.top.title}}
                <div class="top-article">
                    <img src="{{$value.top.img}}" alt="{{$value.top.title}}">
                    <h4>{{$value.top.title}}</h4>
                </div>
                {{/if}}
                
                {{if $value.list&&$value.list.length>0}}
                <ul>
                    {{each $value.list}}
                    <li>
                        <a href="{{$value.path}}/article-{{$value.id}}.html">
                            {{$value.title}}
                        </a>
                    </li>
                    {{/each}}
                </ul>
                {{/if}}
            </div>
            {{/each}}
        </div>
    </main>
    
    {{include './common/footer.html'}}
</body>
</html>
```

### 9.2 列表页 (list.html)

**路由：** `/栏目路径/index.html`

**功能：** 展示某个栏目的文章列表，支持分页。

**数据源：**
```javascript
const data = await home.list({ cid, page });
```

**可用变量：**
- `site` - 站点配置信息
- `nav` - 导航菜单
- `cate` - 当前栏目信息
- `position` - 面包屑导航
- `subnav` - 子栏目导航
- `articleList` - 文章列表
- `pageHtml` - 分页 HTML

**模板示例：**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{cate.name}}-{{site.title}}</title>
    {{include './common/meta.html'}}
</head>
<body>
    {{include './common/header.html'}}
    
    <main class="bg-f2f2f pt-10 pb-20">
        <div class="main center">
            <!-- 面包屑导航 -->
            <div class="breadcrumb">
                {{each position}}
                <a href="{{$value.path}}">{{$value.name}}</a>
                <span>/</span>
                {{/each}}
                <span>{{cate.name}}</span>
            </div>
            
            <!-- 文章列表 -->
            {{if articleList.list.length>0}}
            <ul class="article-list">
                {{each articleList.list}}
                <li>
                    <a href="{{$value.path}}/article-{{$value.id}}.html">
                        <img src="{{$value.img}}" alt="{{$value.title}}">
                        <h3>{{$value.title}}</h3>
                        <p>{{$value.description}}</p>
                        <time>{{ dateFormat($value.createdAt, 'YYYY-MM-DD') }}</time>
                    </a>
                </li>
                {{/each}}
            </ul>
            {{/if}}
            
            <!-- 分页 -->
            <div class="pagination">
                {{@ pageHtml}}
            </div>
        </div>
    </main>
    
    {{include './common/footer.html'}}
</body>
</html>
```

### 9.3 文章详情页 (article.html)

**路由：** `/栏目路径/article-文章ID.html`

**功能：** 展示文章的详细内容，包括标题、内容、作者、发布时间等。

**数据源：**
```javascript
const article = await common.article(id);
const data = await home.article({ id, cid });
```

**可用变量：**
- `site` - 站点配置信息
- `nav` - 导航菜单
- `article` - 文章详细信息
- `cate` - 当前栏目信息
- `position` - 面包屑导航
- `prev` - 上一篇文章
- `next` - 下一篇文章
- `recommend` - 推荐文章
- `related` - 相关文章

**模板示例：**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{article.title}}-{{site.title}}</title>
    <meta name="description" content="{{article.description}}">
    <meta name="keywords" content="{{article.keywords}}">
    {{include './common/meta.html'}}
</head>
<body>
    {{include './common/header.html'}}
    
    <main class="bg-f2f2f pt-10 pb-20">
        <div class="main center">
            <!-- 面包屑导航 -->
            <div class="breadcrumb">
                {{each position}}
                <a href="{{$value.path}}">{{$value.name}}</a>
                <span>/</span>
                {{/each}}
                <span>{{article.title}}</span>
            </div>
            
            <!-- 文章详情 -->
            <article class="article-detail">
                <h1>{{article.title}}</h1>
                <div class="article-meta">
                    <span>作者：{{article.author}}</span>
                    <span>发布时间：{{ dateFormat(article.createdAt, 'YYYY-MM-DD HH:mm:ss') }}</span>
                    <span>浏览量：{{article.pv}}</span>
                </div>
                
                <!-- 文章内容 -->
                <div class="article-content">
                    {{@ article.content}}
                </div>
                
                <!-- 文章标签 -->
                {{if article.tagId}}
                <div class="article-tags">
                    {{each article.tags}}
                    <a href="/tags/{{$value.name}}.html">{{$value.name}}</a>
                    {{/each}}
                </div>
                {{/if}}
                
                <!-- 上一篇/下一篇 -->
                <div class="article-nav">
                    {{if prev}}
                    <a href="{{prev.path}}/article-{{prev.id}}.html">
                        上一篇：{{prev.title}}
                    </a>
                    {{/if}}
                    {{if next}}
                    <a href="{{next.path}}/article-{{next.id}}.html">
                        下一篇：{{next.title}}
                    </a>
                    {{/if}}
                </div>
            </article>
            
            <!-- 推荐文章 -->
            {{if recommend.length>0}}
            <aside class="recommend">
                <h3>推荐文章</h3>
                <ul>
                    {{each recommend}}
                    <li>
                        <a href="{{$value.path}}/article-{{$value.id}}.html">
                            {{$value.title}}
                        </a>
                    </li>
                    {{/each}}
                </ul>
            </aside>
            {{/if}}
        </div>
    </main>
    
    {{include './common/footer.html'}}
</body>
</html>
```

### 9.4 单页 (page.html)

**路由：** `/栏目路径/单页路径.html`

**功能：** 展示单页内容，如关于我们、联系方式等。

**数据源：**
```javascript
const pageData = await home.page({ cid });
```

**可用变量：**
- `site` - 站点配置信息
- `nav` - 导航菜单
- `article` - 单页内容
- `cate` - 当前栏目信息
- `position` - 面包屑导航

**模板示例：**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{article.title}}-{{site.title}}</title>
    {{include './common/meta.html'}}
</head>
<body>
    {{include './common/header.html'}}
    
    <main class="bg-f2f2f pt-10 pb-20">
        <div class="main center">
            <!-- 面包屑导航 -->
            <div class="breadcrumb">
                {{each position}}
                <a href="{{$value.path}}">{{$value.name}}</a>
                <span>/</span>
                {{/each}}
                <span>{{article.title}}</span>
            </div>
            
            <!-- 单页内容 -->
            <article class="page-content">
                <h1>{{article.title}}</h1>
                <div class="content">
                    {{@ article.content}}
                </div>
            </article>
        </div>
    </main>
    
    {{include './common/footer.html'}}
</body>
</html>
```

### 9.5 搜索页 (search.html)

**路由：** `/search.html?keywords=关键词`

**功能：** 展示搜索结果页面。

**数据源：**
```javascript
const data = await home.search({ keywords, page });
```

**可用变量：**
- `site` - 站点配置信息
- `nav` - 导航菜单
- `keywords` - 搜索关键词
- `articleList` - 搜索结果列表
- `pageHtml` - 分页 HTML

**模板示例：**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>搜索：{{keywords}}-{{site.title}}</title>
    {{include './common/meta.html'}}
</head>
<body>
    {{include './common/header.html'}}
    
    <main class="bg-f2f2f pt-10 pb-20">
        <div class="main center">
            <!-- 搜索框 -->
            <div class="search-box">
                <form action="/search.html" method="get">
                    <input type="text" name="keywords" value="{{keywords}}" placeholder="请输入搜索关键词">
                    <button type="submit">搜索</button>
                </form>
            </div>
            
            <!-- 搜索结果 -->
            <div class="search-results">
                <h2>搜索结果：{{keywords}}</h2>
                {{if articleList.list.length>0}}
                <ul>
                    {{each articleList.list}}
                    <li>
                        <a href="{{$value.path}}/article-{{$value.id}}.html">
                            <h3>{{$value.title}}</h3>
                            <p>{{$value.description}}</p>
                            <time>{{ dateFormat($value.createdAt, 'YYYY-MM-DD') }}</time>
                        </a>
                    </li>
                    {{/each}}
                </ul>
                {{else}}
                <p>没有找到相关内容</p>
                {{/if}}
            </div>
            
            <!-- 分页 -->
            <div class="pagination">
                {{@ pageHtml}}
            </div>
        </div>
    </main>
    
    {{include './common/footer.html'}}
</body>
</html>
```

### 9.6 标签页 (tag.html)

**路由：** `/tags/标签路径/tag.html?tag=标签名`

**功能：** 展示某个标签下的文章列表。

**数据源：**
```javascript
const data = await home.tag({ path, page });
```

**可用变量：**
- `site` - 站点配置信息
- `nav` - 导航菜单
- `tag` - 当前标签信息
- `path` - 标签路径
- `articleList` - 文章列表
- `pageHtml` - 分页 HTML

**模板示例：**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>标签：{{tag.name}}-{{site.title}}</title>
    {{include './common/meta.html'}}
</head>
<body>
    {{include './common/header.html'}}
    
    <main class="bg-f2f2f pt-10 pb-20">
        <div class="main center">
            <!-- 标签信息 -->
            <div class="tag-info">
                <h1>标签：{{tag.name}}</h1>
                <p>共 {{articleList.total}} 篇文章</p>
            </div>
            
            <!-- 文章列表 -->
            {{if articleList.list.length>0}}
            <ul class="article-list">
                {{each articleList.list}}
                <li>
                    <a href="{{$value.path}}/article-{{$value.id}}.html">
                        <h3>{{$value.title}}</h3>
                        <p>{{$value.description}}</p>
                        <time>{{ dateFormat($value.createdAt, 'YYYY-MM-DD') }}</time>
                    </a>
                </li>
                {{/each}}
            </ul>
            {{/if}}
            
            <!-- 分页 -->
            <div class="pagination">
                {{@ pageHtml}}
            </div>
        </div>
    </main>
    
    {{include './common/footer.html'}}
</body>
</html>
```

### 9.7 错误页面

#### 404 错误页 (404.html)

**功能：** 当访问的页面不存在时显示。

**模板示例：**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>404-页面未找到-{{site.title}}</title>
    {{include './common/meta.html'}}
</head>
<body>
    {{include './common/header.html'}}
    
    <main class="error-page">
        <div class="error-content">
            <h1>404</h1>
            <p>抱歉，您访问的页面不存在</p>
            <a href="/">返回首页</a>
        </div>
    </main>
    
    {{include './common/footer.html'}}
</body>
</html>
```

#### 500 错误页 (500.html)

**功能：** 当服务器发生错误时显示。

**模板示例：**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>500-服务器错误-{{site.title}}</title>
    {{include './common/meta.html'}}
</head>
<body>
    {{include './common/header.html'}}
    
    <main class="error-page">
        <div class="error-content">
            <h1>500</h1>
            <p>抱歉，服务器发生错误</p>
            <a href="/">返回首页</a>
        </div>
    </main>
    
    {{include './common/footer.html'}}
</body>
</html>
```

## 九、模板标签使用

### 9.1 变量输出

**语法：** `{{变量名}}`

**示例：**
```html
<title>{{site.title}}</title>
<h1>{{article.title}}</h1>
<p>{{article.description}}</p>
```

### 9.2 条件判断

**语法：** `{{if 条件}}...{{/if}}`

**示例：**
```html
{{if article.img}}
<img src="{{article.img}}" alt="{{article.title}}">
{{/if}}

{{if article.list.length>0}}
<ul>
    {{each article.list}}
    <li>{{$value.title}}</li>
    {{/each}}
</ul>
{{else}}
<p>暂无数据</p>
{{/if}}
```

### 9.3 循环遍历

**语法：** `{{each 数组}}...{{/each}}`

**示例：**
```html
{{each article.list}}
<div>
    <h3>{{$value.title}}</h3>
    <p>{{$value.description}}</p>
    <time>{{ dateFormat($value.createdAt, 'YYYY-MM-DD') }}</time>
</div>
{{/each}}
```

### 9.4 模板包含

**语法：** `{{include '模板路径'}}`

**示例：**
```html
{{include './common/header.html'}}
{{include './common/footer.html'}}
{{include './common/meta.html'}}
```

### 9.5 原始输出

**语法：** `{{@ 变量名}}`

**用途：** 输出 HTML 内容，不进行转义。

**示例：**
```html
<div class="article-content">
    {{@ article.content}}
</div>
```

### 9.6 辅助函数

#### dateFormat - 日期格式化

**语法：** `dateFormat(日期, 格式)`

**示例：**
```html
<time>{{ dateFormat(article.createdAt, 'YYYY-MM-DD') }}</time>
<time>{{ dateFormat(article.createdAt, 'YYYY-MM-DD HH:mm:ss') }}</time>
```

**支持的格式：**
- `YYYY` - 四位年份
- `MM` - 两位月份
- `DD` - 两位日期
- `HH` - 两位小时
- `mm` - 两位分钟
- `ss` - 两位秒数

#### 其他辅助函数

根据项目需要，可以自定义辅助函数，例如：
- `truncate(text, length)` - 截断文本
- `stripHtml(html)` - 去除 HTML 标签
- `escape(text)` - HTML 转义

## 十、开发新模板

### 10.1 创建模板目录

在 `/view/` 目录下创建新的模板目录：

```bash
mkdir view/mytemplate
```

### 9.2 创建公共模板文件

复制默认模板的公共文件到新模板目录：

```bash
cp -r view/default/common view/mytemplate/
```

### 9.3 创建页面模板文件

根据需要创建页面模板文件：

```bash
touch view/mytemplate/index.html
touch view/mytemplate/list.html
touch view/mytemplate/article.html
touch view/mytemplate/page.html
```

### 9.4 创建静态资源目录

在 `/public/view/` 目录下创建对应的静态资源目录：

```bash
mkdir public/view/mytemplate
mkdir public/view/mytemplate/css
mkdir public/view/mytemplate/js
mkdir public/view/mytemplate/img
```

### 9.5 切换到新模板

在后台管理系统中，进入站点设置，将模板名称改为新模板名称：

```sql
UPDATE cms_site SET template = 'mytemplate' WHERE id = 1;
```

或者在后台管理界面中修改站点配置，将模板字段设置为 `mytemplate`。

### 9.6 模板开发建议

1. **保持一致性**：保持与默认模板相同的页面结构和变量命名
2. **响应式设计**：确保模板在不同设备上都能正常显示
3. **SEO 优化**：合理使用 meta 标签、标题、描述等
4. **性能优化**：压缩 CSS 和 JS 文件，优化图片大小
5. **可维护性**：使用清晰的注释，保持代码整洁

## 十一、常见问题

### 11.1 模板不生效

**问题：** 修改模板后页面没有变化

**解决方案：**
1. 检查站点配置中的模板名称是否正确
2. 清除浏览器缓存
3. 重启服务器

### 10.2 变量未定义

**问题：** 页面显示 `undefined`

**解决方案：**
1. 检查变量名是否正确
2. 检查控制器是否传递了该变量
3. 使用条件判断避免显示 undefined

### 10.3 样式丢失

**问题：** 页面样式不生效

**解决方案：**
1. 检查静态资源路径是否正确
2. 确认静态资源文件存在于 `/public/view/模板名/` 目录下
3. 检查文件权限

### 10.4 分页不显示

**问题：** 分页 HTML 没有显示

**解决方案：**
1. 确认控制器传递了 `pageHtml` 变量
2. 检查数据是否足够分页
3. 使用 `{{@ pageHtml}}` 输出原始 HTML

## 十二、最佳实践

### 12.1 模板组织

- 将公共部分提取到 `common/` 目录
- 使用清晰的文件命名
- 保持目录结构一致

### 11.2 数据处理

- 在控制器中处理数据格式
- 模板中只负责展示
- 避免在模板中进行复杂逻辑

### 11.3 性能优化

- 使用 CDN 加速静态资源
- 启用浏览器缓存
- 压缩 HTML、CSS、JS 文件

### 11.4 SEO 优化

- 合理使用标题、描述、关键词
- 生成语义化的 HTML
- 优化页面加载速度

## 十三、总结

ChanCMS 的模板系统简单易用，通过后台配置即可轻松切换模板。开发者可以根据需求创建自定义模板，只需遵循本文档的规范，即可快速开发出符合要求的网站模板。

如有疑问，请参考默认模板 `view/default/` 中的示例代码，或联系技术支持。
