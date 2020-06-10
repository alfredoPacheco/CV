import { CRUDFactory } from '../../core/CRUDFactory';

export default class GitActivityService extends CRUDFactory {
  constructor() {
    super({
      EndPoint: 'GitActivity'
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
