/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { monitorHistory } from 'utils/history';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace    : 'errorModel',
  state        : {
    data: []
  },
  subscriptions: {
    setupHistory(setup) {
      monitorHistory(setup, 'errorModel');
    },
    setup({ dispatch }) {
      dispatch({ type: 'query' });
    }
  },
  effects      : {
    * query({ payload }, { put, select }) {
    }
  },
  reducers     : {}
});
