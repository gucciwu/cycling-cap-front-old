import pyreneesFactory from '../../../utils/restDvaModelFactory4SpringDataRestWithJpa';
import { DictionaryEntity } from '../Dict';


export default {
  namespace: 'dictionary',
  ...pyreneesFactory(new DictionaryEntity()),
};
