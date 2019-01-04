# 1. Entity
A model is the single, definitive source of information about your data from API. It contains the essential fields and behaviors of the data you’re storing or send to server side with response. Specially, in RESTful API, each model maps to a single database table.

# 2. Field
## 2.1 Field options
Each field takes a certain set of field-specific arguments (documented in the model field reference). For example, CharField (and its subclasses) require a maxLength argument which specifies the size of the VARCHAR database field used to store the data.

There’s also a set of common arguments available to all field types. All are optional. They’re fully explained in the reference, but here’s a quick summary of the most often-used ones:

### 2.1.1 allowBlank
If True, the field is allowed to be blank. default is true.

### 2.1.2 choices
An sim-map object to use as choices for this field. If this is given, the default form widget will be a select box instead of the standard text field and will limit choices to the choices given.

### 2.1.3 defaultValue
The default value for the field. This can be a value or a callable object. If callable it will be called every time a new object is created.

### 2.1.4 helpText
Extra “help” text to be displayed with the form renderer as placeholder. It’s useful for documentation even if your field isn’t used on a form.

### 2.1.5 primaryKey
If true, this field is the primary key for the model.

### 2.1.6 editable
If false, the field will be readonly in ModelForm when modify an instance. They are also skipped during model modification validation. default is true.

### 2.1.7 creatable
If false, the field will be readonly in ModelForm when create an instance. They are also skipped during model creating validation. default is true.

### 2.1.8 verboseName
A human-readable name for the field. If the verbose name isn’t given, Jeff will automatically create it using the field’s attribute name, converting underscores to spaces. See Verbose field names.

### 2.1.9 rules
A list of validators used in form validation. see ['Ant Design Form validator'](http://ant.design/components/form-cn/#校验规则) for detial

### 2.1.10 hide
If true, this field will not displayed in list, form and detail.

### 2.1.11 valueRender
A function for render a value in list and detail.

### 2.1.12 renderer
Used for render form input element.

## 2.2 Build-in fields
### 2.2.1 BooleanField
- `renderer`: default is Checkbox

### 2.2.2 CharField
- `renderer`: default is TextInput
- `maxLength`: max character count
- `minLength`: min character count
- `length`: fixed character count

### 2.2.3 EmailField
- `renderer`: default is TextInput
- `rules`: default with Email format validation

### 2.2.4 TextField
- `renderer`: default is TextArea
- `maxLength`: max character count
- `minLength`: min character count
- `length`: fixed character count

### 2.2.5 IntegerField
- `renderer`: default is numberInput
- `min`: min value
- `max`: max value
- `formatter`: a function specifies the format of the value presented
- `parser`: a function specifies the value extracted from formatter
- `step`: the number to which the current value is increased or decreased, default is 1

### 2.2.6 FloatField
- `renderer`: default is numberInput
- `min`: min value
- `max`: max value
- `formatter`: a function specifies the format of the value presented
- `parser`: a function specifies the value extracted from formatter
- `precision`: precision of input value， default is 2
- `step`: the number to which the current value is increased or decreased, default is 0.01

### 2.2.7 PercentField
- `renderer`: default is numberInput
- `min`: min value
- `max`: max value
- `precision`: precision of input value， default is 0
- `step`: the number to which the current value is increased or decreased, default is 1

### 2.2.8 PriceField
- `renderer`: default is numberInput
- `min`: min value
- `max`: max value
- `precision`: precision of input value， default is 2
- `step`: the number to which the current value is increased or decreased, default is 0.01
- `prefix`: a currency unit as a prefix in value display, default is '$'


### 2.2.9 DateField
- `renderer`: default is DatePicker.
- `autoNow`: if true, auto set to now when creating instance

### 2.2.10 TimeField
- `renderer`: default is TimePicker
- `autoNow`: if true, auto set to now when creating instance

### 2.2.11 DateTimeField
- `renderer`: default is DateTimePicker
- `autoNow`: if true, auto set to now when creating instance

### 2.2.12 FileField
- `renderer`: default is Upload

### 2.2.13 ImageField
- `renderer`: default is Upload, and only support image files that defined in ['/CRUD/utils/utils.js'] 
