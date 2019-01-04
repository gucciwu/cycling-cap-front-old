/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Form, Row } from 'antd';
import { isEmpty } from '../../utils/utility';
import SelectRenderer from './Renderer/Select';

export default class ModelForm extends React.Component {
  formItemRender = (field) => {
    const { instance, form, onChange, entity } = this.props;
    const ItemRender = Array.isArray(field.choices) ? SelectRenderer : field.renderer ;
    return (
      <ItemRender
        key={field.property}
        form={form}
        instance={instance}
        onChange={onChange}
        field={field}
        entity={entity}
      />
    );
  };

  render() {
    const { entity } = this.props;
    const properties = entity.getFormDisplayFieldProperty();
    return (
      <Form>
        <Row>
          { properties.filter(item => !isEmpty(item)).map(this.formItemRender) }
        </Row>
      </Form>
    );
  }
}
