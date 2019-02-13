import pyreneesFactory from '../../../utils/restDvaModelFactory4DjangoRestFramework';
import { JessUserEntity } from '../User';
import { entities } from '../../../../config/settings';


export default {
  namespace: entities.jessUser.namespace,
  ...pyreneesFactory(new JessUserEntity()),
};
