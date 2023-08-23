/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { detailsInfo } from '@/services/cross.model.service';
import {
  fbFindById,
  fbUpdate,
  fbWrite,
  getRef
} from '@/services/firebase.service';

import { monitorHistory } from '@/utils/history';

const MODEL_NAME = 'roleModel';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,

  state: {
    abilityRoles: {},
    userRoles: {},
    businessRoles: {},
    componentRoles: {},
    rolesManager: {}
  },

  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, MODEL_NAME);
    },

    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },

  effects: {

    * query({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { component, docName } = payload;

      let roles = {};

      if (user && ability.can('read', component)) {
        const fbRoles = yield call(fbFindById, {
          collectionPath: 'roles',
          docName
        });

        let data = {};

        if (fbRoles.exists()) {
          roles = fbRoles.data();
          data = roles?.metadata ? roles : {};
        }

        data.metadata = yield call(detailsInfo, { entity: data, user });

        yield put({
          type: 'toForm',
          payload: {
            model: MODEL_NAME,
            form: {...data}
          }
        });

        yield put({
          type: 'updateState',
          payload: { isEdit: !!(fbRoles.exists()) }
        });
      }

      yield put({
        type: 'updateState',
        payload: {
          touched: false,
          [docName]: roles
        }
      });
    },

    * getRolesFor({ payload }, { call, put, select }) {
      const state = yield select(state => state.authModel);
      const { component, docName, rolesFor, modelName = '' } = payload;

      const { user, ability } = state;
      let roles = {};

      if (user && ability.can('read', component)) {
        const fbRoles = yield call(fbFindById, {
          collectionPath: 'roles',
          docName
        });

        let data = {};

        if (fbRoles.exists()) {
          const data = fbRoles.data();
          roles = data[rolesFor] ? data[rolesFor] : [];
        }
      }

      yield put({
        type: `${modelName ? `${modelName}/` : ''}updateState`,
        payload: {
          rolesFor: {
            ...state.rolesFor,
            ...roles
          }
        }
      });
    },

    * updateRoles({ payload }, { put, select }) {
      const state = yield select(state => state[MODEL_NAME]);
      const { docName } = payload;

      yield put({
        type: 'updateState',
        payload: {
          [docName]: { ...state[docName], roles: payload.roles },
          touched: true
        }
      });
    },

    * save({ payload }, { put, call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const state = yield select(state => state[MODEL_NAME]);

      const { component, docName } = payload;

      if (user && ability.can('update', component)) {
        let entity = yield call(fbFindById, { collectionPath: 'roles', docName });

        const userRef = getRef({
          collectionPath: 'users',
          document: user.id
        });

        const metadata = {
          updatedAt: +(new Date),
          updatedByRef: userRef
        };

        const shared = {
          collectionPath: 'roles',
          docName,
          data: {
            roles: [...state[docName]?.roles]
          }
        };

        if (entity.exists()) {
          yield call(fbUpdate, {
            caller: 'save',
            ...shared,
            notice: true,
            data: {
              ...shared.data,
              metadata: {
                ...entity.data().metadata,
                ...metadata
              }
            }
          });

        } else {

          entity = yield call(fbWrite, {
            ...shared,
            data: {
              ...shared.data,
              metadata: {
                createdAt: metadata.updatedAt,
                createdByRef: userRef,
                ...metadata
              }
            }
          });
        }

        entity && (yield put({ type: 'updateState', payload: { touched: false } }));
      }
    },

    * prepareToSave({ payload = {} }, { put }) {
      yield put({ type: 'save', payload });
    },

    * manage({ payload }, { put, call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const state = yield select(state => state[MODEL_NAME]);

      const { component, docName, permissions } = payload;

      if (user && ability.can('update', component)) {
        let entity = yield call(fbFindById, { collectionPath: 'roles', docName });

        const userRef = getRef({
          collectionPath: 'users',
          document: user.id
        });

        const metadata = {
          updatedAt: +(new Date),
          updatedByRef: userRef
        };

        const shared = {
          collectionPath: 'roles',
          docName,
          data: {
            ...state[docName],
            ...permissions
          }
        };

        if (entity.exists()) {
          yield call(fbUpdate, {
            caller: 'manage',
            ...shared,
            notice: true,
            data: {
              ...shared.data,
              metadata: {
                ...entity.data().metadata,
                ...metadata
              }
            }
          });

        } else {

          entity = yield call(fbWrite, {
            ...shared,
            data: {
              ...shared.data,
              metadata: {
                createdAt: metadata.updatedAt,
                createdByRef: userRef,
                ...metadata
              }
            }
          });
        }

        entity && (yield put({ type: 'updateState', payload: { touched: false } }));
      }
    }
  },

  reducers: {}
});
