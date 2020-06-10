import { CRUDFactory } from '../../core/CRUDFactory';

export default class SkillService extends CRUDFactory {
  constructor() {
    super({
      EndPoint: 'Skill'
    });
  }
  ADAPTER_IN(entity) {
    ///start:generated:adapterin<<<

    ///end:generated:adapterin<<<

    return entity;
  }

  ADAPTER_OUT(entity) {
    ///start:generated:adapterout<<<
    ///end:generated:adapterout<<<
  }
}
