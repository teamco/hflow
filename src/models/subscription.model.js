/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { custDiscountType, isNew } from 'services/common.service';
import { detailsInfo } from 'services/cross.model.service';
import { history, useIntl } from 'umi';
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
import { dateFormat } from '@/utils/timestamp';

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

    * query({ payload }, { put, call, select }) {
      const { token } = yield select(state => state.authModel);
      const { data } = yield call(getAllSubscriptions, { token });

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
      const { user, ability, token } = yield select(state => state.authModel);
      const { subscriptionId } = payload;

      if (isNew(subscriptionId)) {
        // TODO (teamco): Do something.
        yield put({ type: 'features' });

      } else if (ability.can('read', ABILITY_FOR)) {

        const subscription = yield call(getSubscription, { id: subscriptionId, token });

        if (subscription.exists) {
          const { price: { discount }, saleInfo } = subscription.data;

          const selectedSubscription = {
            ...subscription.data,
            price: {
              ...subscription.data.price,
              discount: {
                ...discount,
                startedAt: moment(discount?.startedAt),
                duration: { ...discount?.duration }
              }
            },
            saleInfo: [moment(saleInfo.startedAt), moment(saleInfo.expiredAt)]
          };

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
      yield put({ type: 'getSimpleEntity', payload: { doc: 'currencies' } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'durationTypes' } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'featureTypes' } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'subscriptionTypes' } });
      yield put({ type: 'validateSubscription', payload: { subscriptionId: subscription } });
    },

    * changeFeatureType({ payload = {} }, { put }) {
      const { type = 'Business' } = payload;
      yield put({ type: 'features', payload: { type } });
    },

    * features({ payload = {} }, { call, put, select }) {
      const { token } = yield select(state => state.authModel);
      const { type = 'Business' } = payload;
      const { data = [] } = yield call(getFeatures, { type, token });
      yield put({ type: 'updateState', payload: { features: data } });
    },

    * prepareToSave({ payload, params }, { call, select, put }) {
      const { user, ability, token } = yield select(state => state.authModel);
      const { selectedSubscription, isEdit } = yield select(state => state[MODEL_NAME]);
      const {
        price,
        type,
        featureType,
        paymentDuration,
        featuresByRef,
        numberOfUsers,
        translateKeys: {
          title,
          description = setAs(description, null)
        },
        tags = setAs(tags, []),
        saleInfo
      } = payload;

      if (user && ability.can('update', ABILITY_FOR)) {

        const metadata = {
          ...selectedSubscription?.metadata,
          updatedAt: +(new Date).toISOString(),
          updatedByRef: user.id
        };

        let data = {
          id: selectedSubscription?.id,
          name: useIntl().formatMessage({id: title, defaultMessage: ''}),
          price: {
            ...price,
            discount: {
              ...price.discount,
              startedAt: dateFormat(price.discount.startedAt),
              type: custDiscountType(price.discount.type)
            }
          },
          saleInfo: {
            startedAt: dateFormat(saleInfo[0]),
            expiredAt: dateFormat(saleInfo[1])
          },
          translateKeys: { title, description },
          featuresByRef: Object.keys(featuresByRef).filter(key => featuresByRef[key]),
          type, featureType, tags, paymentDuration,
          numberOfUsers, metadata
        };

        if (isEdit) {
          if (selectedSubscription && params.subscription === selectedSubscription.id) {
            const entity = yield call(updateSubscription, { id: selectedSubscription.id, data, token });

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

          const entity = yield call(addSubscription, { data, token });

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
