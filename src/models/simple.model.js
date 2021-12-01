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
  namespace: 'simpleModel',
  state: {},
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, 'simpleModel');
    },
    setup({ dispatch }) {
    }
  },
  effects: {

    * query({ payload }, { call, put, select, take }) {
      const { user, ability } = yield select(state => state.authModel);
      const { doc, component } = payload;

      let businessEntities = { tags: [] };

      if (user && ability.can('read', component)) {

        const fbEntities = yield call(fbFindById, { collection: 'simpleEntities', doc });

        let data = {};

        if (fbEntities.exists) {
          businessEntities = fbEntities.data();
          data = businessEntities?.metadata ? businessEntities : {};
        }

        data.metadata = yield call(detailsInfo, { entity: data, user });

        yield put({
          type: 'toForm',
          payload: {
            model: 'simpleModel',
            form: { ...data }
          }
        });

        yield put({
          type: 'updateState',
          payload: {
            touched: false,
            tags: [...businessEntities?.tags],
            isEdit: !!(fbEntities.exists)
          }
        });
      }

      yield put({ type: 'updateState', payload: { businessEntities } });
    },

    * prepareToSave({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { tags } = yield select(state => state.simpleModel);
      const { doc, component, ...rest } = payload;

      const _db = { collection: 'simpleEntities', doc };

      if (user && ability.can('update', component)) {
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
              tags: [...tags],
              ...rest
            }
          });

        } else {

          yield call(fbWrite, {
            ..._db,
            data: {
              metadata: {
                createdAt: metadata.updatedAt,
                createdByRef: userRef,
                ...metadata
              },
              tags: [...tags],
              ...rest
            }
          });
        }

        yield put({ type: 'query', payload });
      }
    }
  },
  reducers: {}
});
