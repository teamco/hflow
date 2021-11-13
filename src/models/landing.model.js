import React from 'react';

/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { commonModel } from 'models/common.model';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'landingModel',
  state: {
    data: [],
    topUnder: 160
  },
  subscriptions: {
    setupHistory(setup) {
    },
    setup({ dispatch }) {
      dispatch({ type: 'query' });
    }
  },
  effects: {
    * query({ payload }, { put, select }) {
    }
  },
  reducers: {}
});
