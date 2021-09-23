/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import {commonModel} from 'models/common.model';
import {detailsInfo} from 'services/cross.model.service';
import {fbFindById, fbUpdate, fbWrite} from 'services/firebase.service';
import {monitorHistory} from 'utils/history';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'userRolesModel',
  state: {
    userRoles: {},
    businessRoles: {}
  },
  subscriptions: {
    setupHistory({history, dispatch}) {
      monitorHistory({history, dispatch}, 'userRolesModel');
    },
    setup({dispatch}) {
    }
  },
  effects: {

    * query({payload}, {call, put, select}) {
      const {user, ability} = yield select(state => state.authModel);
      let userRoles = {};
      let businessRoles = {};

      if (user && ability.can('read', 'roles')) {
        const fbUserRoles = yield call(fbFindById, {
          collection: 'roles',
          doc: 'userRoles'
        });

        const fbBusinessRoles = yield call(fbFindById, {
          collection: 'roles',
          doc: 'businessRoles'
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

        data.metadata = yield call(detailsInfo, {entity: data, user});

        yield put({
          type: 'toForm',
          payload: {
            model: 'userRolesModel',
            form: {...data}
          }
        });

        yield put({
          type: 'updateState',
          payload: {isEdit: !!(fbUserRoles.exists || fbBusinessRoles.exist)}
        });
      }

      yield put({
        type: 'updateState',
        payload: {
          userRoles,
          businessRoles
        }
      });
    },

    * updateUserRoles({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {userRoles: payload.roles}
      });
    },

    * updateBusinessRoles({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {businessRoles: payload.roles}
      });
    },

    * save({payload}, {call, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const state = yield select(state => state.userRolesModel);

      const {doc} = payload;

      if (user && ability.can('update', 'roles')) {
        let entity = yield call(fbFindById, {collection: 'roles', doc});

        const metadata = {
          updatedAt: +(new Date),
          updatedBy: user.uid
        };

        if (entity.exists) {
          yield call(fbUpdate, {
            collection: 'roles',
            docId: doc,
            data: {
              metadata: {
                ...entity.data().metadata,
                ...metadata
              },
              roles: [...state[doc]]
            }
          });

        } else {

          entity = yield call(fbWrite, {
            collection: 'roles',
            doc,
            data: {
              metadata: {
                createdAt: metadata.updatedAt,
                createdBy: user.uid,
                ...metadata
              },
              roles: [...state[doc]]
            }
          });
        }
      }
    },

    * prepareToSave({payload}, {put}) {
      yield put({type: 'save', payload: {doc: 'userRoles'}});
      yield put({type: 'save', payload: {doc: 'businessRoles'}});

      yield put({type: 'query'});
    }
  },
  reducers: {}
});
