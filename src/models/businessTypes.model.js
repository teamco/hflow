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
  namespace: 'businessTypesModel',
  state: {},
  subscriptions: {
    setupHistory({history, dispatch}) {
      monitorHistory({history, dispatch}, 'businessTypesModel');
    },
    setup({dispatch}) {
    }
  },
  effects: {

    * query({payload}, {call, put, select}) {
      const {user, ability} = yield select(state => state.authModel);
      let businessTypes = {};

      if (user && ability.can('read', 'businessTypes')) {

        const fbTypes = yield call(fbFindById, {
          collection: 'businessSetup',
          doc: 'types'
        });

        let data = {};

        if (fbTypes.exists) {
          businessTypes = fbTypes.data();
          data = businessTypes?.metadata ? businessTypes : {};
        }

        data.metadata = yield call(detailsInfo, {entity: data, user});

        yield put({
          type: 'toForm',
          payload: {
            model: 'businessTypesModel',
            form: {...data}
          }
        });

        yield put({
          type: 'updateState',
          payload: {isEdit: !!(fbTypes.exists)}
        });
      }

      yield put({type: 'updateState', payload: {businessTypes}});
    },

    * save({payload}, {call, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const state = yield select(state => state.businessTypesModel);

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
              roles: [...state[doc].roles]
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
              roles: [...state[doc].roles]
            }
          });
        }
      }
    },

    * prepareToSave({payload}, {put}) {
      yield put({type: 'save', payload: {doc: 'businessTypes'}});
    }
  },
  reducers: {}
});
