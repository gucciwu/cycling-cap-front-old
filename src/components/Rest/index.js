/* eslint-disable react/sort-comp,camelcase,no-underscore-dangle,react/no-multi-comp */
import React, { PureComponent } from 'react';
import Crud from "../Crud";

export default class RestCrud extends PureComponent {
  render() {
    const {
      data,
      pagination,
      entity,
      dispatch,
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
    const dvaActions = {
      create: 'create',
      list: 'list',
      fetchOne: 'fetchOne',
      update: 'update',
      delete: 'delete',
    };
    return (
      <Crud
        data={data}
        pagination={pagination}
        entity={entity}
        dispatch={dispatch}
        listing={listing}
        deleting={deleting}
        creating={creating}
        disableDetail={disableDetail}
        disableDelete={disableDelete}
        disableCreate={disableCreate}
        disableUpdate={disableUpdate}
        disableRefresh={disableRefresh}
        disableSelect={disableSelect}
        disableBatchDelete={disableBatchDelete}
        extraInlineActions={extraInlineActions}
        extraHeaderActions={extraHeaderActions}
        dvaActions={dvaActions}
      />
    );
  }
}
