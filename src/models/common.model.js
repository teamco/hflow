import { getEntityFormIdx } from 'services/common.service';
import { message } from 'antd';
import { history, useIntl } from 'umi';
import { merge } from 'lodash';

import { fbFindById } from '@/services/firebase.service';

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
  state: { ...DEFAULT_STATE },

  subscriptions: {},

  effects: {

    * updateTags({ payload }, { put }) {
      const { tags = [], touched = true } = payload;
      yield put({ type: 'updateState', payload: { tags, touched } });
    },

    * cleanForm({ payload }, { put, take }) {
      yield put({ type: 'updateState', payload: { ...DEFAULT_STATE, ...payload } });
      yield take('updateState');
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

    * updateFields({ payload }, { put }) {
      const { allFields } = payload;

      yield put({
        type: 'updateState',
        payload: {
          touched: true,
          entityForm: [...allFields].map(field => ({ name: field.name, value: field.value }))
        }
      });
    },

    * updateVersion({ payload }, { put }) {
      const { entity, selectedEntity, entityName } = payload;

      if (entity.exists) {
        yield put({
          type: 'updateState',
          payload: {
            touched: false,
            [entityName]: {
              ...selectedEntity,
              version: entity.data.version
            }
          }
        });
      }
    },

    * handleAddFile({ payload }, { put, select }) {
      const { file, field, model } = payload;
      const { uploadedFiles } = yield select(state => state[model]);

      const previewUrl = URL.createObjectURL(file);

      const _files = {
        ...uploadedFiles,
        [field]: {
          previewUrl,
          fileList: [payload.file],
          fileName: file.name
        }
      };

      yield put({ type: 'updateState', payload: { uploadedFiles: { ..._files } } });

      yield put({
        type: 'toForm',
        payload: {
          form: { license: previewUrl },
          model: payload.model
        }
      });
    },

    * handleRemoveFile({ payload }, { put, select }) {
      const { file, field, model } = payload;
      const { uploadedFiles } = yield select(state => state[model]);

      const _uploadedFiles = { ...uploadedFiles };
      delete _uploadedFiles[field];

      // TODO (teamco): Handle multiple files.
      yield put({ type: 'updateState', payload: { uploadedFiles: { ..._uploadedFiles } } });
      yield put({ type: 'toForm', payload: { form: { license: null }, model } });
    },

    * getSimpleEntity({ payload }, { call, put }) {
      const { doc } = payload;
      const type = payload.type || doc;

      const fbTypes = yield call(fbFindById, { collection: 'simpleEntities', doc });

      let entities = { tags: [] };

      if (fbTypes.exists) {
        entities = fbTypes.data();
      }

      yield put({
        type: 'updateState',
        payload: { [type]: [...entities?.tags] }
      });
    },

    * raiseCondition({ payload }, { put, take }) {
      const { redirect = true, type = 404, key } = payload;

      if (!key) {
        throw new Error('Key must be defined');
      }

      message.warning(payload.message).then();

      yield put({ type: 'updateState', payload: { [key]: null, touched: false } });
      yield take('updateState');

      redirect && history.push(`/admin/errors/${type}`);
    },

    * notFound({ payload }, { put }) {
      const { entity = 'Entity', key, redirect } = payload;

      yield put({
        type: 'raiseCondition',
        payload: {
          key,
          redirect,
          type: 404,
          message: useIntl().formatMessage({id: 'error:notFound', defaultMessage: '{entity} not found'}, { entity })
        }
      });
    },

    * noPermissions({ payload }, { put }) {
      const { key, redirect } = payload;
      yield put({
        type: 'raiseCondition',
        payload: {
          key,
          redirect,
          type: 403,
          message: useIntl.formatMessage({id: 'error:noPermissions', defaultMessage: 'Has no relevant permissions'})
        }
      });
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
