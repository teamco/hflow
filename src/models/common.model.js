import {getEntityFormIdx} from 'services/common.service';
import {message} from 'antd';
import {history} from 'umi';
import {merge} from 'lodash';

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

const DEFAULT_STATE = {
  referrer: document.referrer,
  resetForm: false,
  entityForm: DEFAULT_FORM,
  language: 'en-US',
  isEdit: false,
  touched: false,
  tags: [],
  uploadedFiles: {}
};

/**
 * @constant
 * @export
 */
const commonModel = {
  state: {...DEFAULT_STATE},

  subscriptions: {},

  effects: {

    * updateTags({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {
          tags: payload.tags,
          touched: true
        }
      });
    },

    * cleanForm({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {...DEFAULT_STATE}
      });
    },

    * toForm({payload}, {call, put, select}) {
      const {entityForm} = yield select(state => state[payload.model]);
      const _entityForm = [...entityForm];
      const toDelete = [];

      const keys = Object.keys(payload.form);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const idx = yield call(getEntityFormIdx, {entityForm, key});

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

    * updateFields({payload}, {put}) {
      const {allFields} = payload;

      yield put({
        type: 'updateState',
        payload: {
          touched: true,
          entityForm: [...allFields].map(field => ({name: field.name, value: field.value}))
        }
      });

    },

    * handleAddFile({payload}, {put, select}) {
      const {file, field, model} = payload;
      const {uploadedFiles} = yield select(state => state[model]);

      const previewUrl = URL.createObjectURL(file);

      const _files = {
        ...uploadedFiles,
        [field]: {
          previewUrl,
          fileList: [payload.file],
          fileName: file.name
        }
      };

      yield put({type: 'updateState', payload: {uploadedFiles: {..._files}}});

      yield put({
        type: 'toForm',
        payload: {
          form: {license: previewUrl},
          model: payload.model
        }
      });
    },

    * handleRemoveFile({payload}, {put, select}) {
      const {file, field, model} = payload;
      const {uploadedFiles} = yield select(state => state[model]);

      const _uploadedFiles = {...uploadedFiles};
      delete _uploadedFiles[field];

      // TODO (teamco): Handle multiple files.
      yield put({type: 'updateState', payload: {uploadedFiles: {..._uploadedFiles}}});
      yield put({type: 'toForm', payload: {form: {license: null}, model}});
    },

    * raiseCondition({payload}, {put}) {
      message.warning(payload.message).then();

      yield put({
        type: 'updateState',
        payload: {[payload.key]: null}
      });

      history.push(`/errors/404`);
    }
  },
  reducers: {

    updateState(state, {payload}) {
      return {
        ...state,
        ...payload
      };
    },

    mergeState(state, {payload}) {
      return merge({}, state, payload);
    }
  }
};

export {commonModel};
