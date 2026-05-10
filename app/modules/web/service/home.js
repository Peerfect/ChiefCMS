import { helper } from "chanjs";
import common from "./common.js";

import { getApiCalls } from "../utils/index.js";

const { filterFields } = helper;

const home = {
  async init() {
    const config = Chan.config?.data?.init || {};
    const apiCalls = getApiCalls(config, {}, common);

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  // 从栏目列表中获取指定栏目的 dataConfig
  _getCategoryConfig(categoryList, cid) {
    if (!categoryList || !Array.isArray(categoryList)) return null;
    
    const category = typeof cid === 'string' 
      ? categoryList.find(item => item.pinyin === cid)
      : categoryList.find(item => item.id === cid);
      
    if (!category || !category.dataConfig) return null;
    
    const dataConfig = typeof category.dataConfig === 'string' 
      ? JSON.parse(category.dataConfig) 
      : category.dataConfig;
    
    return dataConfig;
  },

  // 首页
  async home(categoryList) {
    let config = Chan.config.data.home;
    
    // 从首页栏目（pinyin=home）获取配置
    const categoryConfig = this._getCategoryConfig(categoryList, 'home');
    if (categoryConfig && Object.keys(categoryConfig).length > 0) {
      config = categoryConfig;
    }
    
    const apiCalls = getApiCalls(config, {}, common);

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  // 列表页
  async list({ cid, page = 1, categoryList }) {
    let config = Chan.config.data.list;
    
    // 从栏目获取配置
    const categoryConfig = this._getCategoryConfig(categoryList, cid);
    if (categoryConfig && Object.keys(categoryConfig).length > 0) {
      config = categoryConfig;
    }
    
    const apiCalls = getApiCalls(
      config,
      {
        cid,
        page,
      },
      common
    );

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  // 文章页
  async article({ id, cid, categoryList }) {
    let config = Chan.config.data.article;
    
    // 从栏目获取配置
    const categoryConfig = this._getCategoryConfig(categoryList, cid);
    if (categoryConfig && Object.keys(categoryConfig).length > 0) {
      config = categoryConfig;
    }
    
    const apiCalls = getApiCalls(
      config,
      {
        id,
        cid,
      },
      common
    );

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  // 单页列表页
  async page({ cid, categoryList }) {
    let config = Chan.config.data.page;
    
    // 从栏目获取配置
    const categoryConfig = this._getCategoryConfig(categoryList, cid);
    if (categoryConfig && Object.keys(categoryConfig).length > 0) {
      config = categoryConfig;
    }

    const apiCalls = getApiCalls(
      config,
      {
        cid,
      },
      common
    );

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  async search({ keywords = "", page = 1 }) {
    const config = Chan.config.data.search;
    const apiCalls = getApiCalls(
      config,
      {
        keywords,
        page,
      },
      common
    );

    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));

    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });

    return resultObject;
  },

  async tag({ path, page = 1 }) {
    const config = Chan.config.data.tags;
    const apiCalls = getApiCalls(
      config,
      {
        path,
        page,
      },
      common
    );
    // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
    let results = await Promise.all(Object.values(apiCalls));
    // 合并结果到一个对象中
    let resultObject = {};
    let keys = Object.keys(apiCalls);
    results.forEach((result, index) => {
      resultObject[keys[index]] = result;
    });
    return resultObject;
  },
};

export default home;
