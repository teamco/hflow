/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { fbFindById, fbUpdate } from '@/services/firebase.service';
import {
  findUser,
  forceSignOutUser,
  getUsers,
  sendVerificationEmail
} from '@/services/user.service';

import { monitorHistory } from '@/utils/history';

const MODEL_NAME = 'userModel';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: {
    profiles: [1],
    selectedProfile: null,
    selectedUser: null,
    data: [],
    gridLayout: true,
    verificationSent: false
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, MODEL_NAME);
    },
    setup({ dispatch }) {
      // TODO (teamco): Do something.
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

      yield put({ type: 'updateState', payload: { data } });
    },

    * updateQuery({ payload }, { call, put, select }) {
      const { user } = yield select(state => state.authModel);
      const { _userExist } = payload;

      if (_userExist.docId) {
        yield call(fbUpdate, {
          notice: true,
          caller: 'updateQuery',
          collectionPath: 'users',
          docName: _userExist.docId,
          data: _userExist.data
        });
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

      yield put({ type: 'authModel/signOut', payload: { user: data } });
    },

    * delete({ payload }, { put }) {
      const { user } = payload;

      if (user.metadata.isLocked) {
        // return message.warning(useIntl().formatMessage(
        //     {
        //       id: 'auth.errorLockedDelete',
        //       defaultMessage: `Unable to delete ${user.email}, user is locked`
        //     }, { instance: user.email }
        // )).then();
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

      yield put({ type: 'updateQuery', payload: { _userExist } });
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

      yield put({ type: 'updateQuery', payload: { _userExist } });
    },

    * validateUser({ payload }, { put }) {
      const { selectedUser, userId } = payload;

      if (selectedUser?.id === userId) {
        // TODO (teamco): Do something.
      } else {
        yield put({ type: 'getUser', payload: { userId } });
      }
    },

    * getUser({ payload = {} }, { put, call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { userId = user?.id } = payload;

      if (userId) {
        if (ability.can('read', 'profile')) {
          const _user = yield call(fbFindById, {
            collectionPath: 'users',
            docName: userId
          });

          if (_user?.exists()) {
            const selectedUser = { ..._user.data(), ...{ id: _user.id } };
            return yield put({
              type: 'updateState',
              payload: { selectedUser }
            });
          }

          yield put({
            type: 'notFound',
            payload: { entity: 'User', key: 'selectedUser' }
          });
        }
      }
    },

    * updateRoles({ payload }, { put, call, select }) {
      const { ability } = yield select(state => state.authModel);
      const { selectedUser, roles } = payload;

      const canUpdate = ability.can('update', 'userRoles');

      if (canUpdate) {

        // Update user roles
        yield call(fbUpdate, {
          notice: true,
          caller: 'updateRoles',
          collectionPath: 'users',
          docName: selectedUser.id,
          data: { ...selectedUser, roles }
        });

        yield put({
          type: 'updateState',
          payload: {
            touched: false,
            selectedUser: { ...selectedUser, roles }
          }
        });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'selectedUser' } });
      }
    },

    * sendVerification({ payload = {} }, { put, call, select }) {
      const { ability } = yield select(state => state.authModel);
      const { user } = payload;

      const canSend = ability.can('email.verification', 'users');

      if (canSend) {
        let _userExist = yield call(fbFindById, {
          collectionPath: 'users',
          docName: user?.id
        });

        const _sent = _userExist &&
            (yield call(sendVerificationEmail, { user: _userExist.data() }));

        yield put({
          type: 'updateState',
          payload: { verificationSent: _sent }
        });
      }
    }
  },

  reducers: {}
});
