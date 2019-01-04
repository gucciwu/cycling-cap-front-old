/* eslint-disable camelcase,no-underscore-dangle */
import React from 'react';
import { Form } from 'antd';
import { isEmpty } from '../../../utils/utility';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export default class FormItemRenderer extends React.PureComponent {
  render() {
    const {
      form,
      instance,
      onChange,
      wrapper,
      initialValue,
      field,
      valuePropName = 'value',
    } = this.props;
    const isNew = isEmpty(instance);
    const { getFieldDecorator } = form;
    const name = field.name || field.property;
    // rules
    const rules = [];
    if (field.allowBlank === false) {
      rules.push({ required: true, message: `${field.verboseName}不能为空` });
    }
    if (field.maxLength) {
      rules.push({
        max: field.maxLength,
        message: `${field.verboseName}不能超过${field.maxLength}个字符`,
      });
    }
    if (field.minLength) {
      rules.push({
        min: field.minLength,
        message: `${field.verboseName}不能少于${field.minLength}个字符`,
      });
    }
    if (field.length) {
      rules.push({ len: field.length, message: `${field.verboseName}必须为${field.length}个字符` });
    }
    rules.concat(field.rules);
    let value = '';
    if (initialValue !== undefined) {
      value = initialValue;
    } else if (instance[field.property] !== undefined) {
      value = instance[field.property];
    } else if (field.defaultValue !== undefined) {
      value = field.defaultValue;
    }
    return (
      <Form.Item
        {...formItemLayout}
        label={field.label || field.verboseName}
        key={`FormItem_${field.key || field.property}`}
      >
        {getFieldDecorator(name, {
          rules,
          initialValue: value,
          valuePropName: valuePropName || 'value',
        })(
          wrapper({
            disabled: isNew ? !field.creatable : !field.editable,
            placeholder: field.helpText,
            onChange,
          })
        )}
      </Form.Item>
    );
  }
}
