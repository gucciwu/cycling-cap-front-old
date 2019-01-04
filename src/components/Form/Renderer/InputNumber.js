/* eslint-disable no-underscore-dangle */
import React from 'react';
import { InputNumber } from 'antd';
import FormItemRenderer from './index';

export default class InputNumberRenderer extends React.PureComponent {
  render() {
    const { form, instance, field, onChange } = this.props;
    const wrapper = properties => {
      const extraProperties = {};
      if (field.formatter && typeof field.formatter === 'function') {
        extraProperties.formatter = field.formatter;
      }
      if (field.parser && typeof field.parser === 'function') {
        extraProperties.parser = field.parser;
      }
      if (field.max && typeof field.max === 'number') {
        extraProperties.max = field.max;
      }
      if (field.min && typeof field.min === 'number') {
        extraProperties.min = field.min;
      }
      if (field.precision && typeof field.precision === 'number') {
        extraProperties.precision = field.precision;
      }
      return (
        <InputNumber
          key={`Element_${field.key || field.property}`}
          {...properties}
          {...extraProperties}
        />
      );
    };
    return (
      <FormItemRenderer
        form={form}
        instance={instance}
        onChange={onChange}
        wrapper={wrapper}
        field={field}
      />
    );
  }
}
