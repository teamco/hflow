/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { isNew } from 'services/common.service';
import { detailsInfo } from 'services/cross.model.service';
import { fbAdd, fbFindById, fbUpdate, getRef } from 'services/firebase.service';
import {
  addSubscription,
  getAllSubscriptions,
  getSubscription,
  updateSubscription
} from 'services/subscriptions.service';
// import { getAllPreferences } from 'services/subscriptionsPrefs.service';
import { history } from 'umi';
import { COLORS } from 'utils/colors';
import { monitorHistory } from 'utils/history';
import i18n from 'utils/i18n';
import { errorSaveMsg } from 'utils/message';
import { setAs } from 'utils/object';
import { getFeatures } from '../services/subscriptionsPrefs.service';

const DEFAULT_STATE = {
  subscriptions: [],
  preferences: [],
  colorsToType: {
    basic: COLORS.tags.orange,
    standard: COLORS.tags.cyan,
    premium: COLORS.tags.green
  },
  businessUsers: {
    dims: { min: 1, max: 5 }
  },
  subscriptionPeriod: {
    daily: i18n.t('period:daily'),
    monthly: i18n.t('period:monthly'),
    yearly: i18n.t('period:yearly')
  },
  discountTypes: {
    percentage: '%',
    currency: i18n.t('currency')
  }
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'subscriptionModel',
  state: {
    ...DEFAULT_STATE
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      return monitorHistory({ history, dispatch }, 'subscriptionModel');
    },
    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },
  effects: {

    * query({ payload }, { put, call }) {
      const { data } = yield call(getAllSubscriptions);

      yield put({ type: 'subscriptionPrefs' });
      yield put({ type: 'updateState', payload: { subscriptions: data } });
    },

    * newSubscription({ payload }, { put }) {
      yield put({ type: 'cleanForm' });

      history.push(`/admin/subscriptions/new`);

      yield put({
        type: 'updateState',
        payload: {
          ...DEFAULT_STATE,
          ...{
            isEdit: false,
            touched: false
          }
        }
      });
    },

    * validateSubscription({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { subscriptionId } = payload;

      if (isNew(subscriptionId)) {
        // TODO (teamco): Do something.
      } else if (ability.can('read', 'subscriptions')) {

        const subscription = yield call(getSubscription, { id: subscriptionId });

        if (subscription.exists) {
          const selectedSubscription = { ...subscription.data(), ...{ id: subscription.id } };

          yield put({ type: 'updateState', payload: { selectedSubscription } });

          const _subscription = { ...selectedSubscription };
          const _preferences = {};

          _subscription.metadata = yield call(detailsInfo, { entity: _subscription, user });
          _subscription.preferences?.forEach(pref => {
            _preferences[pref] = true;
          });

          return yield put({
            type: 'toForm',
            payload: {
              model: 'subscriptionModel',
              form: {
                ..._subscription,
                preferences: { ..._preferences }
              }
            }
          });
        }

        yield put({ type: 'notFound', payload: { entity: 'Subscription', key: 'selectedSubscription' } });
      }
    },

    * editSubscription({ payload }, { put }) {
      const { params } = payload;
      const { subscription } = params;
      const { type } = params;

      yield put({ type: 'cleanForm', payload: { isEdit: !isNew(subscription) } });
      yield put({ type: 'subscriptionTypes' });
      yield put({ type: 'subscriptionPrefs', payload: { type } });
      yield put({ type: 'validateSubscription', payload: { subscriptionId: subscription } });
    },

    * subscriptionPrefs({payload}, { call, put }) {
      const {type = 'Business'} = payload || {};
      const { data = [] } = yield call(getFeatures, {type});
      yield put({ type: 'updateState', payload: { features: data } });
    },

    * subscriptionTypes(_, { call, put }) {
      const fbTypes = yield call(fbFindById, {
        collection: 'simpleEntities',
        doc: 'subscriptionTypes'
      });

      let subscriptionTypes = { tags: [] };

      if (fbTypes.exists) {
        subscriptionTypes = fbTypes.data();
      }

      yield put({
        type: 'updateState',
        payload: { subscriptionTypes: [...subscriptionTypes?.tags] }
      });
    },

    * prepareToSave({ payload, params }, { call, select, put }) {
      const { user, ability } = yield select(state => state.authModel);
      const { selectedSubscription, isEdit } = yield select(state => state.subscriptionModel);

      if (user && ability.can('update', 'subscriptions')) {

        const userRef = getRef({
          collection: 'users',
          doc: user.id
        });

        const metadata = {
          ...selectedSubscription?.metadata,
          updatedAt: +(new Date).toISOString(),
          updatedByRef: user.id
        };

        let data = {
          featuresByRef: setAs(payload.features, []),
          name: setAs(payload.title, ''),
          type: setAs(payload.type, ''),
          picUrl: setAs(payload.picUrl, ''),
          originalPrice: setAs(payload.price, ''),
          discountedPrice: setAs(payload.discount, ''),
          discountType: setAs(payload.discountType, ''),
          discountValue: setAs(payload.discount, ''),
          discountStartAt: setAs(payload.discountStartAt, +(new Date).toISOString()),
          discountDuration: setAs(payload.discountDuration, ''),
          duration: setAs(payload.duration, 3),
          effectiveDate: setAs(payload.effectiveDate,  +(new Date).toISOString()),
          expirationDate: setAs(payload.expirationDate,  +(new Date).toISOString()),
          numberOfUsers: setAs(payload.numberOfUsers, 1),
          currency: setAs(payload.currency, 'USA'),
          translateKeys: {
            title: setAs(payload.title, 'temp data'),
            description: setAs(payload.description, 'temp data'),
          }
        };



        // Not mandatory/defined fields preparation before saving.
        // data.tags = setAs(data.tags, []);
        data.featuresByRef = Object.keys(payload.features).filter(key => payload.features[key]);

        if (isEdit) {
          selectedSubscription && params.subscription === selectedSubscription.id ?
              yield call(updateSubscription, { id: selectedSubscription.id, data }) :
              errorSaveMsg(true, 'Subscription');

          yield put({ type: 'updateState', payload: { touched: false } });

        } else {

          data = {
            ...data,
            metadata: {
              ...metadata,
              createdAt: metadata.updatedAt,
              createdByRef: user.id
            }
          };

          const entity = yield call(addSubscription, { data });

          if (entity?.docId) {
            yield put({
              type: 'updateState',
              payload: {
                touched: false,
                isEdit: true
              }
            });

            history.push(`/admin/subscriptions/${entity.docId}`);
          }
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'selectedSubscription' } });
      }
    }
  },
  reducers: {}
});
