/* eslint-disable no-underscore-dangle */
import React from 'react';
import { DatePicker } from 'antd';
import FormItemRenderer from './index';
import { getDate, getNow } from '../../Date';
import { isEmpty } from '../../../utils/utility';
import { generalSettings } from '../../../../config/settings';


export default class DatePickerRenderer extends React.PureComponent {
  render() {
    const { form, instance, field, onChange } = this.props;
    const wrapper = properties => (
      <DatePicker
        key={`Element_${field.key || field.property}`}
        format={generalSettings.showDateFormat}
        {...properties}
      />
    );
    let initialValue = null;
    if (isEmpty(instance)) {
      if (field.autoNow) {
        initialValue = getNow(generalSettings.dateFormat);
      }
    } else {
      initialValue = getDate(instance[field.property]);
    }
    return (
      <FormItemRenderer
        form={form}
        instance={instance}
        wrapper={wrapper}
        initialValue={initialValue}
        onChange={onChange}
        field={field}
      />
    );
  }
}
