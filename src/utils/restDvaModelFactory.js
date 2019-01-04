/* eslint-disable no-underscore-dangle */
import { stringify } from 'qs';
import { fetchOne, list, create, remove, update, methods } from '../services/rest';
import { getLastError, isEmpty, notice } from './utility';
import { apiSettings, generalSettings } from '../../config/settings';

export default function(entity) {
  const url = entity._url;
  const listDataWrap = entity._listDataWrap;
  return {
    state: {
      list: [],
      pagination: {},
      current: {},
      methods: [],
    },
    effects: {
      * list(payload, { call, put }) {
        const page = payload.payload && payload.payload.pagination && payload.payload.pagination.current ? payload.payload.pagination.current - 1 : 0;
        const size = payload.payload && payload.payload.pagination && payload.payload.pagination.pageSize ? payload.payload.pagination.pageSize : generalSettings.pageSize;
        const sort = payload.payload && payload.payload.sorter && !isEmpty(payload.payload.sorter) ? `${payload.payload.sorter.field},${payload.payload.sorter.order === 'descend' ? 'desc' : 'asc'}` : '';
        const search = payload.payload && !isEmpty(payload.payload.search) ? payload.payload.search : {};
        const pagination = { page, size, sort };
        let address = '';
        if (!isEmpty(search)) {
          if (typeof search.keyword === 'string') {
            address = `${url}/search/${search.field}?keyword=${search.keyword}&${stringify(pagination)}`;
          } else if (Array.isArray(search.keyword)) {
            address = `${url}/search/${search.field}?keyword=${search.keyword}&${stringify(pagination)}`;
          } else {
            address = `${url}/search/${search.field}?${stringify(search.keyword)}&${stringify(pagination)}`;
          }
        } else if (apiSettings.enableSoftDelete) {
          address = `${`${url}/search/all?`}${stringify(pagination)}`;
        } else {
          address = `${url  }?${  stringify(pagination)}`;
        }
        const response = yield call(list, { url: address });
        yield put({
          type: 'saveList',
          payload: response,
        });
      },
      * create(payload, { call, put }) {
        const object = payload.payload.body;
        object.id = { market: object.market, stkcode: object.stkcode };
        const response = yield call(create, { body: object, url });
        const lastError = getLastError();
        if (isEmpty(lastError) || lastError.code === 0) {
          yield put({
            type: 'appendList',
            payload: response,
          });
          notice('新增', response, true);
        } else {
          notice('新增', response, false, lastError.message);
        }
      },
      * fetchOne(payload, { call, put }) {
        const response = yield call(fetchOne, { url: payload.payload.url || `${url}/${payload.payload.id}` });
        yield put({
          type: 'saveCurrent',
          payload: response,
        });
      },
      * update(payload, { call, put }) {
        const response = yield call(update,
          { url: payload.payload.original._links.self.href, body: payload.payload.body });
        yield put({
          type: 'saveCurrent',
          payload: response,
        });
        const lastError = getLastError();
        if (isEmpty(lastError) || lastError.code === 0) {
          yield put({
            type: 'updateRecord',
            payload: response,
          });
          notice('修改', payload.payload.original, true);
        } else {
          notice('修改', payload.payload.original, false, lastError.message);
        }
      },
      * delete(payload, { call, put }) {
        if (apiSettings.enableSoftDelete) {
          payload.payload.deleted = true;
          yield call(update, { url: payload.payload._links.self.href, body: payload.payload });
        } else {
          yield call(remove, { url: payload.payload._links.self.href });
        }
        const lastError = getLastError();
        if (isEmpty(lastError) || lastError.code === 0) {
          yield put({
            type: 'removeRecord',
            payload: payload.payload,
          });
          notice('删除', payload.payload, true);
        } else {
          notice('删除', payload.payload, false, lastError.message);
        }
      },
      * methods(payload, { call, put }) {
        const response = yield call(methods, payload);
        yield put({
          type: 'saveMethods',
          payload: response,
        });
      },
    },

    reducers: {
      saveList(state, action) {
        return {
          ...state,
          list: action.payload ? action.payload._embedded[listDataWrap] : [],
          pagination: action.payload && action.payload.page ? {
            total: action.payload.page.totalElements,
            pageSize: action.payload.page.size,
            current: parseInt(action.payload.page.number, 10) + 1 || 1,
            showSizeChanger: true,
          } : {},
        };
      },
      saveCurrent(state, action) {
        return {
          ...state,
          current: action.payload,
        };
      },
      appendList(state, action) {
        return {
          ...state,
          list: [action.payload].concat(state.list),
        };
      },
      removeRecord(state, action) {
        return {
          ...state,
          list: state.list.filter(obj => obj._links.self.href !== action.payload._links.self.href),
        };
      },
      updateRecord(state, action) {
        const newList = state.list.map((item) => {
          if (item._links.self.href === action.payload._links.self.href) {
            return action.payload;
          } else {
            return item;
          }
        });
        return {
          ...state,
          list: newList,
        };
      },
      saveMethods(state, action) {
        return {
          ...state,
          methods: action.payload,
        };
      },
    },
  };
}
