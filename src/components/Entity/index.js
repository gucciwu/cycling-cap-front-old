/* eslint-disable camelcase,no-underscore-dangle */
import React, { Fragment } from 'react';
import { Button, Popconfirm, Input, Icon, DatePicker, Checkbox } from 'antd';
import {
  BooleanField,
  DateField,
  DateTimeField,
  Field,
  ForeignKeyField,
} from './Field';
import { getDate, getDateTime } from '../Date';
import { getStore, isEmpty, isHttpPrefix } from '../../utils/utility';
import styles from './index.less';
import ListSelect from '../Data/Select';
import Iceberg from '../Data/Iceberg';
import LinkValueDisplay from '../Data/LinkValueDisplay';
import { generalSettings } from '../../../config/settings';

const { RangePicker } = DatePicker;

export const ENTITY_DEFAULT_LIST_DISPLAY = undefined;

export const ENTITY_BASE_FIELDS = undefined;

const DISPLAY_FIELD = {LIST: '_listDisplay', FORM: '_formDisplay', DETAIL: '_detailDisplay'};

export default class Entity {

  constructor(options = {}) {
    this._displayName = options.displayName ? options.displayName : '';
    this._namespace = options.namespace ? options.namespace : '';
    this._url = options.url ? options.url : '';
    this._listDataWrap = options.listDataWrap ? options.listDataWrap : '';

    this._fields = ENTITY_BASE_FIELDS; // All effect fields
    this._formDisplay = ENTITY_BASE_FIELDS;
    this._detailDisplay = ENTITY_BASE_FIELDS;
    this._listDisplay = ENTITY_DEFAULT_LIST_DISPLAY;
    this._listSort = [];
    this._listDisplayLink = [];
    this._listFilter = [];
  }

  get displayName() {
    return this._displayName;
  }

  set displayName(value) {
    this._displayName = value;
  }

  get namespace() {
    return this._namespace;
  }

  set namespace(value) {
    this._namespace = value;
  }

  get url() {
    return this._url;
  }

  set url(value) {
    this._url = value;
  }

  get listDataWrap() {
    return this._listDataWrap;
  }

  set listDataWrap(value) {
    this._listDataWrap = value;
  }

  get fields() {
    return this._fields;
  }

  set fields(value) {
    this._fields = value;
  }

  get formDisplay() {
    return this._formDisplay;
  }

  set formDisplay(value) {
    this._formDisplay = value;
  }

  get detailDisplay() {
    return this._detailDisplay;
  }

  set detailDisplay(value) {
    this._detailDisplay = value;
  }

  get listDisplay() {
    return this._listDisplay;
  }

  set listDisplay(value) {
    this._listDisplay = value;
  }

  get listSort() {
    return this._listSort;
  }

  set listSort(value) {
    this._listSort = value;
  }

  get listDisplayLink() {
    return this._listDisplayLink;
  }

  set listDisplayLink(value) {
    this._listDisplayLink = value;
  }

  get listFilter() {
    return this._listFilter;
  }

  set listFilter(value) {
    this._listFilter = value;
  }

  getAllFields = () => Object.keys(this).filter(item => this[item] instanceof Field);

