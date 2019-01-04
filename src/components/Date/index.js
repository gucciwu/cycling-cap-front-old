import React from 'react';
import * as moment from 'moment';
import { Popover } from 'antd';
import { generalSettings } from '../../../config/settings';


export const fromNow = time => {
  return (
    <Popover content={time}>
      <span>{moment(time).fromNow()}</span>
    </Popover>
  );
};

export const getDate = date => {
  if (date && typeof date !== 'string') {
    date = date.toString();
  }
  return date ? moment(date.substr(0, 8), generalSettings.dateFormat) : null;
};

export const getDateTime = dateTime => {
  if (dateTime && typeof dateTime !== 'string') {
    dateTime = dateTime.toString();
  }
  return dateTime ? moment(dateTime.substr(0, 14), generalSettings.dateTimeFormat) : null;
};

export const getTime = time => {
  if (time && typeof time !== 'string') {
    time = time.toString();
  }
  return time ? moment(time.substr(0, 8), generalSettings.timeFormat) : null;
};

export const getNow = (format = generalSettings.dateTimeFormat) => {
  return moment(new Date(), format);
};
