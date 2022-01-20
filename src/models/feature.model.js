/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { custDiscountType, isNew } from 'services/common.service';
import { detailsInfo } from 'services/cross.model.service';
import { history } from 'umi';

import i18n from 'utils/i18n';
import { monitorHistory } from 'utils/history';
import { errorSaveMsg } from 'utils/message';
import { addFeature, getFeature, getFeatures, updateFeature } from 'services/features.service';
import { setAs } from 'utils/object';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '@/utils/timestamp';

const DEFAULT_STATE = {};

const MODEL_NAME = 'featureModel';
const BASE_URL = '/admin/features';
const ABILITY_FOR = 'features';

/**
 * @constant
 * @param {{discount, discounted: boolean}} price
 * @param {boolean} [format]
 * @return {{price: (*&{discount: (*&{startedAt: string, type: string})})}}
 * @private
 */
const _definePrice = (price = {}, format = true) => {
  const { discount = {}, discounted } = price;
  const startedAt = discount?.startedAt ?
      format ? `${moment(discount?.startedAt).format(DEFAULT_DATE_FORMAT)} 00:00:00` :
          moment(discount?.startedAt) : null;

  return {
    ...price,
    discount: discounted ? {
      ...discount,
      startedAt,
      type: custDiscountType(discount?.type),
      duration: { ...discount?.duration }
    } : null
  };
};

/**
 * @constant
 * @param {boolean} trialed
 * @param {{price}} trialPeriod
 * @param {boolean} [format]
 * @return {{price: {price: *}}}
 * @private
 */
const _defineTrialed = (trialed, trialPeriod = {}, format = true) => {
  return trialed ? {
    ...trialPeriod,
    price: { ..._definePrice(trialPeriod?.price, format) }
  } : null;
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: {
    ...DEFAULT_STATE,
    data: [],
    featureTypes: [],
    durationTypes: [],
    currencies: []
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
      const { data = [] } = yield call(getFeatures, { type: 'Business' });
      yield put({ type: 'updateState', payload: { data, touched: false } });
    },

    * newFeature({ payload }, { put }) {
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

    * validateFeature({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { featureId } = payload;

      if (isNew(featureId)) {
        // TODO (teamco): Do something.
      } else if (ability.can('read', ABILITY_FOR)) {

        const feature = yield call(getFeature, { id: featureId });

        if (feature.exists) {
          const { price, trialPeriod, trialed } = feature.data;

          let selectedFeature = {
            ...feature.data,
            trialPeriod: { ..._defineTrialed(trialed, trialPeriod, false) },
            price: { ..._definePrice(price, false) }
          };

          const _feature = { ...selectedFeature };
          _feature.metadata = yield call(detailsInfo, { entity: _feature, user });

          yield put({ type: 'updateState', payload: { selectedFeature } });
          yield put({ type: 'updateTags', payload: { tags: _feature.tags, touched: false } });

          return yield put({
            type: 'toForm',
            payload: {
              model: MODEL_NAME,
              form: { ..._feature }
            }
          });
        }

        yield put({ type: 'notFound', payload: { entity: 'Feature', key: 'selectedFeature' } });
      }
    },

    * editFeature({ payload }, { put }) {
      const { params } = payload;
      const { feature } = params;

      yield put({ type: 'cleanForm', payload: { isEdit: !isNew(feature) } });
      yield put({ type: 'validateFeature', payload: { featureId: feature } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'currencies' } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'durationTypes' } });
      yield put({ type: 'getSimpleEntity', payload: { doc: 'featureTypes' } });
    },

    * prepareToSave({ payload, params }, { call, select, put }) {
      const { user, ability } = yield select(state => state.authModel);
      const { selectedFeature, isEdit } = yield select(state => state[MODEL_NAME]);
      const { feature } = params;
      const {
        selectedByDefault,
        price,
        type,
        trialPeriod,
        trialed,
        translateKeys: {
          title,
          description,
          on,
          off
        },
        tags
      } = payload;

      if (user && ability.can('update', ABILITY_FOR)) {

        const metadata = {
          ...selectedFeature?.metadata,
          updatedAt: +(new Date).toISOString(),
          updatedByRef: user.id
        };

        const data = {
          id: selectedFeature?.id,
          name: i18n.t(title),
          selectedByDefault,
          trialPeriod: { ..._defineTrialed(trialed, trialPeriod) },
          price: { ..._definePrice(price) },
          type, trialed,
          translateKeys: {
            description: setAs(description, null),
            title, on, off
          },
          metadata,
          tags: setAs(tags, [])
        };

        // TODO (teamco): Workaround for un-updated trial period (as a new component issue).
        if (!trialPeriod?.price?.currency) {
          data.trialPeriod.price.currency = price.currency;
        }

        if (isEdit) {
          if (selectedFeature && feature === selectedFeature.id) {
            data.version = selectedFeature.version;
            const entity = yield call(updateFeature, { id: feature, data });

            yield put({
              type: 'updateVersion',
              payload: {
                entity,
                selectedEntity: selectedFeature,
                entityName: 'selectedFeature'
              }
            });

          } else {
            errorSaveMsg(true, 'Feature');
          }

        } else {

          data.metadata = {
            ...metadata,
            createdAt: metadata.updatedAt,
            createdByRef: user.id
          };

          const entity = yield call(addFeature, { data });

          if (entity.exists) {
            yield put({ type: 'updateState', payload: { touched: false, isEdit: true } });
            history.push(`${BASE_URL}/${entity?.data?.id}`);
          }
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'selectedFeature' } });
      }
    }
  },
  reducers: {}
});
