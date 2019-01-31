import React from 'react';
import { connect } from 'dva';
import { CharField, EmailField, ImageField, IntegerField } from '../../components/Entity/Field';
import Entity from '../../components/Entity/index';
import { entities } from '../../../config/settings';
import RestCrud from '../../components/Rest';

export class JessUserEntity extends Entity {
  constructor() {
    super(entities.jessUser);
  }
  id = new IntegerField({ verboseName: 'ID', creatable: false, editable: false });
  loginId = new CharField({ maxLength: 20, allowBlank: false, verboseName: '登录名', editable: false });
  name = new CharField({ maxLength: 20, allowBlank: false, verboseName: '名称', editable: false });
  mobile = new EmailField({ verboseName: 'mobile' });
  phone = new EmailField({ verboseName: 'phone' });
  address = new EmailField({ verboseName: 'address' });
  sex = new IntegerField({ verboseName: '性别', valueRender: (instance) => { console.log(instance); return instance === 1 ? "男" : "女" }, choices: [{id: 1, name: "男"}, {id: 2, name: "女"}]});
  avatar = new ImageField({ verboseName: '头像' });
  email = new EmailField({ allowBlank: false, verboseName: 'Email' });
  status = new IntegerField({ allowBlank: false, verboseName: '状态'});

  verboseName = (instance) => {
    return `${instance.name} - (${instance.loginId})`;
  };
  fields = ['id', 'loginId', 'name', 'sex', 'mobile', 'phone', 'address', 'email', 'avatar', 'status'];
  listSort = ['loginId', 'name', 'email', 'mobile', 'phone', 'address', 'status'];
  listDisplay = ['loginId', 'name', 'sex', 'mobile', 'phone', 'address', 'email'];
  listFilter = ['loginId', 'name', 'email', 'status'];
}

@connect(({ jessUser, loading }) => ({
  jessUser,
  fetching: loading.effects['jessUser/fetchOne'],
  listing: loading.effects['jessUser/list'],
  deleting: loading.effects['jessUser/delete'],
  creating: loading.effects['jessUser/create'],
  updating: loading.effects['jessUser/update'],
}))
export default class JessUsers extends React.Component {
  render() {
    const { jessUser, fetching, listing, deleting, creating, updating, dispatch } = this.props;
    return (
      <RestCrud
        dispatch={dispatch}
        data={jessUser.list}
        pagination={jessUser.pagination}
        fetching={fetching}
        listing={listing}
        deleting={deleting}
        creating={creating}
        updating={updating}
        entity={new JessUserEntity()}
      />
    );
  }
}
