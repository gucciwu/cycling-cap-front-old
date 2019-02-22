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
  appShortName: 'Cycling Cap',
  appDescription: 'Alps Front-end Development Framework',
  appCode: 'alps',
  companyName: 'ALPS Studio',
  copyrightYear: '2018',
  hotline: '11411',
  website: 'http://www.gucciwu.com',
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
  enableCache: false,
};

export const languageSettings = {
  defaultLanguage: 'zh-CN',
  supportedLanguages: ['zh-CN', 'en-US'],
};

export const apiSettings = {
  apiUrl: 'http://127.0.0.1:9080',
  apiDictionaryUrl: '/api/dictionaries',
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
  ignoreLogin: true,
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
  historyAction: {
    namespace: 'historyAction',
    displayName: 'Action',
    url: '/api/history-actions',
    listDataWrap: 'historyActions',
  },
  historyTarget: {
    namespace: 'historyTarget',
    displayName: 'Target',
    url: '/api/history-targets',
    listDataWrap: 'historyTargets',
  },
  historyLog: {
    namespace: 'historyLog',
    displayName: 'Log',
    url: '/api/history-logs',
    listDataWrap: 'historyLogs',
  },
  jessUser: {
    namespace: 'jessUser',
    displayName: 'User',
    url: '/api/users',
    listDataWrap: 'users',
  },
  dictionary: {
    namespace: 'dictionary',
    displayName: 'Dictionary',
    url: '/api/dictionaries',
    listDataWrap: 'dictionaries',
  },
};

export const entitySettings = {
  defaultListDisplay: ['modifiedBy', 'modifiedTime', 'createdBy', 'createdTime'],
  defaultFields: ['id', 'modifiedBy', 'modifiedTime', 'createdBy', 'createdTime', 'deleted'],
};

export const serviceSettings = {
  baiduAccessKey: 'fV1GGhTs7WEuLmUpHL8VU4rwkRwkxz80',
};

export const fakeUser = {
  name: 'Alps Fake',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  userid: '00000001',
  email: 'antdesign@alipay.com',
  signature: '海纳百川，有容乃大',
  title: '交互专家',
  group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
  tags: [
    {
      key: '0',
      label: '很有想法的',
    },
    {
      key: '1',
      label: '专注设计',
    },
    {
      key: '2',
      label: '辣~',
    },
    {
      key: '3',
      label: '大长腿',
    },
    {
      key: '4',
      label: '川妹子',
    },
    {
      key: '5',
      label: '海纳百川',
    },
  ],
  notifyCount: 0,
  unreadCount: 0,
  country: 'China',
  geographic: {
    province: {
      label: '浙江省',
      key: '330000',
    },
    city: {
      label: '杭州市',
      key: '330100',
    },
  },
  address: '西湖区工专路 77 号',
  phone: '0752-268888888',
};
