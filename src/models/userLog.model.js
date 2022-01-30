/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import _ from 'lodash';

import { commonModel } from 'models/common.model';
import { fbReadAll, getRef } from 'services/firebase.service';
import { isLocalHost } from '@/utils/window';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'userLogModel',
  state: {
    data: []
  },
  subscriptions: {
    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },
  effects: {

    * query({ payload }, { put, call }) {
      let data = [];

      /**
       * @constant
       * @type {{forEach}}
       */
      const users = yield call(fbReadAll, { collection: 'userLogs' });
      users.forEach(doc => {
        const _data = doc.data();
        data.push(_.merge(_data, { id: doc.id }));
      });

      yield put({
        type: 'updateState',
        payload: {
          data: data.sort((a, b) =>
              (a.createdAt > b.createdAt) ? 1 :
                  ((b.createdAt > a.createdAt) ? -1 : 0)).reverse()
        }
      });
    },

    * monitor({ payload }, { call, select }) {
      const { referrer } = yield select(state => state.appModel);
      const { user } = yield select(state => state.authModel);
      const { namespace, eventType, duration } = payload;

      const userRef = getRef({
        collection: 'users',
        doc: user?.uid
      });

      const data = {
        referrer,
        location,
        namespace,
        eventType,
        duration,
        metadata: {
          createdAt: +(new Date()),
          createdByRef: userRef
        }
      };

      const logExist = isLocalHost() ? null : null;

      // TODO (teamco): Provide user log abilities.
      // yield call(fbAdd, { collection: 'userLogs', data, notice: false });

      if (logExist?.docId) {
        // TODO (teamco): Do something
      }
    }
  },
  reducers: {}
});
