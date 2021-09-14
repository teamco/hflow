/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { message } from 'antd';
import { commonModel } from 'models/common.model';
import { fbFindById, fbReadBy, fbUpdate } from 'services/firebase.service';
import {
  findUser,
  getUsers,
  forceSignOutUser,
  sendVerificationEmail
} from 'services/user.service';
import { defineAbilityFor } from 'utils/auth/ability';
import { monitorHistory } from 'utils/history';
import i18n from 'utils/i18n';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'userModel',
  state: {
    profiles: [1],
    selectedProfile: null,
    selectedUser: null,
    data: [],
    verificationSent: false
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, 'userModel');
    },
    setup({ dispatch }) {
    }
  },

  effects: {

    * query({ payload }, { call, put, select }) {
      const { user } = yield select(state => state.authModel);
      const { data = [] } = yield call(getUsers, { user });

      for (let i = 0, l = data.length; i < l; i++) {
        const user = data[i];
        if (user?.metadata?.forceSignOut) {
          yield put({ type: 'authModel/signOut', payload: { user } });
        }
      }

      yield put({
        type: 'updateState',
        payload: { data }
      });
    },

    * updateQuery({ payload }, { call, put, select }) {
      const { user } = yield select(state => state.authModel);
      const { _userExist } = payload;
      if (_userExist.docId) {
        yield call(fbUpdate, { collection: 'users', docId: _userExist.docId, data: _userExist.data });
      }

      // Update current user.
      if (user && user.email === _userExist.data.email) {
        yield put({
          type: 'authModel/updateState',
          payload: { user: _userExist.data }
        });
      }

      yield put({ type: 'query' });
    },

    * signOutUser({ payload }, { put, call }) {
      const { uid, email } = payload.user;

      const { data } = yield call(forceSignOutUser, { uid, email });

      yield put({
        type: 'authModel/signOut',
        payload: { user: data }
      });
    },

    * delete({ payload }, { put }) {
      const { user } = payload;

      if (user.metadata.isLocked) {
        return message.warning(i18n.t('auth:errorLockedDelete', { instance: user.email })).then();
      } else {
      }
    },

    * lock({ payload }, { put, call }) {
      const { user } = payload;

      let _userExist = yield call(findUser, {
        uid: user.uid,
        metadata: {
          isLocked: true,
          updatedAt: +(new Date)
        }
      });

      yield put({
        type: 'updateQuery',
        payload: { _userExist }
      });
    },

    * unlock({ payload }, { put, call }) {
      const { user } = payload;

      let _userExist = yield call(findUser, {
        uid: user.uid,
        metadata: {
          isLocked: false,
          updatedAt: +(new Date)
        }
      });

      yield put({
        type: 'updateQuery',
        payload: { _userExist }
      });
    },

    * validateUser({ payload }, { put }) {
      const { selectedUser, userId } = payload;

      if (selectedUser?.id === userId) {
        // TODO (teamco): Do something.
      } else {
        yield put({ type: 'getUser', payload: { userId } });
      }
    },

    * getUser({ payload }, { put, call, select }) {
      const { user } = yield select(state => state.authModel);
      const { userId } = payload;

      if (user?.uid) {
        const ability = yield call(defineAbilityFor, { user, userId });

        yield put({
          type: 'authModel/updateState',
          payload: { ability }
        });

        if (ability.can('read', 'profile')) {
          const _user = yield call(fbFindById, {
            collection: 'users',
            doc: userId
          });

          if (_user.exists) {
            const selectedUser = { ..._user.data(), ...{ id: _user.id } };

            return yield put({
              type: 'updateState',
              payload: { selectedUser }
            });
          }

          yield put({
            type: 'raiseCondition',
            payload: {
              message: i18n.t('error:notFound', { entity: 'User' }),
              key: 'selectedUser'
            }
          });
        }
      }
    },

    * sendVerification({ payload }, { put, call, select }) {
      const { ability } = yield select(state => state.authModel);

      const canSend = ability.can('sendVerificationEmail', 'users');

      let _userExist = yield call(fbFindById, {
        collection: 'users',
        doc: payload.user.id
      });

      const _sent = _userExist && canSend && (yield call(sendVerificationEmail, { user: _userExist }));

      yield put({
        type: 'updateState',
        payload: { verificationSent: _sent }
      });
    }
  },
  reducers: {}
});
