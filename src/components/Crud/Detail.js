import React, { PureComponent } from 'react';
import { Card } from 'antd';
import KeyValueDescription from '../KeyValueDescription';
import { getSubObject, isEmpty } from '../../utils/utility';

export default class CrudDetail extends PureComponent {
  state = {
    instance: {},
    entity: {},
    fetching: false,
  };
  componentWillMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    this.fetch(nextProps.instance, nextProps.entity);
  }
  fetch = (newInstance, newEntity) => {
    this.setState({
      fetching: true,
    });
    const { entity, instance } = this.props;
    const currentEntity = newEntity || entity;
    const currentInstance = newInstance || instance;
    this.setState({
      entity: currentEntity,
      instance: currentInstance,
      fetching: false,
    });
  };
  render() {
    const { instance, fetching, entity } = this.state;
    let title = '';
    if (typeof entity.verboseName === 'function') {
      title = entity.verboseName(instance);
    }
    if (entity.displayName) {
      title = `${entity.displayName} - ${title}`;
    }
    if (isEmpty(entity)) {
      return "";
    }
    return (
      <Card loading={fetching || isEmpty(entity)} title={title} style={{marginTop: 24}}>
        <KeyValueDescription
          col={1}
          data={getSubObject(instance, entity.getDetailDisplayFieldProperty().map((item)=>item.property))}
          keyWrap={key => (entity[key] ? entity[key].verboseName : key)}
          valueWrap={(value, key) => entity.getValueRenderByProperty(entity[key])(value, instance)}
        />
      </Card>
    );
  }
}
