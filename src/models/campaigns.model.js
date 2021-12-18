/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { isNew } from 'services/common.service';
import { detailsInfo } from 'services/cross.model.service';
import { fbAdd, fbFindById, fbUpdate, getRef } from 'services/firebase.service';
import { getAllCampaigns } from 'services/campaigns.service';
import { history } from 'umi';
import { monitorHistory } from 'utils/history';
import i18n from 'utils/i18n';
import { errorSaveMsg } from 'utils/message';
import { setAs } from 'utils/object';

const DEFAULT_STATE = {
  campaigns: []
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'campaignModel',
  state: {
    ...DEFAULT_STATE
  },
  campaigns: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, 'campaignModel');
    },
    setup({ dispatch }) {
    }
  },
  effects: {

    * query({ payload }, { put, call, select }) {
      const campaigns = yield call(getAllCampaigns);

      yield put({
        type: 'updateState',
        payload: { campaigns }
      });
    },

    * newCampaigns({ payload }, { put }) {
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
      const { subscriptionId } = payload;

      if (isNew(campaignId)) {
        // TODO (teamco): Do something.
      } else if (ability.can('read', 'campaigns')) {

        const campaign = yield call(fbFindById, {
          collection: 'campaigns',
          doc: campaignId
        });

        if (campaign.exists) {
          const selectedCampaign = { ...campaign.data(), ...{ id: campaign.id } };

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
      yield put({ type: 'campaignTypes' });
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
          selectedCampaign && params.subscription === selectedCampaign.id ?
              yield call(fbUpdate, { collection: 'campaign', doc: selectedCampaign.id, data }) :
              errorSaveMsg(true, 'campaign');

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

          const entity = yield call(fbAdd, { collection: 'campaigns', data });

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
