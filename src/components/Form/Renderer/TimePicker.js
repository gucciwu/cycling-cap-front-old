/* eslint-disable no-underscore-dangle */
import React from 'react';
import { TimePicker } from 'antd';
import FormItemRenderer from './index';
import { getNow, getTime } from '../../Date';
import { isEmpty } from '../../../utils/utility';
import { generalSettings } from '../../../../config/settings';

export default class TimePickerRenderer extends React.PureComponent {
  render() {
    const { form, instance, field, onChange } = this.props;
    const wrapper = properties => (
      <TimePicker
        key={`Element_${field.key || field.property}`}
        format={generalSettings.showTimeFormat}
        {...properties}
      />
    );
    let initialValue = null;
    if (isEmpty(instance)) {
      if (field.autoNow) {
        initialValue = getNow(generalSettings.timeFormat);
      }
    } else {
      initialValue = getTime(instance[field.property]);
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
