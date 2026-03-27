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

  // 首页
  async home() {
    const config = Chan.config.data.home;
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
  async list({ cid, page = 1 }) {
    const config = Chan.config.data.list;
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
  async article({ id, cid }) {
    const config = Chan.config.data.article;
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
  async page({ cid }) {
    const config = Chan.config.data.page;

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
