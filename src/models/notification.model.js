/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import {commonModel} from 'models/common.model';
import {getNotifications} from '../services/notification.service';
import {message} from 'antd';
import i18n from '../utils/i18n';
import {history} from 'umi';
import {fbAdd, fbMultipleUpdate} from '../services/firebase.service';
import {STATUS} from '../utils/message';

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
      const {userId} = payload;

      if (user && ability.can('read', 'notifications')) {

        const {data = []} = yield call(getNotifications, {userId: userId ? userId : user.id});

        yield call(fbMultipleUpdate, {
          collection: 'notifications',
          docs: data.map(data => data.id),
          value: {read: true}
        });

        yield put({type: 'updateState', payload: {notifications: data}});
        yield put({type: 'getCount', payload: data});

      } else {

        yield call(message.warning, i18n.t('error:page403'));
        history.push(`/errors/403`);
      }
    },

    * getCount({payload = {}}, {put, call, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {badge} = yield select(state => state.notificationModel);
      let {data = []} = payload;

      if (user && ability.can('read', 'notifications')) {

        if (!data.length) {
          const notifications = yield call(getNotifications, {userId: user.id});
          data = notifications.data;
        }

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
    },

    * createAndUpdate({payload}, {put, call, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {status, target, name, description} = payload;

      if (user && ability.can('create', 'notifications')) {

        // Create notification
        yield call(fbAdd, {
          collection: 'notifications',
          data: {
            name,
            description,
            status,
            target,
            createdBy: user.id,
            read: false,
            createdAt: +(new Date)
          }
        });

        yield put({type: 'getCount'});
      }
    }
  },
  reducers: {}
});
