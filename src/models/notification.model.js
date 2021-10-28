/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import {commonModel} from 'models/common.model';
import {getNotifications} from '../services/notification.service';
import {message} from 'antd';
import i18n from '../utils/i18n';
import {history} from 'umi';
import {fbAdd, fbFindById, fbMultipleUpdate, fbUpdate} from '../services/firebase.service';
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
    notifications: {
      sent: [],
      inbox: []
    }
  },
  subscriptions: {
    setupHistory(setup) {
    },
    setup({dispatch}) {
    }
  },
  effects: {
    * query({payload}, {call, put, select}) {
      let {user, ability} = yield select(state => state.authModel);
      const {userId} = payload;

      if (user && ability.can('read', 'notifications')) {
        if (userId && ability.can('read', 'profile')) {
          const _user = yield call(fbFindById, {
            collection: 'users',
            doc: userId
          });

          if (_user.exists) {
            user = _user.data();
          } else {
            return yield put({
              type: 'raiseCondition',
              payload: {
                message: i18n.t('error:notFound', {entity: 'User'}),
                key: 'selectedUser'
              }
            });
          }
        }

        const {sent = [], inbox = []} = yield call(getNotifications, {userId: user.id, email: user.email});

        // yield call(fbMultipleUpdate, {
        //   collection: 'notifications',
        //   docs: inbox.map(data => data.id),
        //   value: {read: true}
        // });

        yield put({type: 'updateState', payload: {notifications: {sent, inbox}}});
        yield put({type: 'getCount', payload: inbox});

      } else {

        yield call(message.warning, i18n.t('error:page403'));
        history.push(`/errors/403`);
      }
    },

    * getCount({payload = {}}, {put, call, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {badge} = yield select(state => state.notificationModel);
      let {inbox = []} = payload;

      if (user && ability.can('read', 'notifications')) {

        if (!inbox.length) {
          const notifications = yield call(getNotifications, {userId: user.id, email: user.email});
          inbox = notifications.inbox;
        }

        yield put({
          type: 'updateState',
          payload: {
            badge: {
              count: inbox.filter(n => !n.read).length,
              overflow: badge.overflow
            }
          }
        });
      }
    },

    * createAndUpdate({payload}, {put, call, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {type, status, sentTo, title, description, isPrivate, read = false} = payload;

      if (user && ability.can('create', 'notifications')) {

        // Create notification
        yield call(fbAdd, {
          collection: 'notifications',
          data: {
            type,
            title,
            description,
            status,
            sentTo,
            metadata: {
              createdBy: user.id,
              createdAt: +(new Date)
            },
            isPrivate,
            read
          }
        });

        yield put({type: 'getCount'});
      }
    },

    * read({payload}, {put, call, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {notifications} = yield select(state => state.notificationModel);
      const {doc} = payload;

      if (user && ability.can('update', 'notifications')) {

        // Update notifications
        yield call(fbUpdate, {
          collection: 'notifications',
          doc,
          data: {
            read: true,
            status: STATUS.read,
            'metadata.updatedAt': +(new Date())
          }
        });

        let key, msg, i;
        const updatedNotices = [];

        for (key in notifications) {
          const instances = notifications[key];
          for (i = 0; i < instances.length; i++) {
            msg = {...[...instances][i]};
            if (msg.id === doc) {
              msg.read = true;
              msg.status = STATUS.read;
            }

            updatedNotices.push(msg);
          }
        }

        yield put({
          type: 'updateState',
          payload: {
            notifications: {
              ...notifications,
              [key]: updatedNotices
            }
          }
        });
      }
    }
  },
  reducers: {}
});
