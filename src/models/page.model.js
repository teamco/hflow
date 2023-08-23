/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { monitorHistory } from '@/utils/history';

const MODEL_NAME = 'pageModel';

const DEFAULT_STATE = {
  data: [],
  gridLayout: true
}

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: {
    ...DEFAULT_STATE
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, MODEL_NAME);
    },
    setup({ dispatch }) {
      dispatch({ type: 'query' });
    }
  },

  effects: {

    * query({ payload }, { put, select }) {
      // TODO (teamco): Do something.
    },

    * changeGridLayout({ payload }, { put, select }) {
      const { gridLayout } = yield select(state => state[MODEL_NAME]);
      yield put({ type: 'updateState', payload: { gridLayout: !gridLayout } });
    }
  },

  reducers: {}
});
