import { helper } from "chanjs";

const { filterFields, arrToObj } = helper;

const common = {
  
  async site() {
    try {
      let res = await Chan.db("cms_site")
        .select([
          "name",
          "domain",
          "email",
          "wx",
          "icp",
          "code",
          "title",
          "keywords",
          "description",
          "json",
        ])
        .first();
      return res || {};
    } catch (error) {
      console.error("Error in site():", error);
      return {};
    }
  },

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
        ])
        .orderBy("orderBy", "ASC");
      return res || [];
    } catch (error) {
      console.error("Error in category():", error);
      return [];
    }
  },

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

  async getArticleListByCid({ cid, pageSize = 5, attr = [] }) {
    try {
      if (!cid) return [];
      
      const res = await Chan.db("cms_category").select("id").where("pid", cid);
      const ids = [cid, ...res.map((item) => item.id)];
      
      let queryBuilder = Chan.db.select(
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
        .whereIn("a.cid", ids)
        .where("a.status", 0)
        .orderBy("a.createdAt", "DESC")
        .limit(Math.min(pageSize, 100));

      if (Array.isArray(attr) && attr.length > 0) {
        queryBuilder.whereIn("a.attr", attr);
      }

      const result = await queryBuilder;
      return result || [];
    } catch (error) {
      console.error("Error in getArticleListByCid():", error);
      return [];
    }
  },

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

  async getTagsFromArticleByAid(aid) {
    try {
      if (!aid) return [];
      
      const result = await Chan.db("cms_article AS a")
        .select("a.cid", "t.id", "t.name", "t.path")
        .rightJoin("cms_tag AS t", "t.id", "=", "a.tagId")
        .where("a.id", aid)
        .where("a.status", 0)
        .limit(10)
        .offset(0);
      return result || [];
    } catch (error) {
      console.error("Error in getTagsFromArticleByAid():", error);
      return [];
    }
  },

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
        const [_top, _list] = await Promise.all([
          common.getArticleListByCid({ cid: item.id, pageSize: toplen, attr }),
          common.getArticleListByCid({ cid: item.id, pageSize: len }),
        ]);

        let tagsPromises = _list.map((sub) =>
          common.getTagsFromArticleByAid(sub.id)
        );
        let tags = await Promise.all(tagsPromises);
        tags = [].concat(...tags);
        tags = uniqueByPath(tags);

        let _item = { top: _top, list: _list, tags, category: item };
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

  async list({ cid, page = 1, pageSize = 10 }) {
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

      const result = await Chan.db.select(
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
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .whereIn("a.cid", ids)
        .where("a.status", 0)
        .orderBy("a.createdAt", "DESC")
        .offset(start)
        .limit(pageSize);

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

  async tags({ path, page = 1, pageSize = 10 }) {
    try {
      if (!path) {
        return { total: 0, current: 1, pageSize: pageSize, list: [] };
      }
      
      const start = (page - 1) * pageSize;
      const dbClient = process.env.DB_CLIENT || 'mysql2';
      
      // 根据数据库类型选择 FIND_IN_SET 的替代方案
      const findInSetCondition = dbClient === 'better-sqlite3'
        ? "INSTR(',' || a.tagId || ',', ',' || t.id || ',') > 0"
        : "FIND_IN_SET(t.id, a.tagId) > 0";

      const totalResult = await Chan.db("cms_article as a")
        .whereExists((qb) => {
          qb.select(Chan.db.raw("1"))
            .from("cms_tag as t")
            .whereRaw(findInSetCondition)
            .where("t.path", path);
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
            .where("t.path", path);
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
        return { ...data, field: {} };
      }

      const tableResult = await Chan.db("cms_model")
        .select("tableName")
        .where("id", modIdResult.mid)
        .first();

      if (!tableResult) {
        return { ...data, field: {} };
      }

      const tableNameStr = tableResult.tableName;
      if (!/^[a-zA-Z0-9_]+$/.test(tableNameStr)) {
        throw new Error("Invalid table name");
      }

      const fieldResult = await Chan.db.select("*")
        .from(tableNameStr)
        .where("aid", id)
        .first();

      return { ...data, field: fieldResult || {} };
    } catch (error) {
      console.error("Error in article():", error);
      return false;
    }
  },

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
