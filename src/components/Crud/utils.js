/* eslint-disable no-underscore-dangle */
import * as moment from 'moment';
import { BooleanField, DateField, DateTimeField, TimeField } from '../Entity/Field';
import { generalSettings } from '../../../config/settings';


export default function cleanValues(original = null, newOne, entity) {
  const ret = {};
  entity._fields.filter((item) => {
    const field = entity[item];
    let newValue = newOne[item];

    if (field instanceof BooleanField) {
      newValue = !!newValue;
    }
    if (newValue instanceof moment) {
      if (field instanceof DateTimeField) {
        newValue = newValue.format(generalSettings.dateTimeFormat);
      } else if (field instanceof DateField) {
        newValue = newValue.format(generalSettings.dateFormat);
      } else if (field instanceof TimeField) {
        newValue = newValue.format(generalSettings.timeFormat);
      }
    }
    ret[item] = newValue;
  });
  return ret;
}
