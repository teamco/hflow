/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { custDiscountType, isNew } from 'services/common.service';
import { detailsInfo } from 'services/cross.model.service';
import { history } from 'umi';
import {
  addSubscription,
  getAllSubscriptions,
  getSubscription,
  updateSubscription
} from '@/services/subscriptions.service';
import { COLORS } from '@/utils/colors';
import { monitorHistory } from '@/utils/history';
import { errorSaveMsg } from '@/utils/message';
import { setAs } from '@/utils/object';
import { getFeatures } from '@/services/features.service';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '@/utils/timestamp';
import i18n from '@/utils/i18n';

const DEFAULT_STATE = {
  subscriptions: [],
  features: [],
  durationTypes: [],
  currencies: [],
  colorsToType: {
    basic: COLORS.tags.orange,
    standard: COLORS.tags.cyan,
    premium: COLORS.tags.green
  },
  businessUsers: {
    dims: { min: 1, max: 5 }
  }
};

const MODEL_NAME = 'subscriptionModel';
const BASE_URL = '/admin/subscriptions';
const ABILITY_FOR = 'subscriptions';

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
      return monitorHistory({ history, dispatch }, MODEL_NAME);
    },
    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },
  effects: {

    * query({ payload }, { put, call }) {
      const { data } = yield call(getAllSubscriptions);

      yield put({ type: 'features' });
      yield put({ type: 'updateState', payload: { subscriptions: data } });
    },

    * newSubscription({ payload }, { put }) {
      yield put({ type: 'cleanForm' });

      history.push(`${BASE_URL}/new`);

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
      } else if (ability.can('read', ABILITY_FOR)) {

        const subscription = yield call(getSubscription, { id: subscriptionId });

        if (subscription.exists) {
          const { price: { discount } } = subscription.data;

          const selectedSubscription = {
            ...subscription.data,
            price: {
              ...subscription.data.price,
              discount: {
                ...discount,
                startedAt: moment(discount?.startedAt),
                duration: { ...discount?.duration }
              }
            }
          };

          yield put({ type: 'updateState', payload: { selectedSubscription } });
          yield put({ type: 'updateTags', payload: { tags: selectedSubscription.tags, touched: false } });

          const _subscription = { ...selectedSubscription };
          const _features = {};

          _subscription.metadata = yield call(detailsInfo, { entity: _subscription, user });
          _subscription.features?.forEach(pref => {
            _features[pref] = true;
          });

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
      const { type } = params;

      yield put({ type: 'cleanForm', payload: { isEdit: !isNew(subscription) } });
      yield put({ type: 'features', payload: { type } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'currencies' } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'durationTypes' } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'subscriptionTypes' } });
      yield put({ type: 'validateSubscription', payload: { subscriptionId: subscription } });
    },

    * features({ payload }, { call, put }) {
      const { type = 'Business' } = payload || {};
      const { data = [] } = yield call(getFeatures, { type });
      yield put({ type: 'updateState', payload: { features: data } });
    },

    * prepareToSave({ payload, params }, { call, select, put }) {
      const { user, ability } = yield select(state => state.authModel);
      const { selectedSubscription, isEdit } = yield select(state => state[MODEL_NAME]);
      const {
        price,
        type,
        duration,
        featuresByRef,
        numberOfUsers,
        translateKeys: {
          title,
          description
        },
        tags
      } = payload;

      if (user && ability.can('update', ABILITY_FOR)) {

        const metadata = {
          ...selectedSubscription?.metadata,
          updatedAt: +(new Date).toISOString(),
          updatedByRef: user.id
        };

        let data = {
          id: selectedSubscription?.id,
          name: i18n.t(title),
          price: {
            ...price,
            discount: {
              ...price.discount,
              startedAt: `${moment(price.discount.startedAt).format(DEFAULT_DATE_FORMAT)} 00:00:00`,
              type: custDiscountType(price.discount.type)
            }
          },
          type,
          duration,
          numberOfUsers,
          translateKeys: {
            title,
            description: setAs(description, null)
          },
          metadata,
          featuresByRef: Object.keys(featuresByRef).filter(key => featuresByRef[key]),
          tags: setAs(tags, [])
        };

        if (isEdit) {
          if (selectedSubscription && params.subscription === selectedSubscription.id) {
            const entity = yield call(updateSubscription, { id: selectedSubscription.id, data });

            yield put({
              type: 'updateVersion',
              payload: {
                entity,
                selectedEntity: selectedSubscription,
                entityName: 'selectedSubscription'
              }
            });

          } else {
            errorSaveMsg(true, 'Subscription');
          }

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

          if (entity.exists) {
            yield put({ type: 'updateState', payload: { touched: false, isEdit: true } });
            history.push(`${BASE_URL}/${entity?.data?.id}`);
          }
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'selectedSubscription' } });
      }
    }
  },
  reducers: {}
});
