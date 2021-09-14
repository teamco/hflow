/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { detailsInfo } from 'services/cross.model.service';
import { fbFindById, fbUpdate, fbWrite } from 'services/firebase.service';
import { monitorHistory } from 'utils/history';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'startersAndDessertsModel',
  state: {},
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, 'startersAndDessertsModel');
    },
    setup({ dispatch }) {
    }
  },
  effects: {
    * query({ payload }, { call, put, select }) {
      const { user } = yield select(state => state.authModel);
      const entity = yield call(fbFindById, {
        collection: 'mainBusiness',
        doc: 'startersAndDesserts'
      });

      if (user && entity.exists) {
        const data = entity.data();

        yield put({
          type: 'updateTags',
          payload: { tags: data.tags }
        });

        data.metadata = yield call(detailsInfo, { entity: data, user });

        yield put({
          type: 'toForm',
          payload: {
            model: 'startersAndDessertsModel',
            form: { ...data }
          }
        });
      }

      yield put({
        type: 'updateState',
        payload: { isEdit: !!entity.exists }
      });
    },

    * prepareToSave({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);

      let entity = yield call(fbFindById, {
        collection: 'mainBusiness',
        doc: 'startersAndDesserts'
      });

      if (user && ability.can('update', 'startersAndDesserts')) {
        const metadata = {
          updatedAt: +(new Date),
          updatedBy: user.uid
        };

        if (entity.exists) {
          yield call(fbUpdate, {
            collection: 'mainBusiness',
            docId: 'startersAndDesserts',
            data: {
              metadata,
              ...payload
            }
          });
        } else {
          entity = yield call(fbWrite, {
            collection: 'mainBusiness',
            doc: 'startersAndDesserts',
            data: {
              metadata: {
                createdAt: +(new Date),
                createdBy: user.uid,
                ...metadata
              },
              ...payload
            }
          });
        }
      }

      yield put({ type: 'query' });
    }
  },
  reducers: {}
});
