import React from 'react';
import { connect } from 'dva';
import { CharField, IntegerField, TextField } from '../../components/Entity/Field';
import Entity from '../../components/Entity/index';
import { entities } from '../../../config/settings';
import RestCrud from '../../components/Rest';

export class DictionaryEntity extends Entity {
  constructor() {
    super(entities.dictionary);

    this.id = new IntegerField({ verboseName: 'ID', creatable: false, editable: false });
    this.dictEntry = new CharField({
      maxLength: 100,
      allowBlank: false,
      verboseName: '类型',
      editable: false,
    });
    this.dictKey = new CharField({
      maxLength: 200,
      allowBlank: false,
      verboseName: '键',
      editable: false,
    });
    this.dictValue = new TextField({ maxLength: 500, allowBlank: false, verboseName: '值' });
    this.dictRemark = new TextField({ maxLength: 500, verboseName: '备注' });
  }

  verboseName = instance => {
    return `${instance.dictEntry} - ${instance.dictKey}`;
  };
  // fields = ['id', 'dictEntry', 'dictKey', 'dictValue', 'dictRemark'];
  // listSort = ['dictEntry', 'dictKey', 'dictValue'];
  // listDisplay = ['dictEntry', 'dictKey', 'dictValue'];
  // listFilter = ['dictEntry', 'dictKey', 'dictValue'];
  // detailDisplay = ['id', 'dictEntry', 'dictKey', 'dictValue', 'dictRemark'];
}

@connect(({ dictionary, loading }) => ({
  dictionary,
  fetching: loading.effects['dictionary/fetchOne'],
  listing: loading.effects['dictionary/list'],
  deleting: loading.effects['dictionary/delete'],
  creating: loading.effects['dictionary/create'],
  updating: loading.effects['dictionary/update'],
}))
class Dictionaries extends React.Component {
  render() {
    const {
      dictionary,
      fetching,
      listing,
      deleting,
      creating,
      updating,
      dispatch,
    } = this.props;
    return (
      <RestCrud
        dispatch={dispatch}
        data={dictionary.list}
        pagination={dictionary.pagination}
        fetching={fetching}
        listing={listing}
        deleting={deleting}
        creating={creating}
        updating={updating}
        entity={new DictionaryEntity()}
      />
    );
  }
}

export default Dictionaries
