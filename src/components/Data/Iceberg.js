import React from 'react';
import { Card, Button, Modal } from 'antd';
import request from '../../utils/request';
import { getLocalRecord, getSubObject, isEmpty, putCacheRecord } from '../../utils/utility';
import KeyValueDescription from '../KeyValueDescription';
import { apiSettings } from '../../../config/settings';


export default class Iceberg extends React.PureComponent {
  state={
    data: {},
    topValue: "",
    loading: false,
    bodyModalVisible: false,
  };

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    // force update display value
    if (nextProps.url !== this.props.url) {
      this.getData(nextProps.url, nextProps.id);
    }
  }

  getData = (newUrl, newId, showBody) => {
    this.setState({
      loading: true,
    });
    const { url, id, entity } = this.props;
    const finalUrl = newUrl || url;
    const finalId = newId || id;
    let hasData = false;
    // Get cache data first
    if (apiSettings.enableCache && !isEmpty(entity) && finalId) {
      // get record form store
      const rawData = getLocalRecord(entity.namespace, finalId);
      if (!isEmpty(rawData)) {
        hasData = true;
        this.parseData(rawData);
      }
    }
    if (!hasData && finalUrl && typeof finalUrl === 'string') {
      request(`${finalUrl}`).then((resp) => {
        if (resp) {
          putCacheRecord(entity.namespace, resp);
          this.parseData(resp);
        } else {
          this.setState({
            topValue: '',
            data: {},
            loading: false,
          });
        }
      });
    }
    if (showBody) {
      this.setState({
        bodyModalVisible: true,
      });
    }
  };

  parseData = (rawData) => {
    const { topField, bodyFields, parser } = this.props;
    let data;
    if (typeof parser === 'function') {
      data = parser(rawData);
    } else {
      data = rawData;
    }
    const topValue = data[topField] || data.name || data.code || data.id;
    if (bodyFields && (typeof bodyFields === 'string' || Array.isArray(bodyFields))) {
      data = getSubObject(data, bodyFields);
    }
    this.setState({
      topValue,
      data,
      loading: false,
    });
  };

  showBody = () => {
    this.getData(null, null, true);
  };

  render() {
    const { topValue, data, loading, bodyModalVisible } = this.state;
    const { topRender, bodyRender, entity } = this.props;
    let topShow;
    let bodyShow;
    let finalTopValue = topValue;
    if (entity.verboseName && typeof entity.verboseName === 'function' && !isEmpty(data)) {
      finalTopValue = entity.verboseName(data);
    }
    if (typeof topRender === 'function') {
      topShow = topRender(finalTopValue, this.showBody);
    } else {
      topShow = (<a onClick={this.showBody}>{ finalTopValue }</a>);
    }
    if (typeof bodyRender === 'function') {
      bodyShow = bodyRender(data);
    } else if (!isEmpty(entity)) {
      bodyShow = (
        <Card loading={loading} title={finalTopValue} style={{marginTop: 24}}>
          <KeyValueDescription
            col={1}
            // eslint-disable-next-line no-underscore-dangle
            data={getSubObject(data, entity.getDetailDisplayFieldProperty().map((item)=>item.property))}
            keyWrap={key => (entity[key] ? entity[key].verboseName : key)}
            valueWrap={(value, key) => entity.getValueRenderByProperty(entity[key])(value, data)}
          />
        </Card>
      );
    } else {
      bodyShow = <span>nobody</span>
    }
    return (
      <div>
        { topShow }
        <Modal
          key="bodyModal"
          onCancel={() => this.setState({ bodyModalVisible: false })}
          visible={bodyModalVisible}
          footer={[
            <Button key="close-detail" type="primary" onClick={() => this.setState({ bodyModalVisible: false })}>
              关闭
            </Button>,
          ]}
        >
          { bodyShow }
        </Modal>
      </div>
    );
  }
}
