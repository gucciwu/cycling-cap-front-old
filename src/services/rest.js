import { stringify } from 'qs';
import request from '../utils/request';

export async function list(parameters) {
  return request(`${parameters.url}?${stringify(parameters.pagination)}${stringify(parameters.filter)}`, { method: 'GET' });
}

export async function fetchOne(parameter) {
  return request(parameter.url, { method: 'GET' });
}

export async function update(parameter) {
  return request(parameter.url, { method: 'PUT', body: parameter.body });
}

export async function create(parameters) {
  return request(`${parameters.url}/`, { method: 'POST', body: parameters.body });
}

export async function remove(parameter) {
  return request(parameter.url, { method: 'DELETE' });
}

export async function methods(parameter) {
  return request(parameter, { method: 'OPTIONS' });
}
