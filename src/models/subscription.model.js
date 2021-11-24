/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import {getAllSubscriptionsByType} from '../services/subscription.service';
import {monitorHistory} from '../utils/history';



/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'subscriptionModel',
  state: {
    subscriptions: []

  },
  subscriptions: {
    setupHistory({history, dispatch}) {
      monitorHistory({history, dispatch}, 'subscriptionModel');
    },
    setup({ dispatch }) {
    }
  },
  effects: {

    * query({ payload }, {call, put, select }) {
      const {type = 'application'} = payload;
      const allSubscriptions = yield call(getAllSubscriptionsByType,{type})

      yield put({
        type: 'updateState',
        payload: {subscriptions: allSubscriptions}
      })
    },
    // check if user exist and already subscribed then change plan , if not then show SignUp . Sin in Popup
    * assignTo({ payload }, {call, put, select }) {
      let { user, ability } = yield select(state => state.authModel);
      const { userId } = payload;

      const {subscriptionId} =  payload;


    }

  },
  reducers: {}
});
