import { query as queryUsers, queryCurrent } from '@/services/user';
import { authenticationSettings, fakeUser, loginSettings } from '../../config/settings';
import { getCurrentUserRole, isEmpty } from '../utils/utility';
import { setAuthority, setJwtToken } from '../utils/authority';

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
      let role = authenticationSettings.defaultRole;
      let user = action.payload;
      if (action.payload) {
        if (authenticationSettings.authenticationMethod === 'jwt' && action.payload.jwt) {
          setJwtToken(action.payload.jwt);
        }
        user = action.payload.user || user;
        role = action.payload.role || authenticationSettings.defaultRole;
      }
      role = getCurrentUserRole(user) || authenticationSettings.defaultRole;
      setAuthority(role);
      return {
        ...state,
        currentUser: user,
        currentUserRole: role,
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
