/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { detailsInfo } from 'services/cross.model.service';
import { fbFindById, fbUpdate, fbWrite, getRef } from 'services/firebase.service';
import { monitorHistory } from 'utils/history';
import { subscriptions } from '../pages/subscriptions/subscriptions';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'subscriptionsTypesModel',
  state: {},
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, 'subscriptionsTypesModel');
    },
    setup({ dispatch }) {
    }
  },
  effects: {

    * query({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      let businessTypes = { types: [] };

      if (user && ability.can('read', 'subscriptionsTypes')) {

        const fbTypes = yield call(fbFindById, {
          collection: 'subscriptionsConfig',
          doc: 'types'
        });

        let data = {};

        if (fbTypes.exists) {
          const subscriptionsTypes = fbTypes.data();
          data = subscriptionsTypes?.metadata ? subscriptionsTypes : {};
        }
        if (!data) {
          data.metadata = yield call(detailsInfo, { entity: data, user })
        };


        yield put({
          type: 'toForm',
          payload: {
            model: 'subscriptionsTypesModel',
            form: { ...data }
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

      yield put({ type: 'updateState', payload: { businessTypes } });
    },

    * prepareToSave({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { tags } = yield select(state => state.subscriptionsTypesModel);

      const _db = { collection: 'subscriptionsConfig', doc: 'types' };

      if (user && ability.can('update', 'subscriptionsTypes')) {
        let entity = yield call(fbFindById, _db);

        const userRef = getRef({
          collection: 'users',
          doc: user.id
        });

        const metadata = {
          updatedAt: +(new Date),
          updatedByRef: userRef
        };

        if (entity.exists) {

          entity = entity.data();

          yield call(fbUpdate, {
            ..._db,
            data: {
              metadata: {
                ...entity.metadata,
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
                createdByRef: userRef,
                ...metadata
              },
              types: [...tags]
            }
          });

          yield put({ type: 'updateState', payload: { isEdit: true } });
        }

        let data = {};
        data.metadata = yield call(detailsInfo, { entity, user });

        yield put({
          type: 'toForm',
          payload: {
            model: 'subscriptionsTypesModel',
            form: { ...data }
          }
        });
      }
    }
  },
  reducers: {}
});
