/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import {getAllSubscriptionsByType} from '../services/subscription.service';



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

    * query({ payload }, {call, put, select }) {
      const {type = 'application'} = payload;
      const subscriptions = yield call(getAllSubscriptionsByType({type}))

      yield put({
        type: 'updateState',
        payload: {subscriptions}
      })
    }

  },
  reducers: {}
});
