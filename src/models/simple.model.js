/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { detailsInfo } from '@/services/cross.model.service';
import { fbFindById, fbUpdate, fbWrite, getRef } from '@/services/firebase.service';
import { monitorHistory } from '@/utils/history';

const MODEL_NAME = 'simpleModel';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: {},
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, MODEL_NAME);
    },
    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },
  effects: {

    * query({ payload }, { call, put, select, take }) {
      const { user, ability } = yield select(state => state.authModel);
      const { docName, component } = payload;

      let businessEntities = { tags: [] };

      if (user && ability.can('read', component)) {
        const fbEntities = yield call(fbFindById, { collectionPath: 'simpleEntities', docName });

        let data = {};

        if (fbEntities.exists()) {
          businessEntities = fbEntities.data();
          data = businessEntities?.metadata ? businessEntities : {};
        }

        data.metadata = yield call(detailsInfo, { entity: data, user });

        yield put({
          type: 'toForm',
          payload: {
            model: MODEL_NAME,
            form: { ...data }
          }
        });

        yield put({
          type: 'updateState',
          payload: {
            touched: false,
            tags: [...businessEntities?.tags],
            isEdit: !!(fbEntities.exists())
          }
        });
      }

      yield put({ type: 'updateState', payload: { businessEntities } });
    },

    * prepareToSave({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { tags } = yield select(state => state[MODEL_NAME]);
      const { docName, component, ...rest } = payload;

      const _db = { collectionPath: 'simpleEntities', docName };

      if (user && ability.can('update', component)) {
        let entity = yield call(fbFindById, _db);

        const userRef = getRef({
          collectionPath: 'users',
          document: user.id
        });

        const metadata = {
          updatedAt: +(new Date),
          updatedByRef: userRef
        };

        if (entity.exists()) {

          entity = entity.data();

          yield call(fbUpdate, {
            caller: 'prepareToSave',
            ..._db,
            notice: true,
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
