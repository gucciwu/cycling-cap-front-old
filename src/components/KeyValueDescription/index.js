import React, { PureComponent } from 'react';
import DescriptionList from '../DescriptionList';
import { map2Array } from '../../utils/utility';

const { Description } = DescriptionList;
/**
 * Wrap object as DescriptionList
 * @param data {key1: value1, key2: value2} or [{key1: value1}, {key2: value2}]
 */
export default class KeyValueDescription extends PureComponent {
  render() {
    const { col = 4, size, title, data, keyIndex,
      valueIndex, keyWrap, valueWrap, style = {} } = this.props;
    if (typeof data === 'string') {
      return (
        <DescriptionList col={1} title={title}>
          <Description term="">
            {data}
          </Description>
        </DescriptionList>
      );
    }
    let arrayData = data;
    const key = keyIndex || '_key';
    const value = valueIndex || '_value';
    if (!Array.isArray(data)) {
      arrayData = map2Array(data, keyIndex, valueIndex);
    }
    // drop not support item
    arrayData = arrayData.filter(item => item[value] !== undefined && typeof item[value] !== 'object' && !Array.isArray(item[value]));

    const itemRender = (item) => {
      return (
        <Description key={item[key]} term={keyWrap && typeof keyWrap === 'function' ? keyWrap(item[key]) : item[key].toString()}>
          {valueWrap && typeof valueWrap === 'function' ? valueWrap(item[value], item[key]) : item[value].toString()}
        </Description>
      );
    };
    return (
      <DescriptionList style={style} title={title} size={size || 'small'} col={col}>
        { arrayData.map(itemRender) }
      </DescriptionList>
    );
  }
}
