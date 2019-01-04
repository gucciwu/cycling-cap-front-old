/* eslint-disable no-underscore-dangle,camelcase */
import React, { PureComponent } from 'react';
import { Card, Button, Table, Popconfirm } from 'antd';

const ButtonGroup = Button.Group;

export default class CrudList extends PureComponent {
  render() {
    const {
      data,
      listing,
      creating,
      deleting,
      pagination,
      onTableChange,
      rowKey,
      entity,
      onEdit,
      onDelete,
      onShowDetail,
      onRefresh,
      onBatchDelete,
      onNew,
      onFilter,
      rowSelection,
      selectedRows,
      extraInlineActions,
      extraHeaderActions,
    } = this.props;
    return (
      <Card>
        <ButtonGroup style={{ marginBottom: 24 }}>
          {typeof onRefresh === 'function' ? <Button onClick={onRefresh} loading={listing} icon="reload">刷新</Button> : ''}
          {typeof onNew === 'function' ? <Button onClick={onNew} type="primary" loading={creating} icon="plus-square">新增</Button> : ''}
          {typeof onBatchDelete === 'function' ? (
            <Popconfirm title={`确定批量删除选中的${selectedRows.length}项？`} onConfirm={() => onBatchDelete(selectedRows)} okText="删除" okType="danger" cancelText="取消">
              <Button type="danger" disabled={!selectedRows || !Array.isArray(selectedRows) || selectedRows.length === 0} loading={deleting} icon="delete">批量删除</Button>
            </Popconfirm>
          ) : ''}
          { extraHeaderActions }
        </ButtonGroup>
        <Table
          rowSelection={rowSelection}
          rowKey={rowKey}
          loading={listing}
          dataSource={data}
          pagination={pagination}
          columns={entity.tableColumnsRender(onEdit, onDelete, onShowDetail, onFilter, extraInlineActions,
          )}
          onChange={onTableChange}
        />
      </Card>
    );
  }
}

