import { query as queryUsers, queryCurrent } from '@/services/user';
import { fakeUser, loginSettings } from '../../config/settings';
import { isEmpty } from '../utils/utility';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      let currentUser = fakeUser;
      if (!loginSettings.ignoreLogin) {
        const response = yield call(queryCurrent);
        currentUser = isEmpty(response) ? fakeUser : response;
      }
      yield put({
        type: 'saveCurrentUser',
        payload: currentUser,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
