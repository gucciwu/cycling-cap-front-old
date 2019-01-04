/* eslint-disable no-underscore-dangle */
import React from 'react';
import { DatePicker } from 'antd';
import FormItemRenderer from './index';
import { getDateTime, getNow } from '../../Date';
import { isEmpty } from '../../../utils/utility';
import { generalSettings } from '../../../../config/settings';


export default class DateTimePickerRenderer extends React.PureComponent {
  render() {
    const { form, instance, field, onChange } = this.props;
    const wrapper = properties => (
      <DatePicker
        key={`Element_${field.key || field.property}`}
        format={generalSettings.showDateTimeFormat}
        showTime
        {...properties}
      />
    );
    let initialValue = null;
    if (isEmpty(instance)) {
      if (field.autoNow) {
        initialValue = getNow(generalSettings.dateTimeFormat);
      }
    } else {
      initialValue = getDateTime(instance[field.property]);
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
