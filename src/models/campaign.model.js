/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { isNew } from 'services/common.service';
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
import { dateFormat } from '@/utils/timestamp';

const DEFAULT_STATE = {
  campaigns: [],
  subscriptions: [],
  data: [],
  currencies: [],
  durationTypes: [],
  featureTypes: []
};

const BASE_URL = '/admin/campaigns';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'campaignModel',
  state: {
    ...DEFAULT_STATE,
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

    * query({ payload }, { put, call }) {
      const { data = [] } = yield call(getAllCampaigns);

      yield put({ type: 'updateState', payload: { data }
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
          const { data: {saleInfo} } = campaign;

          const selectedCampaign = {
            ...campaign.data,
            saleInfo: [moment(saleInfo.startedAt), moment(saleInfo.expiredAt)]
          };

          yield put({ type: 'updateState', payload: { selectedCampaign } });
          yield put({ type: 'updateTags', payload: { tags: selectedCampaign.tags, touched: false } });

          const _campaign = { ...selectedCampaign };
          const _features = {};

          _campaign.metadata = yield call(detailsInfo, { entity: _campaign, user });
          _campaign.features?.forEach(pref => {
            _features[pref] = true;
          });
          yield put({ type: 'campaignSubscriptions', payload: { type: 'Business'}});

          const formData = {
              featuresByRef: _campaign.featuresByRef,
              metadata: _campaign.metadata,
              subscriptionRef: _campaign.subscriptionRef,
              price: {
                currency: 'USD',
                discount: {
                  type: '%',
                  value: 1,
                  startedAt: moment(saleInfo.startedAt),
                  discounted: true,
                  originalPrice: 1,
                  duration: {
                    period: 1, type: 'Month'
                  },
                }
              },
              saleInfo: _campaign.saleInfo,
              translateKeys: _campaign.translateKeys
          }

          return yield put({
            type: 'toForm',
            payload: {
              model: 'campaignModel',
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

      // yield put({ type: 'campaignTypes' });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'currencies' } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'durationTypes' } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'featureTypes' } });
      yield put({ type: 'validateCampaign', payload: { campaignId: campaign } });
    },

    * prepareToSave({ payload, params }, { call, select, put }) {
      const { user, ability } = yield select(state => state.authModel);
      const { selectedCampaign, isEdit } = yield select(state => state.campaignModel);
      const {
        price,
        subscriptionType,
        featuresByRef,
        picUrl,
        type,
        translateKeys: {
          title,
          description = setAs(description, null)
        },
        tags = setAs(tags, []),
        saleInfo
      } = payload
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
        const {discounted} = price
        let data = {
          id: selectedCampaign?.id,
          name: i18n.t(title),
          featuresByRef: setAs(featuresByRef, []),
          picUrl: setAs(picUrl, 'picUrl'),
          saleInfo: {
            startedAt: dateFormat(saleInfo[0]),
            expiredAt: dateFormat(saleInfo[1]),
          },
          subscriptionRef: setAs(type, ''),
          translateKeys: { title, description },
          tags, activated: discounted, private: false
        }

        if (isEdit) {
          if (selectedCampaign && params.subscription === selectedCampaign.id) {
            const entity = yield call(updateCampaign, { id: selectedCampaign.id, data });
            yield put({
              type: 'updateVersion',
              payload: {
                touched: false,
                entity,
                selectedEntity: selectedCampaign,
                entityName: 'selectedCampaign'
              } });

          } else {
            errorSaveMsg(true, 'Subscription');
          }
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

          if (entity.exists) {
            yield put({ type: 'updateState', payload: { touched: false, isEdit: true }});
            history.push(`${BASE_URL}/${entity?.data?.id}`);
          }
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'selectedCampaign' } });
      }
    }
  },
  reducers: {}
});
