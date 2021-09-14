import { getEntityFormIdx } from 'services/common.service';
import { message } from 'antd';
import { history } from 'umi';
import { merge } from 'lodash';

const DEFAULT_FORM = [
  {
    name: 'entityType',
    value: 'form'
  },
  {
    name: 'entityKey',
    value: ''
  }
];

/**
 * @constant
 * @export
 */
const commonModel = {
  state: {
    referrer: document.referrer,
    resetForm: false,
    entityForm: DEFAULT_FORM,
    language: 'en-US',
    isEdit: false,
    previewUrl: null,
    tags: [],
    fileList: [],
    fileName: null
  },
  subscriptions: {},

  effects: {

    * updateTags({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: { tags: payload.tags }
      });
    },

    * cleanForm({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: { entityForm: DEFAULT_FORM }
      });
    },

    * toForm({ payload }, { call, put, select }) {
      const { entityForm } = yield select(state => state[payload.model]);
      const _entityForm = [...entityForm];
      const toDelete = [];

      const keys = Object.keys(payload.form);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const idx = yield call(getEntityFormIdx, { entityForm, key });

        const formItem = {
          name: key,
          value: payload.form[key]
        };

        // Overwrite existing values
        if (idx > -1) {
          toDelete.push(idx);
        }

        _entityForm.push(formItem);
      }

      yield put({
        type: 'updateState',
        payload: {
          entityForm: [..._entityForm.filter((form, idx) => toDelete.indexOf(idx) === -1)]
        }
      });
    },

    * updateFields({ payload }, { put, select }) {
      const { entityForm } = yield select(state => state[payload.model]);
      const _entityForm = [...entityForm];

      yield put({
        type: 'updateState',
        payload: {
          entityForm: [..._entityForm]
        }
      });
    },

    * handleAddFile({ payload }, { put, select }) {
      const { fileList } = yield select(state => state[payload.model]);

      const previewUrl = URL.createObjectURL(payload.file);

      yield put({
        type: 'updateState',
        payload: {
          previewUrl,
          fileList: [...fileList, payload.file],
          fileName: payload.file.name
        }
      });

      yield put({
        type: 'toForm',
        payload: {
          form: { license: previewUrl },
          model: payload.model
        }
      });
    },

    * handleRemoveFile({ payload }, { put, select }) {
      const { fileList } = yield select(state => state[payload.model]);

      const index = fileList.indexOf(payload.file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);

      yield put({
        type: 'updateState',
        payload: {
          previewUrl: null,
          fileList: newFileList,
          fileName: null
        }
      });

      yield put({
        type: 'toForm',
        payload: {
          form: { license: null },
          model: payload.model
        }
      });
    },

    * raiseCondition({ payload }, { put }) {
      message.warning(payload.message).then();

      yield put({
        type: 'updateState',
        payload: { [payload.key]: null }
      });

      history.push(`/errors/404`);
    }
  },
  reducers: {

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    mergeState(state, { payload }) {
      return merge({}, state, payload);
    }
  }
};

export { commonModel };
