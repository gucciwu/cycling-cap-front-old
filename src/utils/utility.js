/* eslint-disable no-underscore-dangle */
import React from 'react';
import { message } from 'antd';
import { apiSettings, authenticationSettings, modules, roles } from '../../config/settings';


export function getStore() {
  return window.g_app._store
}

export function getDispatch() {
  return window.g_app._store.dispatch
}

export function hasModule(module) {
  let ret = apiSettings.apiBackend;
  if (module) {
    ret = ret && modules[module];
  }
  return ret;
}

export function isEmpty(obj) {
  if (!obj) {
    return true;
  } if ( typeof obj === 'function') {
    return false;
  } if (Array.isArray(obj)) {
    return obj.length === 0;
  } 
    return Object.keys(obj).length === 0;
  
}

/**
 * Convert object to object array
 * {pKey1: {cKey1: value1, cKey2: value2}, pKey2: {cKey1: value3, cKey2: value4}  ...} => [{_index: 'pKey1', cKey1: value1, cKey2, value2}, {_index: 'pKey2', cKey1: value3, cKey2, value4}]
 * */
export function object2Array(obj, indexProperty = '_index') {
  const ret = [];
  for (const property in obj) {
    const curObj = obj[property];
    curObj[indexProperty] = property;
    ret.push(curObj);
  }
  return ret;
}

export function map2Array(obj, keyIndex = '_key', valueIndex = '_value') {
  if (isEmpty(obj)) {
    return [];
  }
  const ret = [];
  let property;
  for (property in obj) {
    const curObj = {};
    curObj[keyIndex] = property;
    curObj[valueIndex] = obj[property];
    ret.push(curObj);
  }
  return ret;
}

export function isImage(suffix) {
  const imageSuffixes = [
    'jpg', 'gif', 'jpeg', 'bmp', 'png',
  ];
  return imageSuffixes.filter(value => value === suffix).length > 0;
}

export function getLastError() {
  const store = getStore();
  return store.getState().global.lastError;
}

export function isHttpPrefix(path) {
  return typeof path === 'string' && (path.indexOf('http://') === 0 || path.indexOf('https://') === 0);
}

export function getSubObject(obj, properties) {
  const ret = {};
  if (isEmpty(obj)) {
    return ret;
  }
  if (!Array.isArray(properties) || properties.length === 0) {
    return ret;
  }
  properties.map((item) => {
    if (obj[item] !== undefined) {
      ret[item] = obj[item];
    }
  });
  return ret;
}

/*
 * Get a record from store by ID
 */
export function getLocalRecord(namespace, id, idField = 'id') {
  if (!namespace || !id) {
    return null;
  }
  const store = getStore();
  const state = store.getState();
  if (!state) {
    return null;
  }
  const { cache } = state[namespace];
  if (Array.isArray(cache) && cache.length > 0) {
    const record = cache.filter((item) => item[idField] === id);
    if (!isEmpty(record)) {
      return record[0];
    }
  }
  const { list } = state[namespace];
  if (Array.isArray(list) && list.length > 0) {
    const record = list.filter((item) => item[idField] === id);
    if (!isEmpty(record)) {
      return record[0];
    }
  }
  const { all } = state[namespace];
  if (Array.isArray(all) && all.length > 0) {
    const record = all.filter((item) => item[idField] === id);
    if (!isEmpty(record)) {
      return record[0];
    }
  }
  return null;
}

/*
 * put a record that fetch from server into cache
 */
export function putCacheRecord(namespace, record) {
  if (!apiSettings.enableCache || !namespace || isEmpty(record)) {
    return;
  }
  const store = getStore();
  const { dispatch } = store;
  dispatch({
    type: `${namespace}/cache`,
    payload: record,
  });
}

export const notice = (action, object, isOK, extra = '') => {
  if (isOK) {
    message.success(
      <span>
        {action}{' '}
        <span style={{ fontWeight: 'bold' }}>{object ? object.code || object.name : ''}</span>{' '}
        成功！
      </span>
    );
  } else {
    message.error(
      <span>
        {action}{' '}
        <span style={{ fontWeight: 'bold' }}>{object ? object.code || object.name : ''}</span>{' '}
        失败！ {extra}
      </span>
    );
  }
};

export function camel2Underline(str) {
  return str.replace(/([A-Z])/g,"_$1").toLowerCase();
}

export function underline2Camel(str) {
  const re=/_(\w)/g;
  return str.replace(re, ($0,$1) => $1.toUpperCase());
}

export function convertKey2Underline(obj) {
  const ret = {};
  if (isEmpty(obj)) return ret;
  Object.keys(obj).map(index => {
    ret[camel2Underline(index)] = obj[index];
  });
  return ret;
}

export function convertKey2Camel(obj) {
  const ret = {};
  if (isEmpty(obj)) return ret;
  Object.keys(obj).map(index => {
    ret[underline2Camel(index)] = obj[index];
  });
  return ret;
}

export function getCurrentUserRole(currentUser) {
  return !isEmpty(currentUser) && currentUser.loginId ? roles.ADMINISTRATOR : authenticationSettings.defaultRole;
}
