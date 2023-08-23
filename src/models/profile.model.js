/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

import { monitorHistory } from '@/utils/history';
import { setAs } from '@/utils/object';
import { dateTimeFormat } from '@/utils/timestamp';

import {
  getServerProfile,
  getServerUser,
  saveProfile,
  updateUserSubscription,
  updateProfile,
  getProfileConnections,
  getOpenProfile,
  getProfileEmails
} from '@/services/profile.service';

import {
  getUserApartmentLikes,
  getUserApartmentViews
} from '@/services/apartment.service';

import {
  getAllSubscriptions,
  getSubscription
} from '@/services/subscriptions.service';

const MODEL_NAME = 'profileModel';
const COMPONENT_NAME = 'profile';

const DEFAULT_STATE = {
  liked: {},
  viewed: {},
  label: null,
  subscriptions: [],
  assignedSubscriptions: [],
  assignedFeatures: [],
  trialedFeatures: [],
  multiplePrimaryEmails: false,
  collapsibleMenu: true,
  collapsedMenu: true,
  actionBtns: {},
  sUser: null,
  sProfile: null,
  profiles: [],
  sLinks: [],
  sEmails: []
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: { ...DEFAULT_STATE },

  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, MODEL_NAME);
    },

    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },

  effects: {

    * getProfileData({ payload = {} }, { call, put, select }) {
      const { ability, user, token } = yield select(state => state.authModel);

      // TODO (teamco): Handle cache
      const { sUser, sProfile } = yield select(state => state[MODEL_NAME]);

      const { isEdit = true } = payload;

      if (ability.can('manage', COMPONENT_NAME)) {

        let serverUser,
            serverProfile;

        if (sUser) {

          serverUser = sUser;

        } else {

          const { data } = yield call(getServerUser, {
            userKey: user.id,
            token
          });

          if (data?.error) return false;

          yield put({ type: 'updateState', payload: { sUser: data } });
          serverUser = data;
        }

        if (sProfile) {

          serverProfile = sProfile;

        } else {

          const { profileByRef } = serverUser;

          if (profileByRef) {

            const profile = yield call(getServerProfile, {
              userKey: user.id,
              profileKey: profileByRef,
              token
            });

            if (profile?.data?.error) return false;

            yield put({
              type: 'updateState',
              payload: { sProfile: profile?.data, isEdit }
            });

            serverProfile = profile?.data;
          }
        }

        isEdit && (
            yield put({
              type: 'toForm',
              payload: {
                model: MODEL_NAME,
                form: { ...serverProfile },
                dateFields: ['birthdate']
              }
            })
        );

        yield put({
          type: 'updateTags',
          payload: { tags: serverProfile?.tags, touched: false }
        });
      }
    },

    * getPublicLinks({ payload = {} }, { call, put, select }) {
      const { ability, user, token } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state[MODEL_NAME]);

      if (ability.can('read', COMPONENT_NAME)) {

        sUser?.profileByRef && (
            yield put({
              type: 'profileLinkModel/getLinks',
              payload: { model: MODEL_NAME }
            })
        );
      }
    },

    * getSubscriptions({ payload }, { put, call, select }) {
      const { ability, token } = yield select(state => state.authModel);

      if (ability.can('subscriptions.list', COMPONENT_NAME)) {

        const { data } = yield call(getAllSubscriptions, { token });

        if (data?.error) return false;

        yield put({ type: 'updateState', payload: { subscriptions: data } });

      } else {

        yield put({
          type: 'noPermissions',
          payload: { key: `getSubscriptions` }
        });
      }
    },

    * getProfileSubscriptions({ payload }, { call, put, select }) {
      const { ability, token } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state[MODEL_NAME]);

      if (ability.can('subscriptions.read', COMPONENT_NAME)) {
        const { subscriptionsByRef = [] } = sUser;
        const assignedSubscriptions = [];

        for (let subscriptionByRef of subscriptionsByRef) {
          const { data } = yield call(getSubscription,
              { id: subscriptionsByRef, token });

          if (data?.error) {
            // TODO (teamco): Show error.
          } else {
            assignedSubscriptions.push(data);
          }
        }

        yield put({ type: 'updateState', payload: { assignedSubscriptions } });

      } else {

        yield put({
          type: 'noPermissions',
          payload: { key: `getProfileSubscriptions` }
        });
      }
    },

    * assignSubscription({ payload }, { call, put, select }) {
      const { user, ability, token } = yield select(state => state.authModel);
      const { subscription } = payload;

      if (ability.can('subscription.assign', COMPONENT_NAME)) {

        const { data } = yield call(updateUserSubscription, {
          userKey: user.id,
          subscriptionKey: subscription.id,
          token
        });

        if (data?.error) return false;

      } else {

        yield put({
          type: 'noPermissions',
          payload: { key: `assignSubscription` }
        });
      }
    },

    * handleProfile({ payload }, { put }) {
      yield put({ type: 'getProfileData', payload });
    },

    * updateMenu({ payload }, { put, select }) {
      yield put({ type: 'assignedFeatures' });
      yield put({ type: 'trialedFeatures' });
    },

    * assignedFeatures({ payload }, { put, select }) {
      const { features = [], selectedSubscription } = yield select(
          state => state.subscriptionModel);

      const assignedFeatures = features?.
          filter(d => selectedSubscription?.featuresByRef?.includes(d?.id)).
          map(feature => {

            return {
              disabled: false,
              key: feature?.translateKeys?.title,
              url: `/profile/features/${feature?.id}`,
              component: 'profile',
              feature
            };

          });

      yield put({ type: 'updateState', payload: { assignedFeatures } });
    },

    * trialedFeatures({ payload }, { put, select }) {
      const { features = [], selectedSubscription } = yield select(
          state => state.subscriptionModel);

      const trialedFeatures = features?.
          filter(d => d.trialed &&
              !selectedSubscription?.featuresByRef?.includes(d?.id)).
          map(feature => {

            return {
              disabled: false,
              key: feature?.translateKeys?.title,
              url: `/profile/features/${feature?.id}`,
              component: 'profileTrialFeatures',
              feature
            };

          });

      yield put({ type: 'updateState', payload: { trialedFeatures } });
    },

    * liked({ payload = {} }, { put, call, select }) {
      const { token, user, ability } = yield select(state => state.authModel);
      const { liked } = yield select(state => state[MODEL_NAME]);

      const { force = false } = payload;

      if (ability.can('manage', `${COMPONENT_NAME}.history.liked`)) {

        if (liked?.content && !force) {
          // TODO (teamco): Do something.
        } else {

          const { data } = yield call(getUserApartmentLikes, {
            token,
            userByRef: user?.id,
            size: 10
          });

          if (data?.error) return false;

          yield put({
            type: 'updateState',
            payload: {
              liked: data,
              isEdit: false
            }
          });
        }

      } else {

        yield put({
          type: 'noPermissions',
          payload: { key: `${COMPONENT_NAME}.history.liked` }
        });
      }
    },

    * viewed({ payload = {} }, { call, put, select }) {
      const { token, user, ability } = yield select(state => state.authModel);
      const { viewed } = yield select(state => state[MODEL_NAME]);

      const { force = false } = payload;

      if (ability.can('manage', `${COMPONENT_NAME}.history.viewed`)) {

        if (viewed?.content && !force) {
          // TODO (teamco): Do something.
        } else {

          const { data } = yield call(getUserApartmentViews, {
            token,
            userByRef: user?.id,
            size: 10
          });

          if (data?.error) return false;

          yield put({
            type: 'updateState',
            payload: {
              viewed: data,
              isEdit: false
            }
          });
        }

      } else {

        yield put({
          type: 'noPermissions',
          payload: { key: `${COMPONENT_NAME}.history.viewed` }
        });
      }
    },

    * prepareToSave({ payload }, { call, put, select }) {
      const { sUser } = yield select(state => state[MODEL_NAME]);

      const {
        name: {
          first,
          second,
          middle,
          honorific
        },
        genderIdentity,
        birthdate,
        description,
        tags = setAs(tags, [])
      } = payload;

      const { profileByRef } = sUser;

      const data = {
        name: {
          first,
          second,
          middle,
          honorific
        },
        description: setAs(description, null),
        genderIdentity: setAs(genderIdentity, null),
        birthdate: dateTimeFormat(birthdate),
        // primaryEmailByRef: setAs(primaryEmailByRef, null),
        // logosByRef: null,
        // linksByRef: null,
        // addressesByRef: null,
        tags
      };

      yield put({ type: 'handleUpdate', payload: { data, profileByRef } });
      yield put({ type: 'handleSave', payload: { data } });
    },

    * handleUpdate({ payload }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { isEdit, sProfile } = yield select(state => state[MODEL_NAME]);
      const { data, profileByRef } = payload;

      if (ability.can('update', COMPONENT_NAME)) {
        if (profileByRef && isEdit) {
          const _data = { ...data, id: sProfile.id, version: sProfile.version };

          const entity = yield call(updateProfile, {
            userKey: user.id,
            profileKey: profileByRef,
            data: _data,
            token
          });

          if (entity?.data?.error) return false;

        } else {
          // TODO (teamco): Going to save.
        }
      } else {
        yield put({ type: 'noPermissions', payload: { key: 'handleUpdate' } });
      }
    },

    * handleSave({ payload }, { put, call, select }) {
      const { user, ability, token } = yield select(state => state.authModel);
      const { isEdit } = yield select(state => state[MODEL_NAME]);
      let { data } = payload;

      if (ability.can('create', COMPONENT_NAME)) {
        if (isEdit) {
          // TODO (teamco): Going to update.
        } else {

          const profile = yield call(saveProfile,
              { userKey: user.id, data, token });

          if (profile?.data?.error) return false;

          yield put({
            type: 'updateState',
            payload: { sProfile: profile?.data, isEdit: true }
          });
          yield put({
            type: 'toForm',
            payload: {
              model: MODEL_NAME,
              form: { ...profile?.data },
              dateFields: ['birthdate']
            }
          });
        }

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'handleSave' } });
      }
    },

    * loadOpenProfile({ payload }, { put }) {
      yield put({ type: 'updateState', payload: { label: payload.label } });
      yield put({ type: 'getOpenProfile', payload });
    },

    * getAllConnections({ payload }, { put, call, select }) {
      const { token } = yield select(state => state.authModel);
      const { data } = yield call(getProfileConnections, { token });

      if (data) {
        yield put({ type: 'updateState', payload: { profiles: data } });
      }
    },

    * getOpenProfile({ payload }, { put, call, select }) {
      const { token } = yield select(state => state.authModel);
      const { profileId } = payload;

      if (profileId) {
        const { data } = yield call(getOpenProfile,
            { token, profileKey: profileId });

        if (data?.error) return false;

        yield put({ type: 'updateState', payload: { profiles: data } });
      }
    },

    * updatePrimaryEmail({ payload }, { put, select }) {
      const { data } = payload;

      const primaryEmails = data?.filter((mail => mail.primary));

      yield put({
        type: 'updateState',
        payload: {
          sEmails: [
            ...primaryEmails
          ]
        }
      });
    },

    * getPublicEmail({ payload = {} }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sProfile } = yield select(state => state.profileModel);

      if (ability.can('read', COMPONENT_NAME)) {

        const { data } = yield call(getProfileEmails, {
          token,
          userKey: user.id,
          profileKey: sProfile.id
        });

        if (data?.error) return false;

        yield put({ type: 'updatePrimaryEmail', payload: { data: data } });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'getEmails' } });
      }
    }

  },

  reducers: {
    updateActionBtns(state, { payload }) {
      return {
        ...state,
        actionBtns: {
          ...payload.actionBtns
        }
      };
    }
  }
});