  getPropertyByField = fields => {
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return [];
    }
    return fields.map(item => {
      if (this[item]) {
        this[item].property = item;
        return this[item];
      } 
        // eslint-disable-next-line no-console
        console.warn(`${item} field not found`);
      
    });
  };

  getDisplayField = (defaultFields) => {
    let fields = this[defaultFields];
    if (!Array.isArray(fields)) {
      fields = this._fields;
      if (!Array.isArray(fields)) {
        fields = this.getAllFields();
      }
    }
    return fields;
  };

  getFormDisplayFieldProperty = () => this.getPropertyByField(this.getDisplayField(DISPLAY_FIELD.FORM));

  getDetailDisplayFieldProperty = () => this.getPropertyByField(this.getDisplayField(DISPLAY_FIELD.DETAIL));

  getListDisplayFieldProperty = () => this.getPropertyByField(this.getDisplayField(DISPLAY_FIELD.LIST));

  getValueRenderByProperty = (field) => {
    let ret;
    if (field && field.valueRender && typeof field.valueRender === 'function') {
      ret = (text, record, index) => field.valueRender(text, record, index);
    } else if (field instanceof DateTimeField) {
      ret = (text, record, index) => (text ? getDateTime(text).format(generalSettings.showDateTimeFormat) : '');
    } else if (field instanceof DateField) {
      ret = (text, record, index) => (text ? getDate(text).format(generalSettings.showDateFormat) : '');
    } else if (field instanceof BooleanField) {
      ret = (text, record, index) => (text && (text === 'true' || text === true) ? '是' : '否');
    } else if (field instanceof ForeignKeyField) {
      ret = (text, record, index) => {
        if (!text) {
          return '';
        } 
          let { entity } = field;
          if (typeof entity === 'function') {
            entity = entity(record);
          }
          let url ;
          if (isHttpPrefix(text)) {
            url = text;
          } else {
            url = `${entity._url}/${text}`
          }
          return <LinkValueDisplay url={url} entity={entity} id={text} />;

        
      };
    } else {
      ret = (text, record, index) => (text ? text.toString() : '');
    }
    return ret;
  };

  tableColumnsRender = (onEdit, onDelete, onShowDetail, onFilter, actions) => {
    const properties = this.getListDisplayFieldProperty();
    const inlineActions = (record) => (
      <Fragment>
        {typeof onShowDetail === 'function' ? (
          <Button key="detail" onClick={() => onShowDetail(record)} icon="profile">
              详情
          </Button>
          ) : (
            ''
          )}
        {typeof onEdit === 'function' ? (
          <Button key="edit" onClick={() => onEdit(record)} icon="edit">
              修改
          </Button>
          ) : (
            ''
          )}
        {typeof onDelete === 'function' ? (
          <Popconfirm
            title="确定删除该项？"
            onConfirm={() => onDelete(record)}
            okText="删除"
            okType="danger"
            cancelText="取消"
          >
            <Button key="delete" type="danger" icon="delete">
                删除
            </Button>
          </Popconfirm>
          ) : (
            ''
          )}
        {actions && typeof actions === 'function' && actions(record)}
      </Fragment>
      );
    let render;
    let sorter;
    let filterDropdown;
    let filters;
    let filterIcon;
    const ret = properties.map(column => {
      const textRender = this.getValueRenderByProperty(column);
      if (this._listDisplayLink.includes(column.property)) {
        render = (text, record, index) => {
          if (text && column.entity) {
            let { entity } = column;
            if (typeof entity === 'function') {
              entity = entity(record);
            }
            if (isHttpPrefix(text)) {
              return <Iceberg url={text} entity={entity} id={text} topValue={textRender(text, record, index)} />;
            } 
              return <Iceberg url={`${entity._url}/${text}`} id={text} entity={entity} topValue={textRender(text, record, index)} />;
            
          } if (typeof onShowDetail === 'function')  {
            return <a onClick={() => onShowDetail(record, text, column)}>{textRender(text, record, index)}</a>;
          } 
            return text.toString();
          
        };
      } else {
        render = textRender;
      }
      sorter = this._listSort.includes(column.property);
      if (!isEmpty(onFilter) && this._listFilter.includes(column.property)) {
        if (column instanceof DateTimeField) {
          filterDropdown = (
            <div className={styles['custom-filter-dropdown']}>
              <RangePicker
                showTime
                format={generalSettings.showDateTimeFormat}
                onChange={(value) => onFilter.onInputChange(value, column)}
                onOk={() => onFilter.onSearch(column)}
              />
            </div>
          );
        } else if (Array.isArray(column.choices)) {
          filterDropdown = (
            <div className={styles['custom-filter-dropdown']}>
              <Checkbox.Group
                style={{ width: '100%' }}
                onChange={(values) => onFilter.onInputChange(values, column)}
              >
                { column.choices.map((item) => (
                  <span><Checkbox style={{marginBottom: 8}} value={item.value}>{item.text}</Checkbox><br /></span>
                  )) }
              </Checkbox.Group>
              <Button type="primary" onClick={() => onFilter.onSearch(column)}>
                搜索
              </Button>
            </div>
          );
        } else if (column instanceof ForeignKeyField) {
          filterDropdown = (
            <div className={styles['custom-filter-dropdown']}>
              <ListSelect
                {...column}
                onChange={e => {
                  onFilter.onInputChange(e, column);
                  setTimeout(()=>onFilter.onSearch(column), 200);
                }}
                store={getStore()}
                showSearch
              />
            </div>
          );
        } else {
          filterDropdown = (
            <div className={styles['custom-filter-dropdown']}>
              <Input
                placeholder="keyword"
                onChange={e => onFilter.onInputChange(e.target.value, column)}
                onPressEnter={() => onFilter.onSearch()}
              />
              <Button type="primary" onClick={() => onFilter.onSearch()}>
                搜索
              </Button>
            </div>
          );
        }
        filterIcon = <Icon type="search" />;
      } else {
        filterDropdown = false;
        filterIcon = false;
        filters = [];
      }
      return {
        title: column.verboseName,
        dataIndex: column.property,
        key: column.property,
        render,
        sorter,
        filterDropdown,
        filterIcon,
        filters,
      };
    });
    return ret.concat(
      typeof onShowDetail === 'function' ||
      typeof onEdit === 'function' ||
      typeof onDelete === 'function' ||
      (Array.isArray(actions) && actions.length > 0)
        ? [{ title: '操作', render: inlineActions }]
        : []
    );
  };
}
