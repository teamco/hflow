/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { isNew } from 'services/common.service';
import { detailsInfo } from 'services/cross.model.service';
import { fbAdd, fbFindById, fbUpdate, getRef } from 'services/firebase.service';
import { getAllSubscriptions } from 'services/subscriptions.service';
import { history } from 'umi';
import { COLORS } from 'utils/colors';
import { monitorHistory } from 'utils/history';
import i18n from 'utils/i18n';
import { errorSaveMsg } from 'utils/message';
import { setAs } from 'utils/object';

const DEFAULT_STATE = {
  subscriptions: [],
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
      monitorHistory({ history, dispatch }, 'subscriptionModel');
    },
    setup({ dispatch }) {
    }
  },
  effects: {

    * query({ payload }, { put, call, select }) {
      const subscriptions = yield call(getAllSubscriptions);

      yield put({
        type: 'updateState',
        payload: { subscriptions }
      });
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

        const subscription = yield call(fbFindById, {
          collection: 'subscriptions',
          doc: subscriptionId
        });

        if (subscription.exists) {
          const selectedSubscription = { ...subscription.data(), ...{ id: subscription.id } };

          yield put({ type: 'updateState', payload: { selectedSubscription } });

          const _subscription = { ...selectedSubscription };
          _subscription.metadata = yield call(detailsInfo, { entity: _subscription, user });

          return yield put({
            type: 'toForm',
            payload: {
              model: 'subscriptionModel',
              form: { ..._subscription }
            }
          });
        }

        yield put({ type: 'notFound', payload: { entity: 'Subscription', key: 'selectedSubscription' } });
      }
    },

    * editSubscription({ payload }, { put }) {
      const { params } = payload;
      const { subscription } = params;

      yield put({ type: 'cleanForm', payload: { isEdit: !isNew(subscription) } });
      yield put({ type: 'subscriptionTypes' });
      yield put({ type: 'validateSubscription', payload: { subscriptionId: subscription } });
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
          updatedAt: +(new Date),
          updatedByRef: userRef
        };

        let data = { ...payload, metadata };

        // Not mandatory/defined fields preparation before saving.
        data.analytics = setAs(data.analytics, false);
        data.logoOnPartnersPage = setAs(data.logoOnPartnersPage, false);
        data.profile = setAs(data.profile, false);
        data.requestList = setAs(data.requestList, false);
        data.tags = setAs(data.tags, []);

        if (isEdit) {
          selectedSubscription && params.subscription === selectedSubscription.id ?
              yield call(fbUpdate, { collection: 'subscriptions', doc: selectedSubscription.id, data }) :
              errorSaveMsg(true, 'Subscription');

          yield put({ type: 'updateState', payload: { touched: false } });

        } else {

          data = {
            ...data,
            metadata: {
              ...metadata,
              createdAt: metadata.updatedAt,
              createdByRef: userRef
            }
          };

          const entity = yield call(fbAdd, { collection: 'subscriptions', data });

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
