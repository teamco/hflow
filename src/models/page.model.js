/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { monitorHistory } from '@/utils/history';

const MODEL_NAME = 'pageModel';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: {
    data: []
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      return monitorHistory({ history, dispatch }, MODEL_NAME);
    },
    setup({ dispatch }) {
      dispatch({ type: 'query' });
    }
  },
  effects: {
    * query({ payload }, { put, select }) {
      // TODO (teamco): Do something.
    }
  },
  reducers: {}
});
