/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Upload } from 'antd';
import FormItemRenderer from './index';

export default class UploadRenderer extends React.PureComponent {
  render() {
    const { form, instance, field, onChange } = this.props;
    const wrapper = properties => (
      <Upload key={`Element_${field.key || field.property}`} {...properties} />
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
