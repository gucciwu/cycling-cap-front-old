import React from 'react';
import { Select, Spin } from 'antd';
import DataSource from '../DataSource';
import { apiSettings } from '../../../config/settings';

const { Option } = Select;

export default class DictionarySelect extends React.PureComponent {
  state = {
    loading: false,
    list: [],
  };

  componentDidMount() {
    this.getList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entry !== this.props.entry) {
      return this.getList(nextProps.entry);
    }
  }

  getList = (newEntry) => {
    this.setState({
      loading: true,
    });
    const { entry } = this.props;
    const dataSource = new DataSource({
      url: `${apiSettings.apiDictionaryUrl}/search/list`,
      parameter: { keyword: newEntry || entry },
      parser: (resp) => {
        return resp && Array.isArray(resp.dictionaries) ? resp.dictionaries : [];
      },
    });
    const data = dataSource.fetchData();
    this.setState({
      list: data || [],
      loading: false,
    });
  };

  render() {
    const { loading, list } = this.state;
    const optionRender = (option) => {
      return (
        <Option key={option.key} value={option.key}>
          {option.value}
        </Option>
      );
    };
    if (loading) {
      return <Spin><Select/></Spin>;
    } else {
      return (
        <Select
          showSearch={list.size > 10}
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {list.map(optionRender)}
        </Select>
      );
    }
  }
}
