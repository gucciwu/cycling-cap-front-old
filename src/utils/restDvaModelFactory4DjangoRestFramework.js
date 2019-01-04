/* eslint-disable no-underscore-dangle,max-len */
import { stringify } from 'qs';
import { fetchOne, list, create, remove, update, methods } from '../services/rest';
import { convertKey2Camel, convertKey2Underline, getLastError, isEmpty, notice } from './utility';
import { apiSettings, generalSettings } from '../../config/settings';

function getListFromResponse(resp) {
  return isEmpty(resp) ? [] : resp.results;
}

export default function(entity) {
  const { url } = entity;
  return {
    state: {
      list: [],
      all: [],
      cache: [],
      pagination: {},
      current: {},
      methods: [],
    },
    effects: {
      *list(payload, { call, put }) {
        const page =
          payload.payload && payload.payload.pagination && payload.payload.pagination.current
            ? payload.payload.pagination.current
            : 1;
        const size =
          payload.payload && payload.payload.pagination && payload.payload.pagination.pageSize
            ? payload.payload.pagination.pageSize
            : generalSettings.pageSize;
        const sort =
          payload.payload && payload.payload.sorter && !isEmpty(payload.payload.sorter)
            ? `${payload.payload.sorter.field},${
              payload.payload.sorter.order === 'descend' ? 'desc' : 'asc'
              }`
            : '';
        const search =
          payload.payload && !isEmpty(payload.payload.search) ? payload.payload.search : {};
        const pagination = { page, size, sort };
        let address = '';
        if (!isEmpty(search)) {
          if (typeof search.keyword === 'string') {
            address = `${url}/search/${search.field}?keyword=${search.keyword}&${stringify(
              pagination
            )}`;
          } else if (Array.isArray(search.keyword)) {
            address = `${url}/search/${search.field}?keyword=${search.keyword}&${stringify(
              pagination
            )}`;
          } else {
            address = `${url}/search/${search.field}?${stringify(search.keyword)}&${stringify(
              pagination
            )}`;
          }
        } else if (apiSettings.enableSoftDelete) {
          address = `${`${url}/search/all?`}${stringify(pagination)}`;
        } else {
          address = `${url}?${stringify(pagination)}`;
        }
        const response = yield call(list, { url: address });
        const respList = getListFromResponse(response);
        yield put({
          type: 'saveList',
          payload: { list: respList, pagination: response.page },
        });
        yield apiSettings.enableCache &&
        put({
          type: 'updateCache',
          payload: respList,
        });
      },
      *all(payload, { call, put }) {
        const response = yield call(list, { url });
        if (isEmpty(response) || isEmpty(response.page)) {
          yield put({
            type: 'saveAll',
            payload: [],
          });
        } else {
          const responseAll = yield call(list, {
            url: `${url}?${stringify({ size: response.page.totalElements })}`,
          });
          const respList = getListFromResponse(responseAll);
          yield put({
            type: 'saveAll',
            payload: respList,
          });
          yield apiSettings.enableCache &&
          put({
            type: 'updateCache',
            payload: respList,
          });
        }
      },
      *create(payload, { call, put }) {
        const { body } = payload.payload;
        const response = yield call(create, { body: convertKey2Underline(body), url });
        const lastError = getLastError();
        if (isEmpty(lastError) || lastError.code === 0) {
          yield put({
            type: 'appendList',
            payload: response,
          });
          notice('新增', response, true);
          yield apiSettings.enableCache &&
          put({
            type: 'updateCache',
            payload: response,
          });
        } else {
          notice('新增', response, false, lastError.message);
        }
      },
      *fetch(payload, { call, put }) {
        const response = yield call(fetchOne, {
          url: payload.payload.url,
        });
        yield put({
          type: 'saveCurrent',
          payload: response,
        });
        yield apiSettings.enableCache &&
        put({
          type: 'updateCache',
          payload: response,
        });
      },
      *update(payload, { call, put }) {
        const response = yield call(update, {
          url: payload.payload.original.url,
          body: payload.payload.body,
        });
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
          yield apiSettings.enableCache &&
          put({
            type: 'updateCache',
            payload: response,
          });
        } else {
          notice('修改', payload.payload.original, false, lastError.message);
        }
      },
      *delete(payload, { call, put }) {
        const record = payload.payload;
        if (apiSettings.enableSoftDelete) {
          record.deleted = true;
          yield call(update, { url: record.url, body: record });
        } else {
          yield call(remove, { url: record.url });
        }
        const lastError = getLastError();
        if (isEmpty(lastError) || lastError.code === 0) {
          yield put({
            type: 'removeRecord',
            payload: record,
          });
          notice('删除', record, true);
        } else {
          notice('删除', record, false, lastError.message);
        }
      },
      *cache(payload, { put }) {
        yield apiSettings.enableCache &&
        put({
          type: 'updateCache',
          payload: payload.payload,
        });
      },
      *methods(payload, { call, put }) {
        const response = yield call(methods, payload);
        yield put({
          type: 'saveMethods',
          payload: response,
        });
      },
    },

    reducers: {
      saveList(state, action) {
        let saveList = action.payload.list || [];
        saveList = saveList.map(item=>convertKey2Camel(item));
        return {
          ...state,
          list: saveList,
          pagination: action.payload.pagination
            ? {
              total: action.payload.pagination.totalElements,
              pageSize: action.payload.pagination.size,
              current: parseInt(action.payload.pagination.number, 10) + 1 || 1,
              showSizeChanger: true,
            }
            : {},
        };
      },
      saveAll(state, action) {
        let saveList = action.payload || [];
        saveList = saveList.map(item=>convertKey2Camel(item));
        return {
          ...state,
          all: saveList,
        };
      },
      saveCurrent(state, action) {
        const record = convertKey2Camel(action.payload);
        return {
          ...state,
          current: record,
        };
      },
      appendList(state, action) {
        const currentList = state.list;
        // drop the last one when current list size > page size , then put the new record in ahead
        if (currentList.length >= state.pagination.size) {
          currentList.pop();
        }
        const record = convertKey2Camel(action.payload);
        return {
          ...state,
          list: [record].concat(currentList),
        };
      },
      removeRecord(state, action) {
        return {
          ...state,
          list: state.list.filter(obj => obj.url !== action.payload.url),
          cache: apiSettings.enableCache
            ? state.cache.filter(obj => obj.url !== action.payload.url)
            : [],
        };
      },
      updateRecord(state, action) {
        const record = convertKey2Camel(action.payload);
        const newList = state.list.map(item => {
          if (item.url === record.url) {
            return record;
          } else {
            return item;
          }
        });
        return {
          ...state,
          list: newList,
        };
      },
      updateCache(state, action) {
        let records = action.payload;
        if (!isEmpty(records)) {
          if (!Array.isArray(records)) {
            records = [records];
          }
          records = records.map(item=>convertKey2Camel(item));
          if (isEmpty(state.cache)) {
            return {
              ...state,
              cache: records,
            };
          }
          const recordIds = records.map(record => record.url);
          const keepList = state.cache.filter(item => !recordIds.includes(item.url));
          return {
            ...state,
            cache: records.concat(keepList),
          };
        } else {
          return {
            ...state,
          };
        }
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
