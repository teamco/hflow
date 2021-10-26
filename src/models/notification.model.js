/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import {commonModel} from 'models/common.model';
import {getNotifications} from '../services/notification.service';
import {message} from 'antd';
import i18n from '../utils/i18n';
import {history} from 'umi';
import {fbMultipleUpdate} from '../services/firebase.service';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'notificationModel',
  state: {
    badge: {
      count: 0,
      overflow: 10
    },
    notifications: []
  },
  subscriptions: {
    setupHistory(setup) {
    },
    setup({dispatch}) {
    }
  },
  effects: {
    * query({payload}, {call, put, select}) {
      const {user, ability} = yield select(state => state.authModel);

      if (user && ability.can('read', 'notifications')) {

        const {data = []} = yield call(getNotifications, {userId: user.id});

        yield call(fbMultipleUpdate, {
          collection: 'notifications',
          docs: data.map(data => data.id),
          value: {read: true}
        });

        yield put({type: 'updateState', payload: {notifications: data}});

      } else {

        yield call(message.warning, i18n.t('error:page403'));
        history.push(`/errors/403`);
      }
    },

    * getCount(_, {put, call, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {badge} = yield select(state => state.notificationModel);

      if (user && ability.can('read', 'notifications')) {

        const {data = []} = yield call(getNotifications, {userId: user.id});

        yield put({
          type: 'updateState',
          payload: {
            badge: {
              count: data.filter(n => !n.read).length,
              overflow: badge.overflow
            }
          }
        });
      }
    }
  },
  reducers: {}
});
