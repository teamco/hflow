/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { history } from '@umijs/max';

import { commonModel } from '@/models/common.model';
import {
  fbAdd,
  fbFindById,
  fbSignOut,
  fbUpdate,
  firebaseAppAuth
} from '@/services/firebase.service';
import {
  findUser,
  getUserProps,
  gravatarUrl,
  handleUserSessionTimeout,
  sendVerificationEmail,
  updateFbUserEmail
} from '@/services/user.service';
import {
  createServerProfile,
  getXHRToken
} from '@/services/authentication.service';

import { defineAbilityFor } from '@/utils/auth/ability';
import { monitorHistory } from '@/utils/history';
import { errorGetMsg } from '@/utils/message';

const MODEL_NAME = 'authModel';

/**
 * Refresh token (1min less than he will be expired).
 * @type {number}
 */
const DELTA_TOKEN_VALIDITY = 60 * 1000;

const DEFAULT_STATE = {
  user: null,
  fbUserValidated: false,
  serverUserId: null,
  isSignedOut: false,
  ability: null,
  location: {},
  token: {
    guest: null,
    access_token: null,
    refresh_token: null,
    expiredAt: null,
    credentials: {}
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
    userSignOut: {}
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, MODEL_NAME);

      return history.listen(data => {
        // In case of route replace
        const location = data.pathname ? { ...data } : { ...data.location };

        dispatch({ type: 'updateState', payload: { location } });
      });
    },

    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },

  effects: {

    * signIn({ payload }, { call, put, select }) {
      const { isSignedOut } = yield select(state => state[MODEL_NAME]);

      let { user = {}, _userExist } = payload || {};

      if (!user) return false;

      if (isSignedOut) {
        yield put({ type: 'updateState', payload: { isSignedOut: false } });
      }

      // // Update user props with register data.
      // if (registerData.isBusinessUser) {
      //   displayName = registerData?.displayName;
      //   photoURL = registerData?.photoURL;
      // }

      const userProps = yield call(getUserProps, { user });

      if (!_userExist?.docId) {

        /**
         * @type {{docId, id, data: {roles}}}
         * @private
         */
        _userExist = yield call(findUser, {
          uid: userProps.uid,
          emailVerified: userProps.emailVerified,
          metadata: { ...userProps.metadata }
        });
      }

      if (_userExist?.docId) {
        yield put({ type: 'updateUserProfile', payload: { _userExist } });

      } else {
        // TODO (teamco): Show error.
      }
    },

    * handleUserProfile({ payload }, { call, put }) {
      const { userProps, isOnRegisterWithPassword = false } = payload;

      /**
       * @type {{docId, id, data: {roles}}}
       * @private
       */
      let _userExist = yield call(findUser, { uid: userProps.uid });

      if (_userExist?.docId) {

        yield put({ type: 'updateUserProfile', payload: { _userExist } });

      } else {

        // Create user
        _userExist = yield call(fbAdd, {
          collectionPath: 'users',
          data: userProps
        });
      }

      if (_userExist.docId) {
        // TODO (teamco): Do something.
      }

      isOnRegisterWithPassword && (yield put({ type: 'signOut' }));
    },

    * handleServerProfile({ payload }, { call, put, select }) {
      const { token } = yield select(state => state[MODEL_NAME]);
      const { _userExist, state } = payload;
      const { serverUserId, emailVerified } = _userExist.data;

      if (serverUserId) {

        yield put({
          type: 'updateToken',
          payload: { user: _userExist.data, state }
        });

        yield put({ type: 'updateState', payload: { serverUserId } });
        yield put({
          type: 'firebaseModel/updateState',
          payload: { error: null }
        });

      } else {

        const guestToken = yield call(getXHRToken);

        const guest = { ...token, guest: guestToken?.data?.access_token };

        yield put({ type: 'updateState', payload: { token: guest } });

        if (emailVerified) {
          const { data } = yield call(createServerProfile, {
            uid: _userExist.docId,
            token: guest
          });

          yield put({
            type: 'updateState',
            payload: { serverUserId: data?.serverUserId }
          });

          // Update user
          yield call(fbUpdate, {
            caller: 'handleServerProfile',
            collectionPath: 'users',
            docName: _userExist.docId,
            data: { serverUserId: data?.serverUserId }
          });

          yield put({
            type: 'updateToken',
            payload: { user: _userExist.data, state }
          });

        } else {

          console.warn('Email not verified');

          yield put({
            type: 'firebaseModel/updateState',
            payload: {
              error: {
                code: 'SMTP',
                message: 'Email must verified'
              }
            }
          });

          yield put({
            type: `userModel/sendVerification`,
            payload: { user: _userExist.data }
          });

        }
      }
    },

    * updateToken({ payload }, { call, put, select }) {
      const { token } = yield select(state => state[MODEL_NAME]);

      const { user, state } = payload;

      const {
        data: {
          access_token,
          refresh_token,
          token_validity,
          error
        }
      } = yield call(getXHRToken, {
        token: {
          ...token,
          credentials: {
            username: user.id,
            password: user.email
          }
        }
      });

      if (error) {
        return yield put({ type: 'signOut' });
      }

      yield put({
        type: 'updateState',
        payload: {
          ...state,
          token: {
            ...token,
            access_token,
            refresh_token,
            expiredAt: +(new Date) + parseInt(token_validity, 10) -
                DELTA_TOKEN_VALIDITY,
            credentials: {
              username: user.id,
              password: user.email
            }
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
    * updateUserProfile({ payload }, { call, put }) {
      const { _userExist } = payload;
      const _user = { ..._userExist.data, id: _userExist.docId };

      const data = { ..._user, roles: [...(_user?.roles || [])] };

      // Update user
      yield call(fbUpdate, {
        caller: 'updateUserProfile',
        collectionPath: 'users',
        docName: _user.id,
        data
      });

      // // Finish business user registration
      // if (registerData.isBusinessUser) {
      //   yield put({
      //     type: 'businessModel/finishRegistration',
      //     payload: { _userExist }
      //   });
      // }

      // Define user abilities
      yield put({
        type: 'defineAbilities',
        payload: { user: _user, userId: _user.id }
      });

      yield put({
        type: 'handleServerProfile',
        payload: {
          _userExist,
          state: {
            user: { ..._user },
            isSignedOut: false
          }
        }
      });

      yield put({ type: 'appModel/notification' });

      yield call(handleUserSessionTimeout);
    },

    * registerData({ payload = {} }, { call, put }) {
      const { registerData, user } = payload;

      if (!user || !registerData) {
        // TODO (teamco): Show error.
        throw new Error('Registration data cannot be empty');
      }

      const {
        email,
        firstName,
        lastName
      } = registerData;

      const photoURL = yield call(gravatarUrl, { email });
      const displayName = `${firstName} ${lastName}`;

      yield call(sendVerificationEmail, {
        user: {
          uid: user.uid,
          metadata: { providerId: user.providerId }
        }
      });

      yield put({
        type: 'firebaseModel/updateAccountOnSignUpWithPassword',
        payload: { displayName, photoURL }
      });

      const _userProps = yield call(getUserProps, { user });
      const userProps = {
        ..._userProps,
        displayName,
        roles: ['Consumer'],
        metadata: {
          ..._userProps.metadata,
          photoURL
        }
      };

      // Create profile only when it will be accessible (not offline)
      yield put({
        type: 'handleUserProfile',
        payload: {
          userProps,
          isOnRegisterWithPassword: true
        }
      });
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
        const user = _userExist.data;

        // Update local user
        yield call(fbUpdate, {
          notice: true,
          caller: 'updateEmail',
          collectionPath: 'users',
          docName: _userExist.docId,
          data: user
        });

        // Update fb user
        yield call(updateFbUserEmail, { email: payload.email });

        yield put({ type: 'updateState', payload: { user } });
        yield put({ type: 'defineAbilities', payload: { user } });
      }
    },

    * defineAbilities({ payload = {} }, { call, put, select }) {
      const state = yield select(state => state[MODEL_NAME]);
      const { user = state?.user, userId = user?.id } = payload;

      const ability = yield call(defineAbilityFor, { user, userId });
      yield put({ type: 'updateState', payload: { ability } });

      yield put({ type: 'defineRoles', payload: { user, userId } });
    },

    * defineRoles({ payload = {} }, { call, put, select }) {
      const { user, userId } = payload;
      let roles = {};

      if (user?.roles) {
        const fbRoles = yield call(fbFindById, {
          collectionPath: 'roles',
          docName: 'rolesManager'
        });

        if (fbRoles.exists()) {
          const data = fbRoles.data();

          for (let role of user.roles) {
            roles[role] = [...(data[role] || [])];
          }
        }
      }

      const ability = yield call(defineAbilityFor, {
        user,
        userId,
        rolesFor: roles
      });

      yield put({ type: 'updateState', payload: { ability } });
    },

    * signOut({ payload = {} }, { call, put, select }) {
      const state = yield select(state => state[MODEL_NAME]);
      const { user = firebaseAppAuth?.currentUser } = payload;

      if (state.ability.can('logout', 'landing.logout')) {
        if (user?.uid) {

          const _userExist = yield call(findUser, {
            uid: user?.uid,
            metadata: {
              forceSignOut: false,
              signedIn: false,
              updatedAt: +(new Date)
            }
          });

          if (_userExist.docId) {
            yield call(fbUpdate, {
              caller: 'signOut',
              collectionPath: 'users',
              docName: _userExist.docId,
              data: _userExist.data
            });

            if (state?.user?.uid === user?.uid || !state?.user) {

              // Handle force logout of the current user
              if (yield call(fbSignOut)) {
                yield put({ type: 'resetAuthState' });

                history.push('/login');

              } else {

                // TODO (teamco): Do something.
                yield put({
                  type: 'signOutLog',
                  payload: {
                    fbSignOut: false,
                    error: 'Error during <SignOut>'
                  }
                });
              }

            } else {

              // TODO (andrew.palkin): Handle force signed-out users.
              yield put({
                type: 'signOutLog',
                payload: {
                  fbSignOut: false,
                  error: 'TODO: Handle force signed-out users'
                }
              });
            }

          } else {

            yield put({
              type: 'signOutLog',
              payload: { fbSignOut: false, error: `<User> does not Exist` }
            });

            errorGetMsg(true, '<User>').then();
          }

        } else {

          yield put({
            type: 'notFound',
            payload: { entity: 'user', key: 'signOut' }
          });
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'signOut' } });
      }
    },

    * signOutLog({ payload }, { put }) {
      const { fbSignOut, error } = payload;

      yield put({
        type: 'updateState',
        payload: { userSignOut: { fbSignOut, error } }
      });
    },

    * resetAuthState(_, { put }) {
      yield put({ type: 'defineAbilities', payload: { user: null } });

      yield put({
        type: 'updateState',
        payload: {
          ...DEFAULT_STATE,
          isSignedOut: true
        }
      });

      yield put({
        type: 'firebaseModel/updateState',
        payload: { error: null, result: null, credential: null }
      });
    }
  },

  reducers: {}
});
