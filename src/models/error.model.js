/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

const MODEL_NAME = 'errorModel';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,

  state: {
    errors: []
  },

  subscriptions: {
    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },

  effects: {

    * query({ payload }, { put, select }) {
      const { errors } = yield select(state => state[MODEL_NAME]);
      // TODO (teamco): Do something.
      const { status, title } = payload;

      yield put({
        type: 'updateState',
        payload: {
          errors: [
            ...errors,
            { status, title }
          ]
        }
      });
    }
  },

  reducers: {}
});
