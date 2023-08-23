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
  data: [],
};

const BASE_URL = '/admin/properties';
const COMPONENT_NAME = 'properties';
const MODEL_NAME = 'propertyModel';

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
    },
  },
  reducers: {}
});
