/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Radio } from 'antd';
import FormItemRenderer from './index';

export default class RadioRenderer extends React.PureComponent {
  render() {
    const { form, instance, field, onChange } = this.props;
    const wrapper = properties => (
      <Radio key={`Element_${field.key || field.property}`} {...properties} />
    );
    return (
      <FormItemRenderer
        form={form}
        instance={instance}
        wrapper={wrapper}
        field={field}
        onChange={onChange}
      />
    );
  }
}
