/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Checkbox } from 'antd';
import FormItemRenderer from './index';

export default class CheckboxRenderer extends React.PureComponent {
  render() {
    const { form, instance, field, onChange } = this.props;
    const wrapper = properties => (
      <Checkbox key={`Element_${field.key || field.property}`} {...properties} />
    );
    return (
      <FormItemRenderer
        form={form}
        instance={instance}
        wrapper={wrapper}
        onChange={onChange}
        field={field}
        valuePropName="checked"
      />
    );
  }
}
