import { stringify } from 'qs';
import React from 'react';
import { Select, Spin } from 'antd';
import request from '../../utils/request';
import { getDispatch, getStore, isEmpty } from '../../utils/utility';

const Option = Select.Option;

export default class ListSelect extends React.PureComponent {
  state = {
    options: [],
    loading: false,
  };

  componentDidMount() {
    this.fetchOptions();
  }

  componentWillReceiveProps(nextProps) {
    // force update display value
    if (this.props.namespace !== nextProps.namespace
      || this.props.url !== nextProps.url
      || this.props.choices !== nextProps.choices
      || this.props.dataSource !== nextProps.dataSource
    ) {
      this.fetchOptions(nextProps.namespace, nextProps.url, nextProps.choices, nextProps.dataSource);
    }
  }

  fetchOptions = (newNamespace, newUrl, newChoices, newDataSource) => {
    this.setState({
      loading: true,
      options: [],
    });
    const { filter, dataSource, namespace, url, choices, parsers } = this.props;
    const currentNamespace = newNamespace || namespace;
    const currentUrl = newUrl || url;
    const currentChoices = newChoices || choices;
    const currentDataSource = newDataSource || dataSource;
    if (currentChoices && Array.isArray(currentChoices)) {
      this.setState({
        options: currentChoices,
        loading: false,
      });
    } else if (currentDataSource && Array.isArray(currentDataSource)) {
      this.setState({
        options: currentDataSource,
        loading: false,
      });
    } else if (currentDataSource && typeof currentDataSource === 'function') {
      const opts = currentDataSource(filter);
      this.setState({
        loading: false,
        options: opts,
      });
    } else if (currentNamespace && typeof currentNamespace === 'string') {
      const store = getStore();
      const dispatch = getDispatch();
      if (!isEmpty(store)) {
        const allList = store.getState()[currentNamespace].all;
        if (Array.isArray(allList) && allList.length !== 0) {
          this.setState({
            options: allList,
            loading: false,
          });
        } else {
          dispatch({
            type: `${currentNamespace}/all`,
            payload: filter,
          });
          setTimeout(() => {
            this.setState({
              options: store.getState()[currentNamespace].all,
              loading: false,
            });
          }, 3000);
        }
      } else {
        this.setState({
          loading: false,
          options: [],
        });
      }
    } else if (currentUrl && typeof currentUrl === 'string') {
      request(`${currentUrl}?${stringify(filter)}`).then(resp => {
        let data = resp;
        if (parsers && parsers.response && typeof parsers.response === 'function') {
          data = parsers.response(resp);
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
    const { onChange, choiceValueField, choiceDisplay, multiple, showSearch } = this.props;
    const { options, loading } = this.state;
    const optionRender = (option) => {
      const value = option[choiceValueField] || option.id || option.code || option.name;
      let display = '';
      if (choiceDisplay === undefined || choiceDisplay === null) {
        if (option.name) {
          display = `${option.name} ${option.code ? `(${option.code})` : ''}`
        } else {
          display = option.code || option.name || option.id
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
          { display }
        </Option>
      );
    };
    if (loading) {
      return <Spin><Select style={{width: 200}} /></Spin>;
    } 
      return (
        <Select
          style={{width: 200}}
          mode={multiple ? 'multiple' : 'default'}
          showSearch={showSearch || options.size > 10}
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={onChange}
        >
          {options.map(optionRender)}
        </Select>
      );
    
  }
}
