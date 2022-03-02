/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { message } from 'antd';
import { history, useIntl } from 'umi';

import { commonModel } from '@/models/common.model';
import { getNotifications } from '@/services/notification.service';
import { fbAdd, fbFindById, fbUpdate, getRef } from '@/services/firebase.service';

import { STATUS } from '@/utils/message';
import { monitorHistory } from '@/utils/history';

const MODEL_NAME = 'notificationModel';
const ABILITY_FOR = 'notifications';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
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
    setupHistory({ history, dispatch }) {
      return monitorHistory({ history, dispatch }, MODEL_NAME);
    },
    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },
  effects: {

    * query({ payload }, { call, put, select }) {
      let { user, ability } = yield select(state => state.authModel);
      const { userId } = payload;

      if (user && ability.can('read', ABILITY_FOR)) {
        if (userId && ability.can('read', 'profile')) {
          const _user = yield call(fbFindById, {
            collection: 'users',
            doc: userId
          });

          if (_user.exists) {
            user = _user.data();
          } else {
            return yield put({ type: 'notFound', payload: { entity: 'User', key: 'selectedUser' } });
          }
        }

        const { sent = [], inbox = [] } = yield call(getNotifications, { userId: user.id, email: user.email });

        yield put({ type: 'updateState', payload: { notifications: { sent, inbox } } });
        yield put({ type: 'getCount', payload: inbox });

      } else {

        yield call(message.warning, useIntl().formatMessage({id: 'error:page403', defaultMessage: 'Sorry, you are not authorized to access this page'}));
        history.push(`/errors/403`);
      }
    },

    * getCount({ payload = {} }, { put, call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { badge } = yield select(state => state[MODEL_NAME]);
      let { inbox = [] } = payload;

      if (user && ability.can('read', ABILITY_FOR)) {

        if (!inbox.length) {
          const notifications = yield call(getNotifications, { userId: user.id, email: user.email });
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

    * createAndUpdate({ payload }, { put, call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { type, status, replyTo, sentTo, title, description, isPrivate, read = false } = payload;

      if (user && ability.can('create', ABILITY_FOR)) {

        let replyRef = null;
        if (replyTo) {
          replyRef = getRef({ collection: 'notifications', doc: replyTo });
          yield put({ type: 'setAsRead', payload: { doc: replyTo, status: STATUS.answered } });
        }

        const userRef = getRef({ collection: 'users', doc: user.id });

        // Create notification
        yield call(fbAdd, {
          collection: 'notifications',
          data: {
            type,
            title,
            description,
            status,
            sentTo,
            replyRef,
            metadata: {
              createdByRef: userRef,
              createdAt: +(new Date)
            },
            isPrivate,
            read
          }
        });

        yield put({ type: 'getCount' });
      }
    },

    * setAsRead({ payload }, { put, call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { notifications } = yield select(state => state[MODEL_NAME]);
      const { doc, status = STATUS.read } = payload;

      if (user && ability.can('update', ABILITY_FOR)) {

        // Update notifications
        yield call(fbUpdate, {
          collection: 'notifications',
          doc,
          data: {
            read: true,
            status,
            'metadata.updatedAt': +(new Date())
          }
        });

        let key, msg, i;
        let updatedNotices = [];

        for (key in notifications) {
          const instances = notifications[key];
          if (key === 'inbox') {
            for (i = 0; i < instances.length; i++) {
              updatedNotices = [...instances];
              msg = { ...[...instances][i] };
              if (msg.id === doc) {
                msg.read = true;
                msg.status = status;
                updatedNotices[i] = msg;

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
          }
        }
      }
    }
  },

  reducers: {}
});
