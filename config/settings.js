export const roles = {
  GUEST: 'guest',
  USER: 'user',
  ADMINISTRATOR: 'admin',
  STAFFS: ['admin', 'user'],
  ALL: ['admin', 'guest', 'user'],
};

export const pageFooterLinks = [
  {
    key: 'Alps-Website',
    title: 'Alps Website',
    href: 'http://www.gucciwu.com',
    blankTarget: true,
  },
  {
    key: 'Alps-OA',
    title: 'Alps OA',
    href: 'http://www.gucciwu.com',
    blankTarget: true,
  },
  {
    key: 'hotline',
    title: 'Hotline 95305',
    href: 'tel:95305',
    blankTarget: true,
  },
];

export const generalSettings = {
  homePage: '/system/dictionary',
  appName: 'Alps Front-end Development Framework',
  appShortName: 'ALPS',
  appDescription: 'Alps Front-end Development Framework',
  appCode: 'alps',
  companyName: 'Gucci Wu Studio',
  copyrightYear: '2018',
  hotline: '11411',
  dateFormat: 'YYYYMMDD',
  dateTimeFormat: 'YYYYMMDDHHmmss',
  timeFormat: 'HHmmss',
  showDateFormat: 'YYYY-MM-DD',
  showDateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  showTimeFormat: 'HH:mm:ss',
  pageFooterLinks,
  showPageFooterLinks: true,
  fileUpload: {
    maxSize: 2048, // max file length, KB
    accept: 'image/jpg, image/png, image/jpeg, video/mp4',
  },
  pageSize: 10,
  showDemoTemplateMenu: true, // Include ant design pro build in templates and standard component demos
  enableCache: true,
};

export const languageSettings = {
  defaultLanguage: 'zh-CN',
  supportedLanguages: ['zh-CN', 'en-US'],
};

export const apiSettings = {
  apiUrl: 'http://127.0.0.1:9080',
  timeout: 0, // 0 - unlimited
  enableCors: true,
  corsTargets: '*',
  credentials: 'include', // omit: default，ignore cookie; same-origin: send cookie in same origin，include: send cookie CORS
  responseErrorCodeKey: 'code',
  responseErrorMessageKey: 'errMsg',
  responseDataKey: 'data',
  cleanLastErrorAfterRequestSuccessful: true,
  showResponseErrorAsNotification: true,
  enableSoftDelete: false,
};

export const modules = {
  dictionary: true,
  history: true,
  uis: true,
  user: true,
};

export const loginSettings = {
  ignoreLogin: false,
  loginAgents: {
    uis: {
      loginUrl: '/api/uis/login',
    },
    account: {
      loginUrl: '/api/token/auth',
    },
  },
  enableRegister: false,
  enableForgotPassword: false,
};

export const authenticationSettings = {
  authenticationMethod: 'jwt',
  jwtSessionStorageKey: `${generalSettings.appCode}-jwt`,
  roleSessionStorageKey: `${generalSettings.appCode}-role`,
  defaultRole: roles.ADMINISTRATOR,
};

export const entities = {
  historyAction:  {
    namespace : 'historyAction',
    displayName : 'Action',
    url : '/api/history-actions',
    listDataWrap : 'historyActions',
  },
  historyTarget:  {
    namespace : 'historyTarget',
    displayName : 'Target',
    url : '/api/history-targets',
    listDataWrap : 'historyTargets',
  },
  historyLog:  {
    namespace : 'historyLog',
    displayName : 'Log',
    url : '/api/history-logs',
    listDataWrap : 'historyLogs',
  },
  user:  {
    namespace : 'user',
    displayName : 'User',
    url : '/api/users',
    listDataWrap : 'users',
  },
  dictionary:  {
    namespace : 'dictionary',
    displayName : 'Dictionary',
    url : '/api/dictionaries',
    listDataWrap : 'dictionaries',
  },
};

export const fakeUser = {
  name: 'Alps',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  role: authenticationSettings.defaultRole,
  notifyCount: 0,
};

