import pyreneesFactory from '../../../utils/restDvaModelFactory4SpringDataRestWithJpa';
import { DictionaryEntity } from '../Dict';
import { entities } from '../../../../config/settings';


export default {
  namespace: entities.dictionary.namespace,
  ...pyreneesFactory(new DictionaryEntity()),
};
