/* eslint-disable react/sort-comp,array-callback-return */
import React, { PureComponent } from 'react';
import { Modal, message, Button } from 'antd';
import CrudList from './List';
import { isEmpty } from '../../utils/utility';
import CrudDetail from './Detail';
import { DateField, DateTimeField } from '../Entity/Field';
import { CreateModelForm } from './CreatModelForm';
import cleanValues from './utils';


export default class Crud extends PureComponent {
  state = {
    dirty: false,
    current: {},
    modelFormVisible: false,
    detailModalVisible: false,
    selectedRows: [],
    search: {},
    filter: {},
    pagination: {},
    sorter: {},
  };

  componentWillMount() {
    this.refresh();
  }

  list = () => {
    const { dispatch, entity } = this.props;
    const { pagination, filter, search, sorter } = this.state;
    if (entity.namespace) {
      dispatch({
        type: `${entity.namespace}/list`,
        payload: { pagination, filter, search, sorter },
      });
    }
  };

  refresh = () => {
    this.setState({
      pagination: {},
      filter: {},
      sorter: {},
      search: {},
    });
    setTimeout(() => this.list(), 200);
  };

  fetch = id => {
    const { dispatch, entity, fetchOneCallback, dvaActions } = this.props;
    dispatch({
      type: `${entity.namespace}/${dvaActions && dvaActions.fetchOne ? dvaActions.fetchOne : 'fetchOne'}}`,
      payload: { id },
    });
    if (typeof fetchOneCallback === 'function') {
      fetchOneCallback();
    }
  };

  delete = object => {
    const { dispatch, entity, deleteCallback, dvaActions } = this.props;
    dispatch({
      type: `${entity.namespace}/${dvaActions && dvaActions.delete ? dvaActions.delete : 'delete'}`,
      payload: object,
    });
    if (typeof deleteCallback === 'function') {
      deleteCallback();
    }
  };

  create = object => {
    const { dispatch, entity, createCallback, dvaActions } = this.props;
    const body = cleanValues(null, object, entity);

    dispatch({
      type: `${entity.namespace}/${dvaActions && dvaActions.create ? dvaActions.create : 'create'}`,
      payload: { body },
    });
    if (typeof createCallback === 'function') {
      createCallback();
    }
  };

  update = object => {
    const { dispatch, updateCallback, entity, dvaActions } = this.props;
    const { current, dirty } = this.state;
    if (!dirty) {
      message.warn('Nothing changed');
      return;
    }
    // A new one, create it
    if (isEmpty(current)) {
      this.create(object);
    } else {
      const body = cleanValues(current, object, entity);
      if (isEmpty(body)) {
        message.warn('Nothing changed');
      } else {
        dispatch({
          type: `${entity.namespace}/${dvaActions && dvaActions.update ? dvaActions.update : 'update'}`,
          payload: {
            body,
            original: current,
          },
        });
        if (typeof updateCallback === 'function') {
          updateCallback();
        }
      }
    }
  };

  edit = object => {
    this.setState({
      modelFormVisible: true,
      current: object,
    });
  };

  new = () => {
    this.setState({
      modelFormVisible: true,
      current: {},
    });
  };

  detail = object => {
    this.setState({
      detailModalVisible: true,
      current: object,
    });
  };

  batchDelete = () => {
    this.state.selectedRows.map(row => {
      this.delete(row);
    });
  };

  onFilter = {
    onSearch: () => {
      this.list();
    },
    onInputChange: (value, column) => {
      if (column instanceof DateTimeField || column instanceof DateField) {
        this.setState({
          search: {
            changed: true,
            keyword: {
              start: value[0].toString(),
              end: value[1].toString(),
            },
            field: column.property,
          },
        });
      } else {
        this.setState({
          search: {
            changed: true,
            keyword: value,
            field: column.property,
          },
        });
      }
    },
  };

  getFieldsByProperty = (property, value) => {
    const { entity } = this.props;
    const keys = Object.keys(entity);
    return keys.filter(key => {
      if (entity[key]) {
        return entity[key][property] === value;
      } else {
        return null;
      }
    });
  };

  onTableChange = (pagination, filter, sorter) => {
    let search = {};
    if (!isEmpty(filter)) {
      search = {
        field: Object.entries(filter)[0][0],
        keyword: Object.entries(filter)[0][1],
      }
    }
    this.setState({
      pagination,
      filter,
      sorter,
      search,
    });
    setTimeout(() => this.list(), 200);
  };

  onDataChange = () => {
    this.setState({
      dirty: true,
    });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.update(values);
      form.resetFields();
      this.setState({ modelFormVisible: false });
    });
  };

  handleCloseForm = () => {
    const { form } = this.formRef.props;
    form.resetFields();
    this.setState({ modelFormVisible: false });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({
        selectedRows,
      });
    },
  };

  render() {
    const {
      data,
      pagination,
      entity,
      listing,
      deleting,
      creating,
      disableDetail,
      disableDelete,
      disableCreate,
      disableUpdate,
      disableRefresh,
      disableSelect,
      disableBatchDelete,
      extraInlineActions,
      extraHeaderActions,
    } = this.props;
    const { current, modelFormVisible, detailModalVisible, selectedRows } = this.state;
    const keyFields = this.getFieldsByProperty('primaryKey', true);
    return (
      <div>
        <CrudList
          rowKey={entity.id ? 'id' : keyFields && keyFields.length > 0 ? keyFields[0] : entity.code ? 'code' : ''}
          data={data}
          pagination={pagination}
          listing={listing}
          deleting={deleting}
          entity={entity}
          onEdit={disableUpdate ? undefined : this.edit}
          onNew={disableCreate ? undefined : this.new}
          onDelete={disableDelete ? undefined : this.delete}
          onRefresh={disableRefresh ? undefined : this.refresh}
          onBatchDelete={disableBatchDelete ? undefined : this.batchDelete}
          onShowDetail={disableDetail ? undefined : this.detail}
          onTableChange={this.onTableChange}
          onFilter={this.onFilter}
          rowSelection={disableSelect ? undefined : this.rowSelection}
          selectedRows={selectedRows}
          extraInlineActions={extraInlineActions}
          extraHeaderActions={extraHeaderActions}
        />
        <CreateModelForm
          object={current}
          entity={entity}
          wrappedComponentRef={this.saveFormRef}
          visible={modelFormVisible}
          onCancel={this.handleCloseForm}
          onOK={this.handleCreate}
          onChange={this.onDataChange}
        />
        <Modal
          key="detailModal"
          onCancel={() => this.setState({ detailModalVisible: false })}
          confirmLoading={creating}
          visible={detailModalVisible}
          footer={[
            <Button
              key="close-detail"
              onClick={() => this.setState({ detailModalVisible: false })}
            >
              关闭
            </Button>,
          ]}
        >
          <CrudDetail entity={entity} id={current.id} instance={current} />
        </Modal>
      </div>
    );
  }
}
