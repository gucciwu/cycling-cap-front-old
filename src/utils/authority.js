// use localStorage to store the authority info, which might be sent from server in actual project.

import { authenticationSettings, roles } from '../../config/settings';

export function getAuthority() {
  return sessionStorage.getItem(authenticationSettings.roleSessionStorageKey)
    || authenticationSettings.defaultRole || roles.GUEST;
}

export function setAuthority(authority) {
  return sessionStorage.setItem(authenticationSettings.roleSessionStorageKey,
    authority || authenticationSettings.defaultRole || roles.GUEST);
}

export function getJwtToken() {
  return sessionStorage.getItem(authenticationSettings.jwtSessionStorageKey) || '';
}

export function setJwtToken(token) {
  return sessionStorage.setItem(authenticationSettings.jwtSessionStorageKey, token || '');
}
