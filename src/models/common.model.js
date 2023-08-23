import { toEntityForm } from '@/services/common.service';
import { message } from 'antd';
import { history } from '@umijs/max';
import { merge } from 'lodash';

import { fbFindById } from '@/services/firebase.service';

import { intl, t } from '@/utils/i18n';
import { logger } from '@/utils/console';
import { getSiderPanel } from '@/utils/panel';

const DEFAULT_FORM = [];

const DEFAULT_STATE = {
  referrer: document.referrer,
  resetForm: false,
  translateMessages: {},
  entityForm: [...DEFAULT_FORM],
  language: 'en-US',
  isEdit: false,
  touched: false,
  tags: [],
  schedulers: {},
  uploadedFiles: {},
  siderPanelConfig: {
    minWidth: 600,
    className: 'siderPanel',
    collapsedWidth: 0,
    collapsed: false,
    collapsible: false,
    resizeable: true,
    layoutable: true
  }
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

    * cleanForm({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          entityForm: [...DEFAULT_FORM],
          uploadedFiles: {},
          ...payload
        }
      });
    },

    * updateLocales({ payload }, { put, select }) {
      const { MODEL_NAME, translateMessages } = payload;

      if (MODEL_NAME === 'appModel') {

        yield put({ type: 'updateState', payload: { translateMessages } });

      } else {

        const appState = yield select(state => state.appModel);
        yield put({
          type: 'updateState',
          payload: { translateMessages: appState.translateMessages }
        });
      }
    },

    * toForm({ payload }, { call, put, select }) {
      const { entityForm } = yield select(state => state[payload.model]);
      const { form, dateFields = [] } = payload;

      yield put({
        type: 'updateState',
        payload: {
          entityForm: yield call(toEntityForm, {
            entityForm,
            formObj: form,
            dateFields
          })
        }
      });
    },

    * updateFields({ payload }, { put, select, take }) {
      const { model, changedFields, allFields } = payload;

      yield put({ type: `updateTouched`, payload: { touched: true } });
      yield take('updateTouched/@@end');
    },

    * updateTouched({ payload }, { put, select }) {
      const { touched = true } = payload;

      yield put({ type: `updateState`, payload: { touched } });
    },

    * updateEntityForm({ payload }, { put, select }) {
      const { fields, model } = payload;
      const { entityForm } = yield select(state => state[model]);
      let _entityForm = [...entityForm];

      Object.keys(fields).forEach((fieldForChange) => {
        const index = _entityForm.findIndex(
            field => field.name.includes(fieldForChange));
        if (index > -1) {
          _entityForm = _entityForm.map((entity, idx) => {
            if (idx === index) {
              return {
                ...entity,
                value: fields[fieldForChange]
              };
            }
            return entity;
          });
        } else {
          logger({ type: 'warn', log: 'Invalid field name' });
        }
      });

      yield put({
        type: 'updateState',
        payload: {
          touched: true,
          entityForm: _entityForm
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

    * handleNew({ payload }, { put, select }) {
      const { ability } = yield select(state => state.authModel);

      const {
        component,
        BASE_URL,
        state,
        selected
      } = payload;

      if (ability.can('create', component)) {
        yield put({ type: 'cleanForm' });

        history.push(`${BASE_URL}/new`);

        yield put({
          type: 'updateState',
          payload: {
            ...state,
            ...{
              [selected]: {},
              isEdit: false,
              touched: false
            }
          }
        });

      } else {
        yield put({ type: 'noPermissions', payload: { key: 'handleNew' } });
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

      yield put({
        type: 'updateState',
        payload: {
          uploadedFiles: { ..._files },
          touched: true
        }
      });

      yield put({
        type: 'toForm',
        payload: {
          form: { [payload.type]: previewUrl },
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
      yield put({
        type: 'updateState',
        payload: {
          uploadedFiles: { ..._uploadedFiles },
          touched: true
        }
      });

      yield put({
        type: 'toForm',
        payload: {
          form: { [field]: null },
          model
        }
      });
    },

    * getSimpleEntity({ payload }, { call, put }) {
      const { docName } = payload;
      const type = payload.type || docName;

      const fbTypes = yield call(fbFindById,
          { collectionPath: 'simpleEntities', docName });

      let entities = { tags: [] };

      if (fbTypes.exists) {
        entities = fbTypes.data();
      }

      yield put({
        type: 'updateState',
        payload: { [type]: [...entities?.tags] }
      });
    },

    * raiseCondition({ payload }, { put, call }) {
      const {
        key,
        message,
        redirect = true,
        type = 404
      } = payload;

      if (!key) {
        throw new Error('Key must be defined');
      }

      const msg = yield call(intl, message);
      const { pathname } = window.location;

      console.warn(msg);

      yield put({
        type: 'updateState',
        payload: {
          [key]: null,
          touched: false
        }
      });

      redirect && history.push(
          `/errors/${type}?referrer=${encodeURIComponent(pathname)}`);
    },

    * notFound({ payload }, { put }) {
      const { entity = 'Entity', key, redirect } = payload;

      yield put({
        type: 'raiseCondition',
        payload: {
          key,
          redirect,
          type: 404,
          message: {
            id: 'error.notFound',
            defaultMessage: `${entity} not found`, instance: { entity }
          }
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
          message: {
            id: 'error.noPermissions',
            defaultMessage: 'Has no relevant permissions'
          }
        }
      });
    },

    * closeSiderPanel({ payload = {} }, { put, select }) {
      const { siderPanels } = yield select(state => state.appModel);
      const { currentPanel, panel } = getSiderPanel(siderPanels, payload);

      if (currentPanel) {
        yield put({
          type: 'updateState',
          payload: {
            siderPanels: {
              ...siderPanels,
              [currentPanel]: { ...panel, visible: false }
            }
          }
        });
      }
    }
  },

  reducers: {

    updateState(state, { payload }) {
      return { ...state, ...payload };
    },

    mergeState(state, { payload }) {
      return merge({}, state, payload);
    }
  }
};

export { commonModel };
