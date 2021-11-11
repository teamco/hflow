/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { detailsInfo } from 'services/cross.model.service';
import { fbFindById, fbUpdate, fbWrite, getRef } from 'services/firebase.service';
import { monitorHistory } from 'utils/history';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace    : 'userRolesModel',
  state        : {
    userRoles    : {},
    businessRoles: {}
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, 'userRolesModel');
    },
    setup({ dispatch }) {
    }
  },
  effects      : {

    * query({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      let userRoles = {};
      let businessRoles = {};

      if (user && ability.can('read', 'roles')) {

        const fbUserRoles = yield call(fbFindById, {
          collection: 'roles',
          doc       : 'userRoles'
        });

        const fbBusinessRoles = yield call(fbFindById, {
          collection: 'roles',
          doc       : 'businessRoles'
        });

        let data = {};

        if (fbUserRoles.exists) {
          userRoles = fbUserRoles.data();
          data = userRoles?.metadata ? userRoles : {};
        }

        if (fbBusinessRoles.exists) {
          businessRoles = fbBusinessRoles.data();
          data = businessRoles?.metadata ? businessRoles : {};
        }

        data.metadata = yield call(detailsInfo, { entity: data, user });

        yield put({
          type   : 'toForm',
          payload: {
            model: 'userRolesModel',
            form : { ...data }
          }
        });

        yield put({
          type   : 'updateState',
          payload: { isEdit: !!(fbUserRoles.exists || fbBusinessRoles.exist) }
        });
      }

      yield put({
        type   : 'updateState',
        payload: {
          userRoles,
          businessRoles
        }
      });
    },

    * updateUserRoles({ payload }, { put, select }) {
      const { userRoles } = yield select(state => state.userRolesModel);
      yield put({
        type   : 'updateState',
        payload: { userRoles: { ...userRoles, roles: payload.roles } }
      });
    },

    * updateBusinessRoles({ payload }, { put, select }) {
      const { businessRoles } = yield select(state => state.userRolesModel);
      yield put({
        type   : 'updateState',
        payload: { businessRoles: { ...businessRoles, roles: payload.roles } }
      });
    },

    * save({ payload }, { call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const state = yield select(state => state.userRolesModel);

      const { doc } = payload;

      if (user && ability.can('update', 'roles')) {
        let entity = yield call(fbFindById, { collection: 'roles', doc });

        const userRef = getRef({
          collection: 'users',
          doc       : user.id
        });

        const metadata = {
          updatedAt   : +(new Date),
          updatedByRef: userRef
        };

        if (entity.exists) {
          yield call(fbUpdate, {
            collection: 'roles',
            doc       : doc,
            data      : {
              metadata: {
                ...entity.data().metadata,
                ...metadata
              },
              roles   : [...state[doc].roles]
            }
          });

        } else {

          entity = yield call(fbWrite, {
            collection: 'roles',
            doc,
            data      : {
              metadata: {
                createdAt   : metadata.updatedAt,
                createdByRef: userRef,
                ...metadata
              },
              roles   : [...state[doc].roles]
            }
          });
        }
      }
    },

    * prepareToSave({ payload }, { put }) {
      yield put({ type: 'save', payload: { doc: 'userRoles' } });
      yield put({ type: 'save', payload: { doc: 'businessRoles' } });
    }
  },
  reducers     : {}
});
