/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { commonModel } from '@/models/common.model';
import { isNew } from '@/services/common.service';
import { detailsInfo } from '@/services/cross.model.service';
import {
  addCampaign,
  getAllCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign
} from '@/services/campaigns.service';
import { history } from '@umijs/max';
import dayjs from 'dayjs';

import { getAllSubscriptions, getSubscription } from '@/services/subscriptions.service';
import { addFeature, getFeatures, updateFeature } from '@/services/features.service';
import { definePrice, defineTrialed } from '@/services/price.service';

import { monitorHistory } from '@/utils/history';
import { errorSaveMsg } from '@/utils/message';
import { setAs } from '@/utils/object';
import { dateFormat, DEFAULT_DATE_FORMAT } from '@/utils/timestamp';

const DEFAULT_STATE = {
  campaigns: [],
  schedulers: {},
  subscriptions: [],
  typeSubscriptionsMap: {},
  data: [],
  currencies: [],
  durationTypes: [],
  featureTypes: [],
  schedulerTypes: {
    sale: 'saleScheduler',
    discount: 'discountScheduler'
  }
};

const BASE_URL = '/admin/campaigns';
const COMPONENT_NAME = 'campaigns';
const MODEL_NAME = 'campaignModel';

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
      const { data = [] } = yield call(getAllCampaigns, { token });

      if (data?.error) return false;

      yield put({ type: 'updateState', payload: { campaigns: data } });
    },

    * campaignSubscriptions({ payload = {} }, { put, call, select }) {
      const { token } = yield select(state => state.authModel);

      const { data: subscriptions } = yield call(getAllSubscriptions, { token });
      const { data: features } = yield call(getFeatures, { token });

      let subscriptionTypes = [];
      let subscriptionFeatures = [];
      let typeSubscriptionsMap = new Map();

      if (!subscriptions || !features) {

        // TODO (teamco): Handle error.

      } else {

        subscriptions?.forEach?.((item) => {
          if (!subscriptionTypes?.includes(item.type)) {
            subscriptionTypes.push(item.type);
          }
        });

        subscriptionTypes?.forEach?.((type) => {
          typeSubscriptionsMap.set(type, subscriptions.filter(item => item.type === type));
        });

        subscriptionFeatures = subscriptions.map((item) => {
          const prefsNotIncluded = features.filter(feature => {
            return !item?.featuresByRef?.includes(feature.id) && item?.featureType === feature?.type;
          });

          return {
            type: item.type,
            name: item.name,
            features: prefsNotIncluded,
            id: item.id,
            featureType: item.featureType,
            translateKeys: item.translateKeys
          };
        });
      }

      yield put({
        type: 'updateState',
        payload: {
          subscriptions: subscriptionFeatures,
          typeSubscriptionsMap
        }
      });
    },

    * newCampaign({ payload }, { put }) {
      yield put({ type: 'schedulerModel/updateState', payload: { assignedSchedulers: [] } });
      yield put({ type: 'updateState', payload: { schedulers: {} } });

      yield put({
        type: 'handleNew',
        payload: {
          component: COMPONENT_NAME,
          BASE_URL,
          state: DEFAULT_STATE,
          selected: 'selectedCampaign'
        }
      });
    },

    * validateCampaign({ payload }, { call, put, select }) {
      const { user, ability, token } = yield select(state => state.authModel);
      const { campaignId } = payload;

      if (isNew(campaignId)) {
        // TODO (teamco): Do something.
        yield put({ type: 'newCampaign' });

      } else if (ability.can('read', 'campaigns')) {

        const campaign = yield call(getCampaign, { id: campaignId, token });

        if (campaign.exists) {

          history.push(`${BASE_URL}/${campaignId}`);

          yield put({ type: 'campaignSubscriptions' });

          const { data: { saleInfo, price, trialPeriod, trialed } } = campaign;

          const selectedCampaign = {
            ...campaign.data,
            saleInfo: [dayjs(saleInfo.startedAt), dayjs(saleInfo.expiredAt)],
            trialPeriod: { ...defineTrialed(trialed, trialPeriod, false) },
            price: { ...definePrice(price, false) }
          };

          yield put({ type: 'updateState', payload: { selectedCampaign } });
          yield put({ type: 'updateTags', payload: { tags: selectedCampaign.tags, touched: false } });

          const _campaign = { ...selectedCampaign };
          const _features = {};

          _campaign.metadata = yield call(detailsInfo, { entity: _campaign, user });
          _campaign.features?.forEach(pref => {
            _features[pref] = true;
          });

          const subscription = yield call(getSubscription, { id: _campaign.subscriptionRef, token });
          let subscriptionType = '';
          let subscriptionTitle = '';
          if (subscription.exists) {
            subscriptionType = subscription.data.type;
            subscriptionTitle = subscription.data.translateKeys?.title;
          }

          const formData = {
            featuresByRef: _campaign.featuresByRef,
            metadata: _campaign.metadata,
            subscriptionRef: _campaign.subscriptionRef,
            subscriptionType,
            subscription: subscriptionTitle,
            price: _campaign.price,
            trialPeriod: { ...defineTrialed(_campaign.trialed, _campaign.trialPeriod, false) },
            saleInfo: _campaign.saleInfo,
            translateKeys: _campaign.translateKeys,
            trialed: _campaign.trialed
          };

          return yield put({
            type: 'toForm',
            payload: {
              model: MODEL_NAME,
              form: { ...formData, features: { ..._features } }
            }
          });
        }

        yield put({ type: 'notFound', payload: { entity: 'Campaign', key: 'selectedCampaign' } });
      }
    },

    * editCampaign({ payload }, { put }) {
      const { params } = payload;
      const { campaign } = params;

      yield put({ type: 'cleanForm', payload: { isEdit: !isNew(campaign) } });
      yield put({ type: 'getSimpleEntity', payload: { docName: 'currencies' } });
      yield put({ type: 'getSimpleEntity', payload: { docName: 'durationTypes' } });
      yield put({ type: 'getSimpleEntity', payload: { docName: 'featureTypes' } });
      yield put({ type: 'validateCampaign', payload: { campaignId: campaign } });
      yield put({ type: 'updateLocales', payload: { MODEL_NAME } });
    },

    * prepareToSave({ payload, params }, { select, put }) {
      const { user } = yield select(state => state.authModel);
      const { selectedCampaign, isEdit } = yield select(state => state.campaignModel);
      const {
        price,
        featuresByRef,
        subscriptionRef,
        translateKeys: {
          title,
          description = setAs(description, null)
        },
        tags = setAs(tags, []),
        saleInfo,
        trialPeriod,
        trialed
      } = payload;

      const metadata = {
        ...selectedCampaign?.metadata,
        updatedAt: dateFormat(new Date()),
        updatedByRef: user.id
      };

      const { discounted } = price;

      let data = {
        id: selectedCampaign?.id,
        name: title,
        featuresByRef: setAs(featuresByRef, []),
        saleInfo: {
          startedAt: dateFormat(saleInfo[0]),
          expiredAt: dateFormat(saleInfo[1])
        },
        subscriptionRef: setAs(subscriptionRef, ''),
        translateKeys: { title, description },
        activated: discounted,
        private: false,
        metadata,
        price: { ...definePrice(price) },
        trialed
      };

      data.trialPeriod = trialed ? { ...defineTrialed(trialed, trialPeriod) } : null;

      yield put({ type: 'handleUpdate', payload: { data, isEdit, selectedCampaign, id: params.campaign } });
      yield put({ type: 'handleSave', payload: { data, isEdit, metadata } });
    },

    * handleUpdate({ payload }, { put, call, select }) {
      const { user, ability, token } = yield select(state => state.authModel);
      const { isEdit, selectedCampaign, id, data } = payload;

      if (user && ability.can('update', COMPONENT_NAME)) {
        if (isEdit) {
          if (selectedCampaign && id === selectedCampaign.id) {
            const _data = { ...data, version: selectedCampaign.version };
            const entity = yield call(updateCampaign, { id, data: _data, token });

            if (entity?.data?.error) return false;

            yield put({
              type: 'updateVersion',
              payload: {
                touched: false,
                entity,
                selectedEntity: selectedCampaign,
                entityName: 'selectedCampaign'
              }
            });

          } else {
            errorSaveMsg(true, 'selectedCampaign').then();
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
      const { isEdit, metadata, data } = payload;

      if (user && ability.can('update', COMPONENT_NAME)) {
        if (isEdit) {
          // TODO (teamco): Going to update.
        } else {

          data.metadata = {
            ...metadata,
            createdAt: metadata.updatedAt,
            createdByRef: user.id
          };

          const entity = yield call(addCampaign, { data, token });

          if (entity?.data?.error) return false;

          if (entity?.exists && entity?.data?.id) {
            yield put({ type: 'updateState', payload: { touched: false, isEdit: true } });
            yield put({ type: 'editCampaign', payload: { params: { campaign: entity?.data?.id } } });
          }
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'handleSave' } });
      }
    },

    * deleteCampaign({ payload }, { call, select, put }) {
      const { token } = yield select(state => state.authModel);
      const { id } = payload;
      yield call(deleteCampaign, { id, token });
      const { data = [] } = yield call(getAllCampaigns, { token });
      yield put({ type: 'updateState', payload: { campaigns: data } });
    }
  },
  reducers: {}
});
