/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { isNew } from 'services/common.service';
import { detailsInfo } from 'services/cross.model.service';
import { fbAdd, fbFindById, fbUpdate, getRef } from 'services/firebase.service';
import { history } from 'umi';
import { monitorHistory } from 'utils/history';
import i18n from 'utils/i18n';
import { getNotifications } from '../services/notification.service';
import { getAllSubscriptions, getAllSubscriptionsByType } from '../services/subscriptions.service';
import { isAdmin } from '../services/userRoles.service';
import { toFile } from '../utils/file';
import { setAs } from '../utils/object';
import { errorSaveMsg } from '../utils/message';

const DEFAULT_STATE = {
  subscriptions: [],
  businessUsers: {
    dims: { min: 1, max: 5 }
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

    * query({ payload }, {call,  put, select }) {
      const {data = []} = yield call(getAllSubscriptions);

      yield put({
        type: 'updateState',
        payload: { subscriptions: data }
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

    * prepareToSave({ payload, params }, { call, select, put }) {
      const { user, ability } = yield select(state => state.authModel);
      const { selectedSubscription, isEdit } = yield select(state => state.subscriptionModel);

      let entity;
      const manageByAdmin = isAdmin(user.roles);

      if (user && ability.can('update', 'businesses')) {

        const userRef = getRef({
          collection: 'users',
          doc:  user.id
        });

        let data = {};

        data.description = setAs(payload.description);
        data.displayName = setAs(payload.title, false);
        data.price = setAs(payload.price, false);
        data.type = setAs(payload.subscriptionType, false);

        if (isEdit) {
          const metadata = {
            ...selectedSubscription.metadata,
            updatedAt: +(new Date),
            updatedByRef: userRef
          };

          data = { ...payload, metadata };

          // Not mandatory fields preparation before saving.

          selectedSubscription && params.subscription === selectedSubscription.id ?
              yield call(fbUpdate, { collection: 'subscriptions', doc: selectedSubscription.id, data }) :
              errorSaveMsg(true, 'Business');
          yield put({ type: 'updateState', payload: { touched: false } });

        } else {

          data = {
            ...data,
            metadata: {
              createdAt: +(new Date),
              createdByRef: userRef,
              belongsToRef: userRef
            }
          };

          entity = yield call(fbAdd, { collection: 'subscriptions', data });

          if (entity?.docId) {

            yield put({
              type: 'updateState',
              payload: {
                touched: false,
                isEdit: true
              }
            });

            history.push(`/admin/users/${user.id}/subscriptions/${entity.docId}`);

          } else {
            errorSaveMsg(false, 'Business');
          }
        }
      }
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

        yield put({
          type: 'raiseCondition',
          payload: {
            message: i18n.t('error:notFound', { entity: 'Subscription' }),
            key: 'selectedSubscription'
          }
        });
      }
    },

    * editSubscription({ payload }, { put }) {
      const { params } = payload;
      const { subscription } = params;

      yield put({ type: 'cleanForm' });
      yield put({ type: 'subscriptionTypes' });
      yield put({ type: 'validateSubscription', payload: { subscriptionId: subscription } });
      yield put({ type: 'updateState', payload: { isEdit: !isNew(subscription) } });
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
    }
  },
  reducers: {}
});
