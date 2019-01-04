/* eslint-disable camelcase,no-underscore-dangle,max-len */
import CheckboxRenderer from '../Form/Renderer/Checkbox';
import TextInputRenderer from '../Form/Renderer/TextInput';
import DatePickerRenderer from '../Form/Renderer/DatePicker';
import DateTimePickerRenderer from '../Form/Renderer/DateTimePicker';
import InputNumberRenderer from '../Form/Renderer/InputNumber';
import UploadRenderer from '../Form/Renderer/Upload';
import TextAreaRenderer from '../Form/Renderer/TextArea';
import TimePickerRenderer from '../Form/Renderer/TimePicker';
import SelectRenderer from '../Form/Renderer/Select';

export class Field {
  constructor(options) {
    this.allowBlank = options.allowBlank === undefined ? true : options.allowBlank;
    this.choices = options.choices === undefined ? null : options.choices;
    this.choiceValueField = options.choiceValueField === undefined ? null : options.choiceValueField;
    this.choiceDisplay = options.choiceDisplay === undefined ? null : options.choiceDisplay;
    this.multiple = options.multiple === undefined ? null : options.multiple;
    this.defaultValue = options.defaultValue === undefined ? null : options.defaultValue; // "default" in django.db.models.fields
    this.editable = options.editable === undefined ? true : options.editable; // Can be edit in modify
    this.creatable = options.creatable === undefined ? true : options.creatable; // Can be edit in create
    this.helpText = options.helpText === undefined ? null : options.helpText;
    this.primaryKey = options.primaryKey === undefined ? null : options.primaryKey;
    this.verboseName = options.verboseName === undefined ? null : options.verboseName;
    this.rules = options.rules === undefined ? [] : options.rules;
    this.hide = options.hide === undefined ? false : options.hide;
    this.renderer = options.renderer === undefined ? null : options.renderer;
    this.valueRender =
      options.valueRender === undefined ? null : options.valueRender;
    this.property = options.property === undefined ? null : options.property;
  }
}

export class BooleanField extends Field {
  constructor(options) {
    super(options);
    this.renderer = options.renderer ? options.renderer : CheckboxRenderer;
  }
}

export class CharField extends Field {
  constructor(options) {
    super(options);
    this.maxLength = options.maxLength === undefined ? null : options.maxLength;
    this.minLength = options.minLength === undefined ? null : options.minLength;
    this.length = options.length === undefined ? null : options.length;
    this.rules.push({ type: 'string', message: '请输入有效的字符串' });
    this.renderer = options.renderer ? options.renderer : TextInputRenderer;
  }
}

export class DateField extends Field {
  constructor(options) {
    super(options);
    this.autoNow = options.autoNow === undefined ? null : options.autoNow;
    this.rules.push({ type: 'date', message: '请输入有效的日期' });
    this.renderer = options.renderer ? options.renderer : DatePickerRenderer;
  }
}

export class DateTimeField extends Field {
  constructor(options) {
    super(options);
    this.autoNow = options.autoNow === undefined ? null : options.autoNow;
    this.rules.push({ type: 'date', message: '请输入有效的日期' });
    this.renderer = options.renderer ? options.renderer : DateTimePickerRenderer;
  }
}

export class NumberField extends Field{
  constructor(options) {
    super(options);
    this.rules.push({ type: 'number', message: '请输入有效的数字' });
    this.renderer = options.renderer ? options.renderer : InputNumberRenderer;
    this.min = options.min ? options.min : null;
    this.max = options.max ? options.max : null;
    this.formatter = options.formatter ? options.formatter : null;
    this.parser = options.parser ? options.parser : null;
  }
}

export class IntegerField extends NumberField {
  constructor(options) {
    super(options);
    this.rules.push({ type: 'integer', message: '请输入有效的整数' });
    this.step = options.step ? options.step : 1;
    this.precision = 0;
  }
}

export class FloatField extends NumberField {
  constructor(options) {
    super(options);
    this.precision = options.precision ? options.precision : 2;
    this.step = options.step ? options.step : 0.01;
  }
}

export class PercentField extends FloatField {
  constructor(options) {
    super(options);
    this.step = options.step ? options.step : 1;
    this.precision = options.precision ? options.precision : 0;
    this.formatter = options.formatter ? options.formatter : (value) => (`${value}%`);
    this.parser = options.parser ? options.parser : (value) => (value.replace('%', ''));
  }
}

export class PriceField extends FloatField {
  constructor(options) {
    super(options);
    this.formatter = options.formatter ? options.formatter : (value) => (`${this.prefix ? this.prefix : '$'}${value}`);
    this.parser = options.parser ? options.parser : (value) => (value.replace(this.prefix ? this.prefix : '$', ''));
  }
}

export class EmailField extends CharField {
  constructor(options) {
    super(options);
    this.maxLength = 254;
    this.rules.push({ type: 'email', message: '请输入有效的Email地址' });
    this.renderer = options.renderer ? options.renderer : TextInputRenderer;
  }
}

export class FileField extends Field {
  constructor(options) {
    super(options);
    this.primaryKey = false;
    this.renderer = options.renderer ? options.renderer : UploadRenderer;
  }
}

export class FilePathField extends Field {
  constructor(options) {
    super(options);
    this.path = options.path === undefined ? null : options.path;
    this.match = options.match === undefined ? null : options.match;
    this.recursive = options.recursive === undefined ? null : options.recursive;
    this.maxLength = options.maxLength === undefined ? 100 : options.maxLength;
    this.renderer = options.renderer ? options.renderer : TextInputRenderer;
  }
}

export class ImageField extends Field {
  constructor(options) {
    super(options);
    this.renderer = options.renderer ? options.renderer : UploadRenderer;
  }
}

export class GenericIPAddressField extends Field {
  constructor(options) {
    super(options);
    this.renderer = options.renderer ? options.renderer : TextInputRenderer;
  }
}

export class TextField extends Field {
  constructor(options) {
    super(options);
    this.maxLength = options.maxLength === undefined ? null : options.maxLength;
    this.minLength = options.minLength === undefined ? null : options.minLength;
    this.length = options.length === undefined ? null : options.length;
    this.rules.push({ type: 'string', message: '请输入有效的字符串' });
    this.renderer = options.renderer ? options.renderer : TextAreaRenderer;
  }
}

export class TimeField extends DateTimeField {
  constructor(options) {
    super(options);
    this.renderer = options.renderer ? options.renderer : TimePickerRenderer;
  }
}

export class URLField extends Field {
  constructor(options) {
    super(options);
    this.renderer = options.renderer ? options.renderer : TextInputRenderer;
  }
}

export class UUIDField extends Field {
  constructor(options) {
    super(options);
    this.renderer = options.renderer ? options.renderer : TextInputRenderer;
  }
}

export class ForeignKeyField extends Field {
  constructor(options) {
    super(options);
    this.namespace = options.namespace ? options.namespace : null;
    this.renderer = options.renderer ? options.renderer : SelectRenderer;
    this.parsers = options.parsers ? options.parsers : {};
    this.optionRender = options.optionRender ? options.optionRender : null;
    this.entity = options.entity ? options.entity : null;
  }
}
