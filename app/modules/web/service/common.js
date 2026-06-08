import { helper } from "chanjs";

const { filterFields, arrToObj } = helper;

const common = {
  
  // 获取站点配置信息
  async site() {
    try {
      let res = await Chan.db("cms_site")
        .select([
           "name", 
           "logo", 
           "domain", 
           "email", 
           "wx", 
           "icp",
          "code", 
          "json", 
          "title", 
          "keywords", 
          "description",
          "template", 
          "uploadWay",
          "json"
        ])
        .first();
      return res || {};
    } catch (error) {
      console.error("Error in site():", error);
      return {};
    }
  },

  // 获取所有分类列表，按orderBy升序排列
  async category() {
    try {
      let res = await Chan.db("cms_category")
        .select([
          "id",
          "pid",
          "name",
          "pinyin",
          "path",
          "orderBy",
          "target",
          "status",
          "listView",
          "articleView",
          "seoTitle",
          "seoKeywords",
          "seoDescription",
          "type",
          "dataConfig",
        ])
        .orderBy("orderBy", "ASC");
      return res || [];
    } catch (error) {
      console.error("Error in category():", error);
      return [];
    }
  },

  /**
   * 获取文章列表
   * @param {Object} options - 查询选项
   * @param {number} options.start - 起始位置，默认为0
   * @param {number} options.pageSize - 每页数量，默认为5，最大100
   * @param {string|string[]} options.attr - 文章属性，用于筛选（如置顶、推荐等）
   * @param {string|string[]} options.excludeAttr - 要排除的文章属性
   * @param {number} options.type - 返回类型，2返回数组，其他返回单个对象，默认为2
   * @returns {Promise<Object[]|Object>} 文章列表或单个文章对象
   */
  async getArticleList({
    start = 0,
    pageSize = 5,
    attr = "",
    excludeAttr = "",
    type = 2,
  }) {
    try {
      const query = Chan.db.select([
          "a.id",
          "a.title",
          "a.shortTitle",
          "a.img",
          "a.createdAt",
          "a.description",
          "a.link",
          "c.pinyin",
          "c.name",
          "c.path",
        ])
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .where("a.status", 0)
        .orderBy("a.createdAt", "DESC")
        .limit(Math.min(pageSize, 100))
        .offset(parseInt(start) || 0);

      if (attr) {
        const attrArray = Array.isArray(attr) ? attr : [attr];
        query.whereIn("a.attr", attrArray);
      }

      if (excludeAttr) {
        const excludeAttrArray = Array.isArray(excludeAttr) ? excludeAttr : [excludeAttr];
        query.whereNotIn("a.attr", excludeAttrArray);
      }

      const result = await query;
      return type == 2 ? result : (result[0] || {});
    } catch (error) {
      console.error("Error in getArticleList():", error);
      return type == 2 ? [] : {};
    }
  },

 /**
 * 根据分类ID获取文章列表（包含子分类），不包含扩展模型字段
 * @param {Object} options - 查询选项
 * @param {number} options.cid - 分类ID，必填
 * @param {number} options.pageSize - 每页数量，默认为5，最大100
 * @param {string[]} options.attr - 文章属性数组，用于筛选
 * @param {number} options.start - 分页偏移量，默认为0
 * @param {string[]} options.excludeAttr - 排除的文章属性数组，默认为空
 * @param {boolean} options.hasContent - 是否包含文章内容，默认为false
 * @returns {Promise<Object>} 返回对象 { nav: 栏目信息, list: 文章列表数组(包含tags) }
 */
async getArticleListByCid({ cid, pageSize = 5, attr = [], start = 0, excludeAttr = [], hasContent = false }) {
  try {
    // 无 cid 直接返回
    if (!cid) return { nav: {}, list: [] };
    const limit = Math.min(pageSize, 100);

    // 1. 获取所有子分类 ID（包含自身）
    const childCids = await Chan.db("cms_category").select("id").where("pid", cid);
    const cids = [cid, ...childCids.map(item => item.id)];

    // 2. 文章主查询
    let selectFields = [
      "a.id", "a.title", "a.shortTitle", "a.img",
      "a.createdAt", "a.description", "a.tagId", "a.link", "c.path", "c.name"
    ];

    if (hasContent) {
      selectFields.push("a.content");
    }

    let query = Chan.db("cms_article AS a")
      .leftJoin("cms_category AS c", "a.cid", "c.id")
      .select(...selectFields)
      .whereIn("a.cid", cids)
      .where("a.status", 0)
      .orderBy("a.createdAt", "desc")
      .limit(limit)
      .offset(parseInt(start) || 0);

    // 属性筛选
    if (attr.length) query.whereIn("a.attr", attr);

    // 排除指定属性（只在没有 attr 筛选时生效）
    if (excludeAttr.length && attr.length === 0) query.whereNotIn("a.attr", excludeAttr);
    const list = await query;

    // 3. 处理标签（无数据直接跳过）
    if (list.length) {
      // 收集所有标签 ID
      const allTagIds = list.flatMap(article =>
        article.tagId ? article.tagId.split(",").map(Number).filter(Number.isFinite) : []
      );

      // 批量查询标签并映射
      const tags = await Chan.db("cms_tag").select("id", "name", "path").whereIn("id", allTagIds);
      const tagMap = new Map(tags.map(tag => [tag.id, tag]));

      // 给文章绑定标签
      list.forEach(article => {
        const tagIds = article.tagId
          ? article.tagId.split(",").map(Number).filter(Number.isFinite)
          : [];
        article.tags = tagIds.map(id => tagMap.get(id)).filter(Boolean);
        delete article.tagId;
      });
    }

    // 4. 获取栏目信息
    const nav = await Chan.db("cms_category").select("path", "name").where("id", cid).first() || {};
    return { nav, list };

  } catch (error) {
    console.error("getArticleListByCid 异常：", error);
    return { nav: {}, list: [] };
  }
},

  /**
   * 根据分类ID获取文章列表（包含子分类），包含扩展模型字段
   * @param {Object} options - 查询选项
   * @param {number} options.cid - 分类ID，必填
   * @param {number} options.pageSize - 每页数量，默认为5，最大100
   * @param {string[]} options.attr - 文章属性数组，用于筛选
   * @param {number} options.start - 分页偏移量，默认为0
   * @param {string[]} options.excludeAttr - 排除的文章属性数组，默认为空
   * @param {boolean} options.hasContent - 是否包含文章内容，默认为false
   * @returns {Promise<Object>} 返回对象 { nav: 栏目信息, list: 文章列表数组(包含扩展字段和tags) }
   */
  async getArticleListByCidWithFields({ cid, pageSize = 5, attr = [], start = 0, excludeAttr = [], hasContent = false,...options }) {
    try {
      const params = { cid, pageSize, attr, start, excludeAttr, hasContent,...options };
      console.log('getArticleListByCidWithFields params:', params);
      
      if (!cid) return { nav: {}, list: [] };
      const limit = Math.min(pageSize, 100);

      const childCids = await Chan.db("cms_category").select("id").where("pid", cid);
      const cids = [cid, ...childCids.map(item => item.id)];

      const categoryResult = await Chan.db("cms_category")
        .select("mid")
        .where("id", cid)
        .first();

      let selectFields = [
        "a.id", "a.title", "a.shortTitle", "a.img",
        "a.createdAt", "a.description", "a.tagId","a.link", "c.path", "c.name"
      ];

      if (hasContent) {
        selectFields.push("a.content");
      }

      let query = Chan.db("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .select(...selectFields)
        .whereIn("a.cid", cids)
        .where("a.status", 0)
        .orderBy("a.createdAt", "desc")
        .limit(limit)
        .offset(parseInt(start) || 0);

      if (attr.length) query.whereIn("a.attr", attr);
      if (excludeAttr.length && attr.length === 0) query.whereNotIn("a.attr", excludeAttr);

      if (categoryResult?.mid && categoryResult.mid !== "0") {
        const modelResult = await Chan.db("cms_model")
          .select("tableName")
          .where("id", categoryResult.mid)
          .first();

        if (modelResult?.tableName) {
          const tableNameStr = modelResult.tableName;

          const fieldList = await Chan.db("cms_field")
            .select("ename")
            .where("mid", categoryResult.mid);

          if (fieldList.length) {
            fieldList.forEach(field => selectFields.push(`f.${field.ename}`));

            query = Chan.db("cms_article AS a")
              .leftJoin("cms_category AS c", "a.cid", "c.id")
              .leftJoin(tableNameStr + " AS f", function() {
                this.on("a.id", "=", "f.aid");
              })
              .select(...selectFields)
              .whereIn("a.cid", cids)
              .where("a.status", 0)
              .orderBy("a.createdAt", "desc")
              .limit(limit)
              .offset(parseInt(start) || 0);

            if (attr.length) query.whereIn("a.attr", attr);
            if (excludeAttr.length) query.whereNotIn("a.attr", excludeAttr);
          }
        }
      }

      const list = await query;

      if (list.length) {
        const allTagIds = list.flatMap(article =>
          article.tagId ? article.tagId.split(",").map(Number).filter(Number.isFinite) : []
        );

        const tags = await Chan.db("cms_tag").select("id", "name", "path").whereIn("id", allTagIds);
        const tagMap = new Map(tags.map(tag => [tag.id, tag]));

        list.forEach(article => {
          const tagIds = article.tagId
            ? article.tagId.split(",").map(Number).filter(Number.isFinite)
            : [];
          article.tags = tagIds.map(id => tagMap.get(id)).filter(Boolean);
          delete article.tagId;
        });
      }

      const nav = await Chan.db("cms_category").select("path", "name").where("id", cid).first() || {};
      
      console.log(pageSize,list)
      // 如果 pageSize 为 1，直接返回单个文章对象
      if (pageSize === 1 && list.length > 0) {
        return { nav, data: list[0] };
      }
      
      return { nav, list };

    } catch (error) {
      console.error("getArticleListByCidWithFields 异常：", error);
      return { nav: {}, list: [] };
    }
  },

  /**
   * 根据父分类ID获取子分类的文章列表，按分类拼音分组
   * @param {Object} options - 查询选项
   * @param {number} options.cid - 父分类ID，必填
   * @param {number} options.pageSize - 每页数量，默认为5，最大100
   * @param {string[]} options.attr - 文章属性数组，用于筛选
   * @returns {Promise<Object>} 以分类拼音为key，文章列表为value的对象
   */
  async getArticleListByCidCate({ cid, pageSize = 5, attr = [] }) {
    try {
      if (!cid) return {};
      
      const res = await Chan.db.select("id", "pinyin")
        .from("cms_category")
        .where("pid", cid);
      const childCategories = res.filter((item) => item.id !== cid);
      const allCategoryIds = [...childCategories.map((item) => item.id)];

      if (allCategoryIds.length === 0) return {};

      const idToPinyin = Object.fromEntries(
        res.map((item) => [item.id, item.pinyin])
      );

      if (res.length === 0 && cid !== 0) {
        const category = await Chan.db
          .select("pinyin")
          .from("cms_category")
          .where("id", cid)
          .first();
        if (category) {
          idToPinyin[cid] = category.pinyin;
        }
      }

      const fetchPromises = allCategoryIds.map((id) => {
        let queryBuilder = Chan.db
          .select(
            "a.id",
            "a.title",
            "a.shortTitle",
            "a.img",
            "a.createdAt",
            "a.description",
            "c.pinyin",
            "c.name",
            "c.path"
          )
          .from("cms_article AS a")
          .leftJoin("cms_category AS c", "a.cid", "c.id")
          .where("a.cid", id)
          .where("a.status", 0)
          .orderBy("a.createdAt", "DESC");

        if (pageSize > 0) {
          queryBuilder = queryBuilder.limit(Math.min(pageSize, 100));
        }

        if (Array.isArray(attr) && attr.length > 0) {
          queryBuilder = queryBuilder.whereIn("a.attr", attr);
        }

        return queryBuilder;
      });

      const results = await Promise.all(fetchPromises);

      const grouped = {};
      allCategoryIds.forEach((id, index) => {
        const pinyin = idToPinyin[id] || "default";
        grouped[pinyin] = results[index] || [];
      });

      return grouped;
    } catch (error) {
      console.error("Error in getArticleListByCidCate():", error);
      return {};
    }
  },

  /**
   * 根据文章ID获取关联的标签列表
   * @param {number} aid - 文章ID
   * @returns {Promise<Object[]>} 标签列表数组，包含id、name、path等字段
   */
  async getTagsFromArticleByAid(aid) {
    try {
      if (!aid) return [];
      
      const article = await Chan.db("cms_article")
        .select("tagId")
        .where("id", aid)
        .first();

      if (!article || !article.tagId) {
        return [];
      }

      const tagIds = article.tagId.split(",").map(Number).filter(n => !isNaN(n));
      if (tagIds.length === 0) return [];
      
      const result = await Chan.db("cms_tag")
        .select("id", "name", "path")
        .whereIn("id", tagIds)
        .limit(10);

      return result || [];
    } catch (error) {
      console.error("Error in getTagsFromArticleByAid():", error);
      return [];
    }
  },

  /**
   * 获取所有父级分类列表
   * @param {number[]} idArray - 分类ID数组，可选。传入则只返回指定ID的分类
   * @returns {Promise<Object[]>} 父级分类列表数组，按orderBy升序排列
   */
  async getAllParentCategory(idArray = []) {
    try {
      const result = await Chan.db("cms_category")
        .select([
          "id",
          "pid",
          "name",
          "pinyin",
          "path",
          "orderBy",
          "target",
          "status",
          "type",
          
        ])
        .where("pid", 0)
        .where("type", 0)
        .where((builder) => !idArray.length || builder.whereIn("id", idArray))
        .orderBy("orderBy", "ASC");
      return result || [];
    } catch (error) {
      console.error("Error in getAllParentCategory():", error);
      return [];
    }
  },

  /**
   * 根据分类ID数组批量获取文章列表，包含置顶文章和标签
   * @param {Object} options - 查询选项
   * @param {number[]} options.cids - 分类ID数组
   * @param {string|number} options.attr - 文章属性，默认为2
   * @param {number} options.toplen - 置顶文章数量，默认为1。为0时不返回top对象
   * @param {number} options.len - 普通文章数量，默认为5
   * @returns {Promise<Object>} 包含按分类拼音分组的文章对象和list数组的对象
   */
  async getArticleListByCids({
    cids = [],
    attr = 2,
    toplen = 1,
    len = 5,
  } = {}) {
    try {
      function uniqueByPath(arr) {
        const map = new Map();
        return arr.filter((item) => {
          if (!map.has(item.path)) {
            map.set(item.path, item);
            return true;
          }
          return false;
        });
      }

      let cate = await common.getAllParentCategory(cids);
      cate = cate.filter((item) => item.path != "/home" && item.type == "0");
      const cateField = ["id", "name", "path", "pinyin"];
      cate = filterFields(cate, cateField);

      let list = [];
      for (let item of cate) {
        const [_topResult, _listResult] = await Promise.all([
          common.getArticleListByCid({ cid: item.id, pageSize: toplen, attr }),
          common.getArticleListByCid({ cid: item.id, pageSize: len }),
        ]);

        const _top = _topResult?.list?.[0] || null;
        const _list = _listResult?.list || [];

        let tagsPromises = _list.map((sub) =>
          common.getTagsFromArticleByAid(sub.id)
        );
        let tags = await Promise.all(tagsPromises);
        tags = [].concat(...tags);
        tags = uniqueByPath(tags);

        let _item = { list: _list, tags, category: item };
        if (toplen > 0) {
          _item.top = _top;
        }
        list.push(_item);
      }

      let article = {};
      list.forEach((item) => {
        article[item.category.pinyin] = item;
      });

      return { ...article, list };
    } catch (error) {
      console.error("Error in getArticleListByCids():", error);
      return { list: [] };
    }
  },

  /**
   * 获取浏览量最高的文章列表（热门文章）
   * @param {Object} options - 查询选项
   * @param {number} options.pageSize - 每页数量，默认为10，最大100
   * @param {string|number} options.cid - 分类ID，可选。传入则只获取该分类及子分类的文章
   * @returns {Promise<Object[]>} 按浏览量降序排列的文章列表
   */
  async getArticlePvList({ pageSize = 10, cid = "" } = {}) {
    try {
      const query = Chan.db.select(
          "a.id",
          "a.title",
          "a.shortTitle",
          "a.img",
          "a.createdAt",
          "a.description",
          "a.pv",
          "c.pinyin",
          "c.name",
          "c.path"
        )
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .where("a.status", 0);

      if (cid) {
        const subIds = await Chan.db("cms_category")
          .select("id")
          .where("pid", Number(cid))
          .pluck("id");

        const targetIds = [...subIds, Number(cid)];
        query.whereIn("a.cid", targetIds);
      }

      const result = await query.orderBy("a.pv", "DESC").limit(Math.min(pageSize, 100));
      return result || [];
    } catch (error) {
      console.error("Error in getArticlePvList():", error);
      return [];
    }
  },

  /**
   * 获取最新带图片的文章列表
   * @param {Object} options - 查询选项
   * @param {number} options.pageSize - 每页数量，默认为10，最大100
   * @param {string|number} options.cid - 分类ID，可选。传入则只获取该分类及子分类的文章
   * @param {string} options.attr - 文章属性，用于模糊匹配筛选
   * @returns {Promise<Object[]>} 按创建时间降序排列的带图片文章列表
   */
  async getNewImgList({ pageSize = 10, cid = "", attr = "" } = {}) {
    try {
      let query = Chan.db.select(
          "a.id",
          "a.title",
          "a.shortTitle",
          "a.img",
          "a.createdAt",
          "a.description",
          "c.pinyin",
          "c.name",
          "c.path"
        )
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .where("a.img", "!=", "")
        .where("a.status", 0);

      if (cid) {
        const ids = await Chan.db("cms_category")
          .select("id")
          .where("pid", cid)
          .pluck("id");

        ids.push(cid);
        query.whereIn("a.cid", ids);
      }

      if (attr) {
        query.where("a.attr", "LIKE", `%${attr}%`);
      }
      
      const result = await query.orderBy("a.createdAt", "DESC").limit(Math.min(pageSize, 100));
      return result || [];
    } catch (error) {
      console.error("Error in getNewImgList():", error);
      return [];
    }
  },

  /**
   * 获取分类下的文章分页列表（包含子分类）
   * @param {Object} options - 查询选项
   * @param {number} options.cid - 分类ID，必填
   * @param {number} options.page - 当前页码，默认为1
   * @param {number} options.pageSize - 每页数量，默认为10
   * @param {boolean} options.tag - 是否查询标签，默认为true
   * @param {boolean} options.field - 是否查询扩展字段，默认为true
   * @returns {Promise<Object>} 分页数据对象，包含total、current、pageSize、list字段
   */
  async list({ cid, page = 1, pageSize = 10, tag = true, field = true }) {
    try {
      if (!cid) {
        return { total: 0, current: 1, pageSize: pageSize, list: [] };
      }
      
      const start = (page - 1) * pageSize;
      let ids = [cid];
      const res = await Chan.db("cms_category").select("id").where("pid", cid);
      res.forEach((item) => {
        ids.push(item.id);
      });
      
      const total = await Chan.db("cms_article")
        .count("id as count")
        .whereIn("cid", ids)
        .where("status", 0)
        .first();
      const count = total?.count || 0;

      const categoryResult = await Chan.db("cms_category")
        .select("mid")
        .where("id", cid)
        .first();

      let selectFields = [
        "a.id",
        "a.title",
        "a.shortTitle",
        "a.img",
        "a.description",
        "a.createdAt",
        "a.author",
        "a.pv",
        "c.pinyin",
        "c.name",
        "c.path"
      ];

      if (tag) {
        selectFields.push("a.tagId");
      }

      let queryBuilder = Chan.db.select(...selectFields)
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .whereIn("a.cid", ids)
        .where("a.status", 0)
        .orderBy("a.createdAt", "DESC")
        .offset(start)
        .limit(pageSize);

      if (field && categoryResult?.mid && categoryResult.mid !== "0") {
        const modelResult = await Chan.db("cms_model")
          .select("tableName")
          .where("id", categoryResult.mid)
          .first();

        if (modelResult?.tableName) {
          const tableNameStr = modelResult.tableName;
          
          const fieldList = await Chan.db("cms_field")
            .select("ename")
            .where("mid", categoryResult.mid);
          
          if (fieldList.length > 0) {
            fieldList.forEach(field => {
              selectFields.push(`f.${field.ename}`);
            });
            
            queryBuilder = Chan.db.select(...selectFields)
              .from("cms_article AS a")
              .leftJoin("cms_category AS c", "a.cid", "c.id")
              .leftJoin(tableNameStr + " AS f", function() {
                this.on("a.id", "=", "f.aid");
              })
              .whereIn("a.cid", ids)
              .where("a.status", 0)
              .orderBy("a.createdAt", "DESC")
              .offset(start)
              .limit(pageSize);
          }
        }
      }

      const result = await queryBuilder;

      if (tag && result.length) {
        const allTagIds = result.flatMap(article =>
          article.tagId ? article.tagId.split(",").map(Number).filter(Number.isFinite) : []
        );

        const tags = await Chan.db("cms_tag").select("id", "name", "path").whereIn("id", allTagIds);
        const tagMap = new Map(tags.map(tag => [tag.id, tag]));

        result.forEach(article => {
          const tagIds = article.tagId
            ? article.tagId.split(",").map(Number).filter(Number.isFinite)
            : [];
          article.tags = tagIds.map(id => tagMap.get(id)).filter(Boolean);
          delete article.tagId;
        });
      }

      return {
        total: count,
        current: +page,
        pageSize: pageSize,
        list: result || [],
      };
    } catch (error) {
      console.error("Error in list():", error);
      return { total: 0, current: 1, pageSize: pageSize, list: [] };
    }
  },

  /**
   * 根据标签路径获取关联文章的分页列表
   * @param {Object} options - 查询选项
   * @param {string} options.path - 标签路径，必填
   * @param {number} options.page - 当前页码，默认为1
   * @param {number} options.pageSize - 每页数量，默认为10
   * @returns {Promise<Object>} 分页数据对象，包含total、current、pageSize、list字段
   */
  async tags({ path, page = 1, pageSize = 10 }) {
    try {
      if (!path) {
        return { total: 0, current: 1, pageSize: pageSize, list: [] };
      }
      
      const start = (page - 1) * pageSize;
      const dbType = process.env.DB_TYPE || 'mysql';

      // 根据数据库类型选择 FIND_IN_SET 的替代方案
      const findInSetCondition = dbType === 'sqlite'
        ? "INSTR(',' || a.tagId || ',', ',' || t.id || ',') > 0"
        : "FIND_IN_SET(t.id, a.tagId) > 0";

      // 同时支持按 path 和 name 查找 tag
      const tagCondition = function() {
        this.where("t.path", path).orWhere("t.name", path);
      };

      const totalResult = await Chan.db("cms_article as a")
        .whereExists((qb) => {
          qb.select(Chan.db.raw("1"))
            .from("cms_tag as t")
            .whereRaw(findInSetCondition)
            .where(tagCondition);
        })
        .andWhere("a.status", 0)
        .count("a.id as total");

      const count = parseInt(totalResult[0]?.total || 0, 10);

      const result = await Chan.db("cms_article as a")
        .select(
          "a.id",
          "a.title",
          "a.shortTitle",
          "a.img",
          "a.description",
          "a.createdAt",
          "a.author",
          "a.pv",
          "c.pinyin",
          "c.name",
          "c.path"
        )
        .join("cms_category as c", "a.cid", "c.id")
        .whereExists((qb) => {
          qb.select(Chan.db.raw("1"))
            .from("cms_tag as t")
            .whereRaw(findInSetCondition)
            .where(tagCondition);
        })
        .andWhere("a.status", 0)
        .orderBy("a.createdAt", "desc")
        .offset(start)
        .limit(pageSize);

      return {
        total: count,
        current: page,
        pageSize: pageSize,
        list: result || [],
      };
    } catch (error) {
      console.error("Error in tags():", error);
      return { total: 0, current: 1, pageSize: pageSize, list: [] };
    }
  },

  /**
   * 根据文章ID获取关联的标签列表
   * @param {Object} options - 查询选项
   * @param {number} options.id - 文章ID，必填
   * @param {number} options.pageSize - 返回标签数量，默认为5
   * @returns {Promise<Object[]>} 标签列表数组，包含id、path、name字段
   */
  async fetchTagsByArticleId({ id, pageSize = 5 }) {
    try {
      if (!id) return [];
      
      const article = await Chan.db("cms_article")
        .select("tagId")
        .where("id", id)
        .first();

      if (!article || !article.tagId) {
        return [];
      }

      const tagIds = article.tagId.split(",").map(Number).filter(n => !isNaN(n));
      if (tagIds.length === 0) return [];
      
      const tags = await Chan.db("cms_tag")
        .select("id", "path", "name")
        .whereIn("id", tagIds)
        .limit(pageSize);

      return tags || [];
    } catch (error) {
      console.error("Error in fetchTagsByArticleId():", error);
      return [];
    }
  },

  /**
   * 获取轮播图列表
   * @param {Object} options - 查询选项
   * @param {number} options.page - 当前页码，默认为1
   * @param {number} options.pageSize - 每页数量，默认为10，最大100
   * @returns {Promise<Object[]>} 轮播图列表数组，包含id、title、imgUrl、linkUrl、content字段
   */
  async bannerSlide({ page = 1, pageSize = 10 }) {
    try {
      const offset = parseInt((page - 1) * pageSize);
      const list = await Chan.db.select(["id", "title", "imgUrl", "linkUrl", "content"])
        .from("cms_slide")
        .limit(Math.min(pageSize, 100))
        .offset(offset)
        .orderBy("id", "desc");
      return list || [];
    } catch (error) {
      console.error("Error in bannerSlide():", error);
      return [];
    }
  },

  /**
   * 获取友情链接列表
   * @param {Object} options - 查询选项
   * @param {number} options.pageSize - 返回数量，默认为10，最大100
   * @returns {Promise<Object[]>} 友情链接列表数组，包含title、link字段
   */
  async friendLink({ pageSize = 10 }) {
    try {
      pageSize = Math.min(parseInt(pageSize, 10) || 10, 100);

      const list = await Chan.db("cms_friendlink")
        .select("title", "link")
        .orderBy("orderBy", "desc")
        .orderBy("id", "desc")
        .limit(pageSize)
        .offset(0);
      return list || [];
    } catch (error) {
      console.error("Error in friendLink():", error);
      return [];
    }
  },

  /**
   * 获取碎片内容列表，转换为以mark为key的对象
   * @param {Object} options - 查询选项
   * @param {number} options.pageSize - 返回数量，默认为10，最大100
   * @returns {Promise<Object>} 以mark为key、content为value的对象
   */
  async frag({ pageSize = 10 }) {
    try {
      pageSize = Math.min(parseInt(pageSize, 10) || 10, 100);

      const list = await Chan.db.select(["name", "mark", "content"])
        .from("cms_frag")
        .limit(pageSize)
        .offset(0)
        .orderBy("id", "desc");
      const frags = arrToObj(list || [], "mark", "content");
      return frags;
    } catch (error) {
      console.error("Error in frag():", error);
      return {};
    }
  },

  /**
   * 获取标签列表，按使用数量降序排列
   * @param {Object} options - 查询选项
   * @param {number} options.pageSize - 返回数量，默认为10，最大100
   * @returns {Promise<Object[]>} 标签列表数组，包含id、name、path、count字段
   */
  async tag({ pageSize = 10 }) {
    try {
      pageSize = Math.min(parseInt(pageSize, 10) || 10, 100);

      const res = await Chan.db.select(["id", "name", "path", "count"])
        .from("cms_tag")
        .limit(pageSize)
        .offset(0)
        .orderBy("count", "desc");
      return res || [];
    } catch (error) {
      console.error("Error in tag():", error);
      return [];
    }
  },

  /**
   * 根据文章ID获取文章详情，包含扩展字段（字段提到外层）
   * @param {number} id - 文章ID
   * @returns {Promise<Object|false>} 文章详情对象，扩展字段提到外层，失败返回false
   */
  async article(id) {
    try {
      if (!id) return false;

      const data = await Chan.db("cms_article").where("id", "=", id).first();
      if (!data || !data.cid) {
        return false;
      }

      const modIdResult = await Chan.db("cms_category")
        .select("mid")
        .where("id", data.cid)
        .first();

      if (!modIdResult || modIdResult.mid === "0") {
        return { ...data };
      }

      const tableResult = await Chan.db("cms_model")
        .select("tableName")
        .where("id", modIdResult.mid)
        .first();

      if (!tableResult) {
        return { ...data };
      }

      const tableNameStr = tableResult.tableName;

      // 从 cms_field 表获取该模型的字段定义
      const fieldList = await Chan.db("cms_field")
        .select("ename")
        .where("mid", modIdResult.mid);

      if (fieldList.length === 0) {
        return { ...data };
      }

      // 构建查询字段数组（只查询定义的字段，不包括 id 和 aid）
      const fieldNames = fieldList.map(field => field.ename);

      // 查询扩展表数据
      const fieldResult = await Chan.db.select(...fieldNames)
        .from(tableNameStr)
        .where("aid", id)
        .first();

      // 把扩展字段提到外层
      return { ...data, ...fieldResult };
    } catch (error) {
      console.error("Error in article():", error);
      return false;
    }
  },

  /**
   * 获取当前文章的上一篇
   * @param {Object} options - 查询选项
   * @param {number} options.id - 当前文章ID，必填
   * @param {number} options.cid - 分类ID，必填
   * @returns {Promise<Object|null>} 上一篇文章对象，包含id、title、name、path字段，无则返回null
   */
  async prev({ id, cid }) {
    try {
      if (!id || !cid) return null;
      
      const result = await Chan.db("cms_article as a")
        .select("a.id", "a.title", "c.name", "c.path")
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .where("a.id", "<", id)
        .andWhere("a.cid", cid)
        .orderBy("a.id", "desc")
        .first();
      return result || null;
    } catch (error) {
      console.error("Error in prev():", error);
      return null;
    }
  },

  /**
   * 获取当前文章的下一篇
   * @param {Object} options - 查询选项
   * @param {number} options.id - 当前文章ID，必填
   * @param {number} options.cid - 分类ID，必填
   * @returns {Promise<Object|null>} 下一篇文章对象，包含id、title、name、path字段，无则返回null
   */
  async next({ id, cid }) {
    try {
      if (!id || !cid) return null;
      
      const result = await Chan.db("cms_article as a")
        .select("a.id", "a.title", "c.name", "c.path")
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .where("a.id", ">", id)
        .andWhere("a.cid", cid)
        .orderBy("a.id", "asc")
        .first();
      return result || null;
    } catch (error) {
      console.error("Error in next():", error);
      return null;
    }
  },

  /**
   * 增加文章浏览量
   * @param {Object} options - 查询选项
   * @param {number} options.id - 文章ID，必填
   * @returns {Promise<number|null>} 返回受影响的行数，失败返回null
   */
  async count({ id }) {
    try {
      if (!id) return null;
      
      const result = await Chan.db("cms_article")
        .where("id", id)
        .increment("pv", 1);
      return result;
    } catch (error) {
      console.error("Error in count():", error);
      return null;
    }
  },

  /**
   * 搜索文章，支持关键词和分类筛选
   * @param {Object} options - 查询选项
   * @param {string} options.keywords - 搜索关键词，用于模糊匹配文章标题
   * @param {number} options.current - 当前页码，默认为1
   * @param {number} options.pageSize - 每页数量，默认为10
   * @param {number} options.cid - 分类ID，默认为0（不限制分类）
   * @returns {Promise<Object>} 分页数据对象，包含total、current、pageSize、list字段
   */
  async search({ keywords = "", current = 1, pageSize = 10, cid = 0 }) {
    try {
      const offset = (current - 1) * pageSize;

      let queryBuilder = Chan.db("cms_article as a")
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .select(
          "a.id",
          "a.title",
          "a.attr",
          "a.tagId",
          "a.description",
          "a.cid",
          "a.pv",
          "a.createdAt",
          "a.status",
          "c.name",
          "c.path"
        )
        .where("a.status", 0);

      if (keywords.trim()) {
        queryBuilder.where("a.title", "like", `%${keywords.trim()}%`);
      }

      if (cid !== 0) {
        queryBuilder.where("c.id", cid);
      }

      const totalResult = await Chan.db.count("* as count")
        .from(queryBuilder.as("temp_query"))
        .first();
      const count = parseInt(totalResult?.count || 0, 10);

      const list = await queryBuilder
        .clone()
        .orderBy("a.id", "desc")
        .offset(offset)
        .limit(pageSize);

      return {
        total: count,
        current: +current,
        pageSize: pageSize,
        list: list || [],
      };
    } catch (error) {
      console.error("Error in search():", error);
      return { total: 0, current: 1, pageSize: pageSize, list: [] };
    }
  },

  /**
   * 通用表查询方法，支持分页、条件筛选和字段过滤，包含权限校验
   * @param {Object} options - 查询选项
   * @param {string} options.table - 表名，必填。不能查询系统表（sys_user、sys_role等）
   * @param {number} options.current - 当前页码，默认为1
   * @param {number} options.pageSize - 每页数量，默认为10。为1时返回单个对象
   * @param {Object} options.query - 查询条件对象，key-value形式，默认为空对象
   * @param {string[]} options.field - 要返回的字段数组，默认返回所有字段
   * @param {boolean} options.needCount - 是否返回总数，默认为true
   * @returns {Promise<Object|Object[]>} needCount为true时返回{data, total, current, pageSize}对象，否则返回数据数组或单个对象
   */
  async query({
    table = "",
    current = 1,
    pageSize = 10,
    query = {},
    field = [],
    needCount = true,
  }) {
    try {
      if (!table) {
        console.error("请传入表名");
        return {};
      }

      const restrictedTables = [
        "sys_user",
        "sys_role",
        "sys_notice",
        "sys_menu",
        "sys_config",
        "plus_collect",
        "plus_gather",
      ];
      
      if (restrictedTables.includes(table)) {
        console.error(`查询${table}表，无权限`);
        return {};
      }
      
      const offset = (current - 1) * pageSize;

      let countQuery = Chan.db(table).count("* as total");
      let dataQuery = Chan.db(table);
      
      if (Object.keys(query).length > 0) {
        Object.entries(query).forEach(([key, value]) => {
          dataQuery = dataQuery.where(key, value);
          countQuery = countQuery.where(key, value);
        });
      }

      if (field.length > 0) {
        dataQuery = dataQuery.select(field);
      }

      const [totalResult, data] = await Promise.all([
        countQuery.first(),
        pageSize == 1
          ? dataQuery.offset(offset).limit(pageSize).first()
          : dataQuery.offset(offset).limit(pageSize),
      ]);
      
      const total = totalResult?.total || 0;
      return needCount ? { data, total, current, pageSize } : data;
    } catch (error) {
      console.error("Error in query():", error);
      return needCount ? { data: [], total: 0, current, pageSize } : [];
    }
  },
};

export default common;
