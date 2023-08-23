/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import dayjs from 'dayjs';
import { history } from '@umijs/max';

import { commonModel } from '@/models/common.model';
import { custDiscountType, isNew } from '@/services/common.service';
import { detailsInfo } from '@/services/cross.model.service';

import {
  addSubscription,
  getAllSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription
} from '@/services/subscriptions.service';
import { getFeatures } from '@/services/features.service';

import { COLORS } from '@/utils/colors';
import { monitorHistory } from '@/utils/history';
import { errorSaveMsg } from '@/utils/message';
import { setAs } from '@/utils/object';
import { mapSchedulerByRefs } from '@/services/schedulers.service';

const { API } = require('@/services/config/api.config');

const DEFAULT_STATE = {
  subscriptions: [],
  schedulers: {},
  features: [],
  durationTypes: [],
  currencies: [],
  selectedSubscription: null,
  colorsToType: {
    basic: COLORS.tags.orange,
    standard: COLORS.tags.cyan,
    premium: COLORS.tags.green
  },
  businessUsers: {
    dims: { min: 0, max: 5 }
  },
  schedulerTypes: {
    sale: 'saleScheduler',
    discount: 'discountScheduler'
  }
};

const MODEL_NAME = 'subscriptionModel';
const BASE_URL = '/admin/subscriptions';
const COMPONENT_NAME = 'subscriptions';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,

  state: {
    ...DEFAULT_STATE
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

    * query({ payload }, { put, call, select }) {
      const { token } = yield select(state => state.authModel);
      const { data } = yield call(getAllSubscriptions, { token });

      if (data?.error) return false;

      yield put({ type: 'features' });
      yield put({ type: 'updateState', payload: { subscriptions: data } });
    },

    * newSubscription({ payload }, { put }) {
      yield put({ type: 'schedulerModel/updateState', payload: { assignedSchedulers: [] } });
      yield put({ type: 'updateState', payload: { schedulers: {} } });

      yield put({
        type: 'handleNew',
        payload: {
          BASE_URL,
          component: COMPONENT_NAME,
          state: DEFAULT_STATE,
          selected: 'selectedSubscription'
        }
      });
    },

    * validateSubscription({ payload }, { call, put, select }) {
      const { user, ability, token } = yield select(state => state.authModel);
      const { subscriptionId, redirect = true } = payload;

      if (isNew(subscriptionId)) {
        yield put({ type: 'newSubscription' });
        // TODO (teamco): Do something.

      } else if (ability.can('read', COMPONENT_NAME)) {

        const subscription = yield call(getSubscription, { id: subscriptionId, token });

        if (subscription?.data?.error) return false;

        if (subscription.exists) {
          const { price: { discount } } = subscription.data;

          redirect && history.push(`${BASE_URL}/${subscriptionId}`);

          const selectedSubscription = {
            ...subscription.data,
            price: {
              ...subscription.data.price,
              discount: {
                ...discount,
                startedAt: dayjs(discount?.startedAt),
                duration: { ...discount?.duration }
              }
            }
          };

          yield put({ type: 'subscriptionSchedulers', payload: { subscription } });

          yield put({ type: 'updateState', payload: { selectedSubscription } });
          yield put({ type: 'updateTags', payload: { tags: selectedSubscription.tags, touched: false } });

          const _subscription = { ...selectedSubscription };
          const _features = {};

          _subscription.metadata = yield call(detailsInfo, { entity: _subscription, user });
          _subscription.features?.forEach(pref => {
            _features[pref] = true;
          });

          yield put({ type: 'features', payload: { type: _subscription.featureType } });

          return yield put({
            type: 'toForm',
            payload: {
              model: MODEL_NAME,
              form: {
                ..._subscription,
                features: { ..._features }
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

      yield put({ type: 'cleanForm', payload: { isEdit: !isNew(subscription) } });
      yield put({ type: 'getSimpleEntity', payload: { docName: 'currencies' } });
      yield put({ type: 'getSimpleEntity', payload: { docName: 'durationTypes' } });
      yield put({ type: 'getSimpleEntity', payload: { docName: 'featureTypes' } });
      yield put({ type: 'getSimpleEntity', payload: { docName: 'subscriptionTypes' } });
      yield put({ type: 'validateSubscription', payload: { subscriptionId: subscription } });
      yield put({ type: 'updateLocales', payload: { MODEL_NAME } });
    },

    * subscriptionSchedulers({ payload }, { put, select, take }) {
      const { subscription: { data } } = payload;

      yield put({
        type: 'schedulerModel/getSchedulersOf',
        payload: {
          apiOf: API.subscriptions.get,
          keyOf: 'subscriptionKey',
          id: data?.id
        }
      });

      yield take('schedulerModel/getSchedulersOf/@@end');

      const { schedulerTypes } = yield select(state => state[MODEL_NAME]);

      yield put({
        type: 'schedulerModel/distributeSchedulers',
        payload: {
          schedulers: data?.schedulersByRef,
          schedulerType: schedulerTypes.sale,
          model: MODEL_NAME
        }
      });

      if (data?.price?.discounted) {

        yield put({
          type: 'schedulerModel/distributeSchedulers',
          payload: {
            schedulers: data?.price?.schedulersByRef,
            schedulerType: schedulerTypes.discount,
            model: MODEL_NAME
          }
        });
      }
    },

    * assignAllFeatures({ payload = {} }, { put, select }) {
      const {
        selectedSubscription = { featuresByRef: [] },
        features = []
      } = yield select(state => state[MODEL_NAME]);

      const { isAssigned } = payload;

      let featuresByRef = [];

      if (isAssigned) {
        // TODO (teamco): Do something.
      } else if (features.error) {
        // TODO (teamco): Do something.
      } else {
        featuresByRef = features?.map((item) => item.id);
      }

      yield put({
        type: 'updateState',
        payload: {
          touched: true,
          selectedSubscription: {
            ...selectedSubscription,
            featuresByRef
          }
        }
      });
    },

    * assignFeature({ payload = {} }, { put, select }) {
      const { selectedSubscription } = yield select(state => state[MODEL_NAME]);
      const { feature, isAssigned = false } = payload;

      let featuresByRef = [...(selectedSubscription?.featuresByRef || [])];

      if (isAssigned) {
        featuresByRef = featuresByRef.filter(ref => ref !== feature.id);
      } else {
        featuresByRef.push(feature.id);
      }

      yield put({
        type: 'updateState',
        payload: {
          touched: true,
          selectedSubscription: {
            ...selectedSubscription,
            featuresByRef
          }
        }
      });
    },

    * changeFeatureType({ payload = {} }, { put }) {
      const { type = 'Business' } = payload;
      yield put({ type: 'features', payload: { type } });
    },

    * features({ payload = {} }, { call, put, select }) {
      const { token } = yield select(state => state.authModel);
      const { data = [], error } = yield call(getFeatures, { token, type: payload?.type });

      if (data?.error) return false;

      yield put({ type: 'updateState', payload: { features: error ? [] : data } });
    },

    * prepareToSave({ payload, params }, { select, call, put, take }) {
      const { user } = yield select(state => state.authModel);
      const { selectedSubscription, schedulers, schedulerTypes, isEdit } = yield select(state => state[MODEL_NAME]);
      const {
        price,
        type,
        featureType,
        paymentDuration,
        numberOfUsers,
        translateKeys: {
          title,
          description = setAs(description, null)
        },
        tags = setAs(tags, [])
      } = payload;

      const metadata = {
        ...selectedSubscription?.metadata,
        updatedAt: (new Date).toISOString(),
        updatedByRef: user.id
      };

      yield put({
        type: 'schedulerModel/saveScheduler',
        payload: {
          assignedSchedulers: [...(schedulers[schedulerTypes.sale] || [])],
          schedulerType: schedulerTypes.sale,
          model: MODEL_NAME,
          COMPONENT_NAME
        }
      });

      let _discount = null;

      if (price.discounted) {

        yield put({
          type: 'schedulerModel/saveScheduler',
          payload: {
            assignedSchedulers: [...(schedulers[schedulerTypes.discount] || [])],
            schedulerType: schedulerTypes.discount,
            model: MODEL_NAME,
            COMPONENT_NAME
          }
        });

        _discount = {
          ...price.discount,
          type: custDiscountType(price.discount.type)
        };
      }

      yield take('schedulerModel/saveScheduler/@@end');

      const modelState = yield select(state => state[MODEL_NAME]);

      let data = {
        id: selectedSubscription?.id,
        name: title,
        price: {
          ...price,
          discount: price.discounted ? {
            ..._discount,
            schedulersByRef: yield call(mapSchedulerByRefs, {
              schedulers: modelState.schedulers[schedulerTypes.discount]
            })
          } : null
        },
        translateKeys: { title, description },
        featuresByRef: selectedSubscription?.featuresByRef,
        type, featureType, tags, paymentDuration,
        numberOfUsers, metadata,
        schedulersByRef: yield call(mapSchedulerByRefs, {
          schedulers: modelState.schedulers[schedulerTypes.sale]
        })
      };

      yield put({ type: 'handleUpdate', payload: { data, isEdit, selectedSubscription, id: params.subscription } });
      yield put({ type: 'handleSave', payload: { data, isEdit, metadata } });
    },

    * handleUpdate({ payload }, { put, call, select }) {
      const { user, ability, token } = yield select(state => state.authModel);
      const { isEdit, selectedSubscription, id, data } = payload;

      if (user && ability.can('update', COMPONENT_NAME)) {
        if (isEdit) {
          if (selectedSubscription && id === selectedSubscription.id) {
            const _data = { ...data, version: selectedSubscription.version };
            const entity = yield call(updateSubscription, { id: selectedSubscription.id, data: _data, token });

            if (entity?.data?.error) return false;

            yield put({
              type: 'updateVersion',
              payload: {
                entity,
                selectedEntity: selectedSubscription,
                entityName: 'selectedSubscription'
              }
            });

          } else {
            errorSaveMsg(true, 'selectedSubscription').then();
          }
        } else {
          // TODO (teamco): Going to save.
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'handleUpdate' } });
      }
    },

    * handleSave({ payload }, { put, call, select }) {
      const { user, ability, token } = yield select(state => state.authModel);
      let { isEdit, metadata, data } = payload;

      if (user && ability.can('create', COMPONENT_NAME)) {
        if (isEdit) {
          // TODO (teamco): Going to update.
        } else {

          data = {
            ...data,
            metadata: {
              ...metadata,
              createdAt: metadata.updatedAt,
              createdByRef: user.id
            }
          };

          const entity = yield call(addSubscription, { data, token });

          if (entity?.data?.error) return false;

          if (entity?.exists && entity?.data?.id) {
            yield put({ type: 'updateState', payload: { touched: false, isEdit: true } });
            yield put({ type: 'editSubscription', payload: { params: { subscription: entity?.data?.id } } });
          }
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'handleSave' } });
      }
    },

    * deleteSubscription({ payload }, { call, select, put }) {
      const { token } = yield select(state => state.authModel);
      const { id } = payload;
      yield call(deleteSubscription, { id, token });
      const { data } = yield call(getAllSubscriptions, { token });
      yield put({ type: 'features' });
      yield put({ type: 'updateState', payload: { subscriptions: data } });
    }
  },

  reducers: {}
});
