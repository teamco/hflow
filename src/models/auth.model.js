/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { fbAdd, fbSignOut, fbUpdate } from '@/services/firebase.service';
import { findUser, gravatarUrl, handleUserSessionTimeout, updateFbUserEmail } from '@/services/user.service';
import { defineAbilityFor } from '@/utils/auth/ability';
import { defineInstance } from '@/utils/instance';
import { monitorHistory } from '@/utils/history';
import { createServerProfile, getXHRToken } from '@/services/authentication.service';

const MODEL_NAME = 'authModel';

const DEFAULT_STATE = {
  user: null,
  serverUserId: null,
  token: {
    guest: null,
    access: null,
    refresh: null,
    expiredAt: null
  }
};

/**
 * @export
 * @default
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: {
    ...DEFAULT_STATE,
    MIN_PASSWORD_LENGTH: 8,
    registerData: {},
    refreshSignIn: true,
    isSignedOut: false,
    ability: null
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

    * signIn({ payload }, { call, put, select }) {
      const {
        registerData = {},
        isSignedOut,
        refreshSignIn
      } = yield select(state => state[MODEL_NAME]);

      let { user = {}, _userExist } = payload || {};

      let {
        uid = null,
        displayName,
        photoURL,
        email,
        emailVerified,
        isAnonymous,
        metadata = {},
        providerData = []
      } = user || {};

      if (isSignedOut && !Object.keys(registerData).length) {
        return yield put({ type: 'updateState', payload: { isSignedOut: false } });
      }

      let {
        creationTime,
        lastSignInTime,
        providerId
      } = metadata;

      providerId = defineInstance(providerId, providerData[0]?.providerId);

      // Update user props with register data.
      if (registerData.isBusinessUser) {
        displayName = registerData?.displayName;
        photoURL = registerData?.photoURL;
      }

      const userProps = {
        uid,
        displayName,
        email,
        emailVerified,
        isAnonymous,
        metadata: {
          creationTime,
          lastSignInTime,
          photoURL,
          providerId,
          signedIn: true,
          isLocked: true,
          updatedAt: +(new Date)
        }
      };

      if (!_userExist?.docId) {

        /**
         * @type {{docId, id, data: {roles}}}
         * @private
         */
        _userExist = yield call(findUser, {
          uid,
          emailVerified,
          metadata: { ...userProps.metadata }
        });
      }

      if (_userExist?.docId) {

        yield put({ type: 'updateProfile', payload: { _userExist, registerData } });

      } else if (refreshSignIn) {

        yield put({ type: 'createProfile', payload: { userProps } });

      } else {
        // TODO (teamco): Show error.
      }
    },

    * createProfile({ payload }, { call, put }) {
      const { userProps } = payload;

      // Create user
      const _userExist = yield call(fbAdd, { collection: 'users', data: userProps });

      yield put({
        type: 'updateState',
        payload: {
          isSignedOut: false,
          refreshSignIn: false
        }
      });

      yield put({ type: 'signIn', payload: { user: _userExist.data, _userExist } });
    },

    * createServerProfile({ payload }, { call, put, select }) {
      const { token } = yield select(state => state[MODEL_NAME]);
      const { _userExist } = payload;
      const { serverUserId, emailVerified } = _userExist.data;

      if (!serverUserId) {
        const guestToken = yield call(getXHRToken);

        yield put({ type: 'updateState', payload: { token: { ...token, guest: guestToken?.access_token } } });

        if (emailVerified) {
          const { data } = yield call(createServerProfile, {
            uid: _userExist.docId,
            token: guestToken?.access_token
          });

          yield put({ type: 'updateState', payload: { serverUserId: data?.serverUserId } });

          // Update user
          yield call(fbUpdate, {
            collection: 'users',
            doc: _userExist.docId,
            data: { serverUserId: data?.serverUserId }
          });
        } else {
          yield put({ type: `userModel/sendVerification`, payload: { user: _userExist.data } });
        }
      }
    },

    * updateToken({ payload }, { call, put, select }) {
      const { token } = yield select(state => state[MODEL_NAME]);

      const { user } = payload;

      const { data: { access_token, refresh_token, token_validity } } = yield call(getXHRToken, {
        username: user.id,
        password: user.email
      });

      yield put({
        type: 'updateState',
        payload: {
          token: {
            ...token,
            access: access_token,
            refresh: refresh_token,
            expiredAt: parseInt(token_validity, 10)
          }
        }
      });
    },

    /**
     * @function
     * @param {{
     *  registerData: {isBusinessUser: boolean},
     *  _userExist: {data, docId: string, serverUserId: string, emailVerified: boolean}
     * }} payload
     * @param call
     * @param put
     * @return {Generator<*, void, *>}
     */
    * updateProfile({ payload }, { call, put }) {
      const { _userExist, registerData } = payload;
      const _user = { ..._userExist.data, id: _userExist.docId };

      yield put({ type: 'createServerProfile', payload: { _userExist } });
      _user.emailVerified && (yield put({ type: 'updateToken', payload: { user: _user } }));

      const data = { ..._user, roles: [...(_user?.roles || [])] };

      // Update user
      yield call(fbUpdate, {
        collection: 'users',
        doc: _user.id,
        data
      });

      // Finish business user registration
      if (registerData.isBusinessUser) {
        yield put({ type: 'businessModel/finishRegistration', payload: { _userExist } });
      }

      // Define user abilities
      const ability = yield call(defineAbilityFor, { user: _user, userId: _user.id });

      yield put({
        type: 'updateState',
        payload: {
          user: { ..._user },
          registerData: {},
          isSignedOut: false,
          ability
        }
      });

      yield put({ type: 'appModel/notification' });

      yield call(handleUserSessionTimeout);

      // history.push(`/admin/users/${_userExist?.docId}`);
    },

    * registerData({ payload }, { call, put }) {
      if (!payload?.registerData) {
        // TODO (teamco): Show error.
        return false;
      }

      const { email, firstName, lastName, isBusinessUser } = payload.registerData;
      const photoURL = yield call(gravatarUrl, { email });
      const displayName = `${firstName} ${lastName}`;

      const userProps = {
        displayName,
        photoURL,
        isBusinessUser
      };

      yield put({ type: 'updateState', payload: { registerData: { ...userProps } } });
    },

    * signUp({ payload }, {}) {
      if (!payload.user) {
        return false;
      }
    },

    * updateEmail({ payload }, { call, put }) {
      if (!payload.user) {
        return false;
      }

      const _userExist = yield call(findUser, {
        uid: payload.user.uid,
        email: payload.email,
        metadata: { updatedAt: +(new Date) }
      });

      if (_userExist.docId) {
        // Update local user
        yield call(fbUpdate, { collection: 'users', doc: _userExist.docId, data: _userExist.data });
        // Update fb user
        yield call(updateFbUserEmail, { email: payload.email });

        yield put({
          type: 'updateState',
          payload: {
            user: _userExist.data,
            ability: yield call(defineAbilityFor, { user: _userExist.data })
          }
        });
      }
    },

    * defineAbilities({ payload = {} }, { call, put, select }) {
      const { user } = yield select(state => state[MODEL_NAME]);
      const { userId = user?.id } = payload;

      const ability = yield call(defineAbilityFor, { user, userId });

      yield put({ type: 'updateState', payload: { ability } });
    },

    * signOut({ payload }, { call, put, select }) {
      const state = yield select(state => state[MODEL_NAME]);
      const { user } = payload;

      // Clear garbage.
      if (!user) {
        yield call(fbSignOut);

        return yield put({
          type: 'updateState',
          payload: {
            ...DEFAULT_STATE,
            isSignedOut: false,
            refreshSignIn: true,
            ability: yield call(defineAbilityFor, { user: null })
          }
        });
      }

      const _userExist = yield call(findUser, {
        uid: user.uid,
        metadata: {
          forceSignOut: false,
          refreshSignIn: true,
          signedIn: false,
          updatedAt: +(new Date)
        }
      });

      if (_userExist.docId) {
        yield call(fbUpdate, { collection: 'users', doc: _userExist.docId, data: _userExist.data });

        if (state.user?.uid === user.uid) {
          yield put({
            type: 'updateState',
            payload: {
              ...DEFAULT_STATE,
              isSignedOut: true,
              refreshSignIn: true,
              ability: yield call(defineAbilityFor, { user: null })
            }
          });

          yield call(fbSignOut);
        }

        //history.push(`/`);
      }
    }
  },
  reducers: {}
});
