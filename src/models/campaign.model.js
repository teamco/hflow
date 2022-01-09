/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { custDiscountType, isNew } from 'services/common.service';
import { dateFormat } from '@/utils/timestamp';
import { detailsInfo } from 'services/cross.model.service';
import { getRef } from 'services/firebase.service';
import { addCampaign, getAllCampaigns, getCampaign, updateCampaign } from 'services/campaigns.service';
import { history } from 'umi';
import i18n from 'utils/i18n';
import { monitorHistory } from 'utils/history';
import { errorSaveMsg } from 'utils/message';
import { getAllSubscriptions } from 'services/subscriptions.service';
import { getFeatures } from 'services/features.service';
import { setAs } from 'utils/object';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '@/utils/timestamp';

const DEFAULT_STATE = {
  campaigns: []
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'campaignModel',
  state: {
    ...DEFAULT_STATE,
    subscriptions: [],
    data: [],
    currencies: [],
    durationTypes: [],
    featureTypes: []
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      return monitorHistory({ history, dispatch }, 'campaignModel');
    },
    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },
  effects: {

    * query({ payload }, { put, call, select }) {
      const { data = [] } = yield call(getAllCampaigns);

      yield put({
        type: 'updateState',
        payload: { data }
      });
    },

    * campaignSubscriptions({ payload }, { put, call }) {
      const {type = 'Business'} = payload || {};
      const { data: subscriptions = [] } = yield call(getAllSubscriptions);
      const {data: features = [] } = yield call(getFeatures, {type});
      const subscriptionFeatures = subscriptions.map((item) => {
        const prefsNotIncluded = features.filter(filterPref => {
          return !item.featuresByRef.includes(filterPref.id);
        });
        return { type: item.type, features: prefsNotIncluded, id: item.id, featureType: item.featureType };
      });

      yield put({
        type: 'updateState',
        payload: { subscriptions: subscriptionFeatures }
      });

    },

    * newCampaign({ payload }, { put }) {
      yield put({ type: 'cleanForm' });

      history.push(`/admin/campaigns/new`);

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

    * validateCampaign({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { campaignId } = payload;

      if (isNew(campaignId)) {
        // TODO (teamco): Do something.
      } else if (ability.can('read', 'campaigns')) {

        const campaign = yield call(getCampaign, { id: campaignId });

        if (campaign.exists) {
          const selectedCampaign = {
            ...campaign.data(), ...{ id: campaign.id } };

          yield put({ type: 'updateState', payload: { selectedCampaign } });

          const campaign = { ...selectedCampaign };
          campaign.metadata = yield call(detailsInfo, { entity: campaign, user });

          return yield put({
            type: 'toForm',
            payload: {
              model: 'campaignModel',
              form: { ...campaign }
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

      // yield put({ type: 'campaignTypes' });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'currencies' } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'durationTypes' } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'featureTypes' } });
      yield put({ type: 'validateCampaign', payload: { campaignId: campaign } });
    },

    * prepareToSave({ payload, params }, { call, select, put }) {
      const { user, ability } = yield select(state => state.authModel);
      const { selectedCampaign, isEdit } = yield select(state => state.campaignModel);

      if (user && ability.can('update', 'campaign')) {

        const userRef = getRef({
          collection: 'users',
          doc: user.id
        });

        const metadata = {
          ...selectedCampaign?.metadata,
          updatedAt: +(new Date).toISOString(),
          updatedByRef: user.id
        };
        const {price: {discount, discounted}} = payload
        // prepare request
        let data = {
          name: setAs(payload.name, 'name'),
          type: setAs(payload.subscriptionType, 'Business'),
          featuresByRef: setAs(payload.featuresByRef, []),
          picUrl: setAs(payload.picUrl, 'picUrl'),
          subscriptionRef: setAs(payload.type, ''),
          translateKeys: {
            title: setAs(payload.title, ''),
            description: setAs(payload.description, ''),
          },
          duration: discount.duration,
          discount: {
            type: custDiscountType(discount.type),
            value: discount.value,
            startedAt: dateFormat(discount.startedAt),
            duration: discount.duration
          },
          tags: [],
          startedAt: dateFormat(discount.startedAt),
          activated: discounted,
          discounted
        }

        if (isEdit) {
          selectedCampaign && params.subscription === selectedCampaign.id ?
              yield call(updateCampaign, { collection: 'campaign', doc: selectedCampaign.id, data }) :
              errorSaveMsg(true, 'campaign');

          yield put({ type: 'updateState', payload: { touched: false } });

        } else {

          data = {
            ...data,
            metadata: {
              ...metadata,
              createdAt: metadata.updatedAt,
              createdByRef:  user.id
            }
          };

          const entity = yield call(addCampaign, { data });

          if (entity?.docId) {
            yield put({
              type: 'updateState',
              payload: {
                touched: false,
                isEdit: true
              }
            });

            history.push(`/admin/campaigns/${entity.docId}`);
          }
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'selectedCampaign' } });
      }
    }
  },
  reducers: {}
});
