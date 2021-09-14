/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { fbAdd, fbSignOut, fbUpdate, firebaseAppAuth } from 'services/firebase.service';
import {
  findUser,
  getUserRoles,
  gravatarUrl,
  handleUserSessionTimeout,
  updateFbUserEmail
} from 'services/user.service';
import { history } from 'umi';
import { defineAbilityFor } from 'utils/auth/ability';

/**
 * @export
 * @default
 */
export default dvaModelExtend(commonModel, {
  namespace: 'authModel',
  state: {
    MIN_PASSWORD_LENGTH: 8,
    registerData: {},
    user: null,
    isSignedOut: false,
    ability: null
  },
  subscriptions: {
    setupHistory(setup) {
    },
    setup({ dispatch }) {
    }
  },

  effects: {

    * signIn({ payload }, { call, put, select }) {
      if (!payload.user) {
        return false;
      }

      const { registerData = {}, isSignedOut } = yield select(state => state.authModel);

      if (isSignedOut) {
        return false;
      }

      const {
        uid,
        displayName,
        email,
        emailVerified,
        isAnonymous,
        metadata,
        providerData,
        photoURL
      } = payload.user;

      const { creationTime, lastSignInTime } = metadata;

      const userProps = {
        uid,
        displayName: displayName || registerData.displayName || null,
        email,
        emailVerified,
        isAnonymous,
        metadata: {
          creationTime,
          lastSignInTime,
          signedIn: true,
          isLocked: true,
          photoURL: photoURL || registerData.photoURL || null,
          providerId: providerData[0].providerId,
          updatedAt: +(new Date)
        }
      };

      /**
       * @type {{docId, data: {roles}}}
       * @private
       */
      let _userExist = yield call(findUser, {
        uid,
        emailVerified,
        metadata: {
          signedIn: true,
          lastSignInTime,
          updatedAt: +(new Date)
        }
      });

      if (_userExist?.docId) {

        yield call(fbUpdate, {
          collection: 'users',
          docId: _userExist.docId,
          data: { ..._userExist.data, id: _userExist.docId }
        });

      } else {

        _userExist = yield call(fbAdd, { collection: 'users', data: userProps });

        if (_userExist?.docId) {
          if (registerData.isBusinessUser) {
            yield put({
              type: 'businessModel/finishRegistration',
              payload: { user: _userExist }
            });
          }

          history.push(`/admin/users/${_userExist?.docId}`);
        }
      }

      if (_userExist?.docId) {
        _userExist.data.roles = yield call(getUserRoles, { user: _userExist });

        yield put({
          type: 'updateState',
          payload: {
            user: _userExist.data,
            isSignedOut: false,
            ability: yield call(defineAbilityFor, { user: _userExist.data })
          }
        });

        yield put({
          type: 'updateState',
          payload: { registerData: {} }
        });

        yield call(handleUserSessionTimeout);

      } else {
        // TODO (teamco): Show error.
      }
    },

    * registerData({ payload }, { call, put }) {
      if (!payload.registerData) {
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

      yield put({
        type: 'updateState',
        payload: {
          registerData: { ...userProps }
        }
      });
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
        yield call(fbUpdate, { collection: 'users', docId: _userExist.docId, data: _userExist.data });
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

    * defineAbilities({ payload }, { call, put, select }) {
      const { user } = yield select(state => state.authModel);
      const ability = yield call(defineAbilityFor, { user });

      yield put({
        type: 'updateState',
        payload: { ability }
      });
    },

    * signOut({ payload }, { call, put, select }) {
      const state = yield select(state => state.authModel);
      const { user } = payload;

      // Clear garbage.
      if (!user) {
        yield call(fbSignOut);

        return yield put({
          type: 'updateState',
          payload: {
            user: null,
            isSignedOut: false,
            ability: yield call(defineAbilityFor, { user: null })
          }
        });
      }

      const _userExist = yield call(findUser, {
        uid: user.uid,
        metadata: {
          forceSignOut: false,
          signedIn: false,
          updatedAt: +(new Date)
        }
      });

      if (_userExist.docId) {
        yield call(fbUpdate, { collection: 'users', docId: _userExist.docId, data: _userExist.data });

        if (state.user?.uid === user.uid) {
          yield put({
            type: 'updateState',
            payload: {
              user: null,
              isSignedOut: true,
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
