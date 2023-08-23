/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

import { monitorHistory } from '@/utils/history';

import {
  cloudinaryProcessFile,
  cloudinaryCredentials
} from '@/services/cloudinary.service';

const MODEL_NAME = 'cloudinaryModel';

const DEFAULT_STATE = {
  uploadConfig: {
    sliceSize: 20000000,
    folder: 'assets',
    partialUploads: {},
    error: null,
    unsignedUpload: false
  },
  signData: null
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: { ...DEFAULT_STATE },

  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, MODEL_NAME);
    },

    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },

  effects: {

    * cloudinarySignature({ payload }, { call, put, select }) {
      const { token } = yield select(state => state.authModel);
      const { uploadConfig } = yield select(state => state[MODEL_NAME]);

      const folder = payload.folder ?? uploadConfig.folder;

      const { data } = yield call(cloudinaryCredentials, { token, folder });

      if (data?.error) return false;

      yield put({ type: 'updateState', payload: { signData: { ...data } } });
    },

    * cloudinaryAddFile({ payload }, { put, call, select }) {
      const { signData, uploadConfig } = yield select(state => state[MODEL_NAME]);

      yield call(cloudinaryProcessFile, {
        ...payload,
        signData,
        uploadConfig: {
          ...uploadConfig,
          folder: payload.folder
        },
        model: payload.model
      });
    }
  },

  reducers: {}
});
