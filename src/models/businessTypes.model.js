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
      let businessTypes = {types: []};

      if (user && ability.can('read', 'businessTypes')) {

        const fbTypes = yield call(fbFindById, {
          collection: 'businessConfig',
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
          payload: {
            tags: [...businessTypes?.types],
            isEdit: !!(fbTypes.exists)
          }
        });
      }

      yield put({type: 'updateState', payload: {businessTypes}});
    },

    * prepareToSave({payload}, {call, put, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {tags} = yield select(state => state.businessTypesModel);

      const _db = {collection: 'businessConfig', doc: 'types'};

      if (user && ability.can('update', 'businessTypes')) {
        let entity = yield call(fbFindById, _db);

        const metadata = {
          updatedAt: +(new Date),
          updatedBy: user.uid
        };

        if (entity.exists) {
          yield call(fbUpdate, {
            ..._db,
            data: {
              metadata: {
                ...entity.data().metadata,
                ...metadata
              },
              types: [...tags]
            }
          });

        } else {

          entity = yield call(fbWrite, {
            ..._db,
            data: {
              metadata: {
                createdAt: metadata.updatedAt,
                createdBy: user.uid,
                ...metadata
              },
              types: [...tags]
            }
          });

          yield put({type: 'updateState', payload: {isEdit: true}});
        }

        let data = {};
        data.metadata = yield call(detailsInfo, {entity, user});

        yield put({
          type: 'toForm',
          payload: {
            model: 'businessTypesModel',
            form: {...data}
          }
        });
      }
    }
  },
  reducers: {}
});
