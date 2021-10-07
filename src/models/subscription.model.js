/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'subscriptionModel',
  state: {
    subscriptions: []
  },
  subscriptions: {
    setupHistory(setup) {
    },
    setup({ dispatch }) {
    }
  },
  effects: {

    * query({ payload }, { put, select }) {
      const {subscriptions} = yield select(state => state.subscriptionModel);

      yield put({
        type: 'updateState',
        payload: {subscriptions}
      })
    }

  },
  reducers: {}
});
