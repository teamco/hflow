/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import {history} from 'umi';

import {commonModel} from 'models/common.model';
import {fbAdd, fbSignOut, fbUpdate} from 'services/firebase.service';
import {
  findUser,
  getUserRoles,
  gravatarUrl,
  handleUserSessionTimeout,
  updateFbUserEmail
} from 'services/user.service';
import {defineAbilityFor} from 'utils/auth/ability';
import {defineInstance} from 'utils/instance';

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
    refreshSignIn: true,
    isSignedOut: false,
    ability: null
  },
  subscriptions: {
    setupHistory(setup) {
    },
    setup({dispatch}) {
    }
  },

  effects: {

    * signIn({payload}, {call, put, select}) {
      const {
        registerData = {},
        isSignedOut,
        refreshSignIn
      } = yield select(state => state.authModel);

      const {user = {}} = payload || {};

      let {
        uid,
        displayName,
        photoURL,
        email,
        emailVerified,
        isAnonymous,
        metadata,
        providerData = []
      } = user || {};

      displayName = defineInstance(displayName, registerData?.displayName);
      photoURL = defineInstance(photoURL, registerData?.photoURL);

      if ((isSignedOut || !metadata) && !Object.keys(registerData).length) {
        return yield put({type: 'updateState', payload: {isSignedOut: false}});
      }

      let {
        creationTime,
        lastSignInTime,
        providerId
      } = metadata;

      providerId = defineInstance(providerId, providerData[0]?.providerId);

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

      /**
       * @type {{docId, id, data: {roles}}}
       * @private
       */
      let _userExist = yield call(findUser, {
        uid,
        emailVerified,
        metadata: {...userProps.metadata}
      });

      if (_userExist?.docId) {
        const user = {..._userExist.data, id: _userExist.docId};

        // Update user.id
        if (!_userExist?.data?.id) {
          yield call(fbUpdate, {
            collection: 'users',
            docId: _userExist.docId,
            data: {...user}
          });
        }

        // Finish business user registration
        if (registerData.isBusinessUser) {
          yield put({
            type: 'businessModel/finishRegistration',
            payload: {user: _userExist}
          });
        }

        // Set user roles
        _userExist.data.roles = yield call(getUserRoles, {user: _userExist});

        // Define user abilities
        const ability = yield call(defineAbilityFor, {user, userId: _userExist?.docId});

        yield put({
          type: 'updateState',
          payload: {
            user,
            registerData: {},
            refreshSignIn: true,
            isSignedOut: false,
            ability
          }
        });

        yield call(handleUserSessionTimeout);

        history.push(`/admin/users/${_userExist?.docId}`);

      } else if (refreshSignIn) {

        // Create user
        _userExist = yield call(fbAdd, {collection: 'users', data: userProps});

        yield put({
          type: 'updateState',
          payload: {
            isSignedOut: false,
            refreshSignIn: false
          }
        });

        return yield put({
          type: 'signIn',
          payload: {user: _userExist.data}
        });

      } else {
        // TODO (teamco): Show error.
      }
    },

    * registerData({payload}, {call, put}) {
      if (!payload?.registerData) {
        // TODO (teamco): Show error.
        return false;
      }

      const {email, firstName, lastName, isBusinessUser} = payload.registerData;
      const photoURL = yield call(gravatarUrl, {email});
      const displayName = `${firstName} ${lastName}`;

      const userProps = {
        displayName,
        photoURL,
        isBusinessUser
      };

      yield put({type: 'updateState', payload: {registerData: {...userProps}}});
    },

    * signUp({payload}, {}) {
      if (!payload.user) {
        return false;
      }
    },

    * updateEmail({payload}, {call, put}) {
      if (!payload.user) {
        return false;
      }

      const _userExist = yield call(findUser, {
        uid: payload.user.uid,
        email: payload.email,
        metadata: {updatedAt: +(new Date)}
      });

      if (_userExist.docId) {
        // Update local user
        yield call(fbUpdate, {collection: 'users', docId: _userExist.docId, data: _userExist.data});
        // Update fb user
        yield call(updateFbUserEmail, {email: payload.email});

        yield put({
          type: 'updateState',
          payload: {
            user: _userExist.data,
            ability: yield call(defineAbilityFor, {user: _userExist.data})
          }
        });
      }
    },

    * defineAbilities({payload}, {call, put, select}) {
      const {user} = yield select(state => state.authModel);
      const ability = yield call(defineAbilityFor, {user, userId: user?.id});

      yield put({
        type: 'updateState',
        payload: {ability}
      });
    },

    * signOut({payload}, {call, put, select}) {
      const state = yield select(state => state.authModel);
      const {user} = payload;

      // Clear garbage.
      if (!user) {
        yield call(fbSignOut);

        return yield put({
          type: 'updateState',
          payload: {
            user: null,
            isSignedOut: false,
            ability: yield call(defineAbilityFor, {user: null})
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
        yield call(fbUpdate, {collection: 'users', docId: _userExist.docId, data: _userExist.data});

        if (state.user?.uid === user.uid) {
          yield put({
            type: 'updateState',
            payload: {
              user: null,
              isSignedOut: true,
              ability: yield call(defineAbilityFor, {user: null})
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
