// use localStorage to store the authority info, which might be sent from server in actual project.
import { authenticationSettings, roles } from '../../config/settings';

export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined'
      ? localStorage.getItem(authenticationSettings.roleSessionStorageKey)
      : str;
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority || authenticationSettings.defaultRole || roles.GUEST;
}
export function setAuthority(authority) {
  return sessionStorage.setItem(
    authenticationSettings.roleSessionStorageKey,
    authority || authenticationSettings.defaultRole || roles.GUEST
  );
}

export function getJwtToken() {
  return sessionStorage.getItem(authenticationSettings.jwtSessionStorageKey) || '';
}

export function setJwtToken(token) {
  return sessionStorage.setItem(authenticationSettings.jwtSessionStorageKey, token || '');
}
