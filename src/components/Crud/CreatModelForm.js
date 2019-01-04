import React from 'react';
import { Modal, Form } from 'antd';
import ModelForm from '../Form/index';
import { isEmpty } from '../../utils/utility';
import Ellipsis from '../Ellipsis';

const getModelVerboseName = (entity, instance) => {
  let ret = instance.name || instance.code;
  if (entity.verboseName && typeof entity.verboseName === 'function') {
    ret = isEmpty(instance) ? '' : entity.verboseName(instance);
  } else if (entity.verboseName && typeof entity.verboseName === 'string') {
    ret = entity.verboseName;
  }
  return ret || '';
};

export const CreateModelForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onOK, object, entity, form, onChange } = this.props;
      return (
        <Modal
          width={680}
          title={
            <Ellipsis tooltip length={100}>{`${entity.displayName} - ${getModelVerboseName(
              entity,
              object
            ) || '新增'}`}
            </Ellipsis>
          }
          visible={visible}
          onCancel={onCancel}
          onOk={onOK}
        >
          <ModelForm instance={object} entity={entity} form={form} onChange={onChange} />
        </Modal>
      );
    }
  }
);
