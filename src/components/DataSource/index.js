/* eslint-disable no-underscore-dangle */
import { stringify } from 'qs';
import request from '../../utils/request';
import store from '../../index';
import { apiSettings } from '../../settings/settings';

export default class DataSource {
  constructor(options) {
    this.dvaModel = options.dvaModel;
    this.url = options.url || undefined;
    this.timeout =  options.timeout || apiSettings.timeout || 3000;
    this.parameters = options.parameter || {};
    this.parser = options.parser && typeof options.parser === 'function' ? options.parser : undefined;
  };
  fetchData = (onLoadingChange) => {
    if (typeof onLoadingChange === 'function') {
      onLoadingChange(true);
    }
    let ret = [];
    const { parameters, dvaModel, url, parser } = this;
    if (dvaModel && dvaModel.namespace && typeof dvaModel.namespace === 'string') {
      ret = store.getState()[dvaModel.namespace][dvaModel.state];
      if (dvaModel.force || !Array.isArray(ret) || ret.length === 0) {
        store.dispatch({
          type: `${dvaModel.namespace}/${dvaModel.action}`,
          payload: parameters,
        });
        setTimeout(() => {
          ret = store.getState()[dvaModel.namespace][dvaModel.state];
        }, this.timeout);
      }
    } else if (url && typeof url === 'string') {
      request(`${url}?${stringify(parameters)}`).then(resp => {
        ret = resp;
        if (parser && typeof parser === 'function') {
          ret = parser(resp);
        }
      });
    }
    if (typeof onLoadingChange === 'function') {
      onLoadingChange(false);
    }
    return ret;
  }
}
