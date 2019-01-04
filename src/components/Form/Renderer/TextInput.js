/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Input } from 'antd';
import FormItemRenderer from './index';

export default class TextInputRenderer extends React.PureComponent {
  render() {
    const { form, instance, field, onChange } = this.props;
    const wrapper = properties => {
      return <Input key={`Element_${field.key || field.property}`} {...properties} />;
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
