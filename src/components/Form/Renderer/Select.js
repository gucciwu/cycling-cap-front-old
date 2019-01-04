/* eslint-disable no-underscore-dangle */
import { stringify } from 'qs';
import React from 'react';
import { Select, Spin } from 'antd';
import FormItemRenderer from './index';
import request from '../../../utils/request';
import { getDispatch, getStore } from '../../../utils/utility';

const Option = Select.Option;

export default class SelectRenderer extends React.PureComponent {
  state = {
    options: [],
    loading: true,
  };

  componentWillMount() {
    this.fetchOptions();
  }

  componentWillReceiveProps(nextProps) {
    // force update display value
    if (typeof this.props.field.equal === 'function' && !this.props.field.equal(nextProps.field)) {
      this.fetchOptions(nextProps.field);
    }
  }

  fetchOptions = newField => {
    this.setState({
      loading: true,
      options: [],
    });
    const field = newField || this.props.field;
    const { filter, dataSource, namespace, url, choices } = field;
    if (choices && Array.isArray(choices)) {
      this.setState({
        options: choices,
        loading: false,
      });
    } else if (dataSource && Array.isArray(dataSource)) {
      this.setState({
        options: dataSource,
        loading: false,
      });
    } else if (dataSource && typeof dataSource === 'function') {
      const opts = dataSource();
      this.setState({
        loading: false,
        options: opts,
      });
    } else if (namespace && typeof namespace === 'string') {
      const store = getStore();
      const dispatch = getDispatch();
      const allList = store.getState()[namespace].all;
      if (Array.isArray(allList) && allList.length !== 0) {
        this.setState({
          options: allList,
          loading: false,
        });
      } else {
        dispatch({
          type: `${namespace}/all`,
          payload: filter,
        });
        setTimeout(() => {
          this.setState({
            options: store.getState()[namespace].all,
            loading: false,
          });
        }, 3000);
      }
    } else if (url && typeof url === 'string') {
      request(`${url}?${stringify(filter)}`).then(resp => {
        let data = resp;
        if (
          field.parsers &&
          field.parsers.response &&
          typeof field.parsers.response === 'function'
        ) {
          data = field.parsers.response(resp);
        }
        if (Array.isArray(data)) {
          this.setState({
            options: data,
            loading: false,
          });
        }
      });
    }
  };

  render() {
    const { form, instance, field, onChange } = this.props;
    const { options, loading } = this.state;
    const optionRender = option => {
      const { choiceValueField, choiceDisplay } = field;
      const value = option[choiceValueField] || option.id || option.code || option.name;
      let display = '';
      if (choiceDisplay === undefined || choiceDisplay === null) {
        if (option.name) {
          display = `${option.name} ${option.code ? `(${option.code})` : ''}`;
        } else {
          display = option.code || option.name || option.id;
        }
      } else if (typeof choiceDisplay === 'function') {
        display = choiceDisplay(option);
      } else if (typeof choiceDisplay === 'string') {
        display = option[choiceDisplay];
      } else {
        display = value;
      }
      return (
        <Option key={value} value={value}>
          {display}
        </Option>
      );
    };
    const wrapper = properties => {
      if (loading) {
        return (
          <Spin>
            <Select />
          </Spin>
        );
      } 
        return (
          <Select
            mode={field.multiple ? 'multiple' : 'default'}
            showSearch={options.size > 10}
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            {...properties}
          >
            {options.map(optionRender)}
          </Select>
        );
      
    };
    return (
      <FormItemRenderer
        form={form}
        instance={instance}
        wrapper={wrapper}
        field={field}
        onChange={onChange}
        loading={loading}
      />
    );
  }
}
