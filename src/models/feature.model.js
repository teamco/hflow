/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { isNew } from '@/services/common.service';
import { detailsInfo } from '@/services/cross.model.service';
import { history } from '@umijs/max';

import { monitorHistory } from '@/utils/history';
import { errorSaveMsg } from '@/utils/message';
import { getFeature, getFeatures, updateFeature, deleteFeature, addFeature } from '@/services/features.service';
import { setAs } from '@/utils/object';
import { definePrice, defineTrialed } from '@/services/price.service';

const DEFAULT_STATE = {};

const MODEL_NAME = 'featureModel';
const BASE_URL = '/admin/features';
const COMPONENT_NAME = 'features';

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
      monitorHistory({ history, dispatch }, MODEL_NAME);
    },
    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },
  effects: {

    * query({ payload }, { put, call, select }) {
      const { token } = yield select(state => state.authModel);

      const { data = [] } = yield call(getFeatures, { token });

      if (data?.error) return false;

      yield put({ type: 'updateState', payload: { data, touched: false } });
    },

    * newFeature({ payload }, { put }) {
      yield put({
        type: 'handleNew',
        payload: {
          component: COMPONENT_NAME,
          BASE_URL,
          state: DEFAULT_STATE,
          selected: 'selectedFeature'
        }
      });
    },

    * validateFeature({ payload }, { call, put, select }) {
      const { user, ability, token } = yield select(state => state.authModel);
      const { featureId } = payload;

      if (isNew(featureId)) {

        yield put({ type: 'newFeature' });
        // TODO (teamco): Do something.

      } else if (ability.can('read', COMPONENT_NAME)) {
        const feature = yield call(getFeature, { id: featureId, token });

        if (feature?.data?.error) return false;

        if (feature.exists) {

          history.push(`${BASE_URL}/${featureId}`);

          const { price, trialPeriod, trialed } = feature.data;

          let selectedFeature = {
            ...feature.data,
            trialPeriod: { ...defineTrialed(trialed, trialPeriod, false) },
            price: { ...definePrice(price, false) }
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
      yield put({ type: 'getSimpleEntity', payload: { docName: 'currencies' } });
      yield put({ type: 'getSimpleEntity', payload: { docName: 'durationTypes' } });
      yield put({ type: 'getSimpleEntity', payload: { docName: 'featureTypes' } });
      yield put({ type: 'updateLocales', payload: { MODEL_NAME } });
    },

    * prepareToSave({ payload, params }, { select, put }) {
      const { user } = yield select(state => state.authModel);
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
          description
        },
        tags
      } = payload;

      const metadata = {
        ...selectedFeature?.metadata,
        updatedAt: (new Date).toISOString(),
        updatedByRef: user.id
      };

      const data = {
        id: selectedFeature?.id,
        name: title,
        selectedByDefault,
        trialPeriod: { ...defineTrialed(trialed, trialPeriod) },
        price: { ...definePrice(price) },
        type, trialed,
        translateKeys: {
          description: setAs(description, null),
          title
        },
        metadata,
        tags: setAs(tags, [])
      };

      if (trialed) {
        if (!trialPeriod?.price?.currency) {
          data.trialPeriod.price.currency = price.currency;
        }
      } else {
        data.trialPeriod = null;
      }

      yield put({ type: 'handleUpdate', payload: { data, isEdit, selectedFeature, id: feature } });
      yield put({ type: 'handleSave', payload: { data, isEdit, metadata } });
    },

    * handleUpdate({ payload }, { put, call, select }) {
      const { user, ability, token } = yield select(state => state.authModel);
      const { isEdit, selectedFeature, id, data } = payload;

      if (user && ability.can('update', COMPONENT_NAME)) {
        if (isEdit) {
          if (selectedFeature && id === selectedFeature.id) {
            data.version = selectedFeature.version;
            const entity = yield call(updateFeature, { id, data, token });

            if (entity?.data?.error) return false;

            yield put({
              type: 'updateVersion',
              payload: {
                entity,
                selectedEntity: selectedFeature,
                entityName: 'selectedFeature'
              }
            });

          } else {

            errorSaveMsg(true, 'Feature').then();
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

          const entity = yield call(addFeature, { data, token });

          if (entity?.data?.error) return false;

          if (entity?.exists && entity?.data?.id) {
            yield put({ type: 'updateState', payload: { touched: false, isEdit: true } });
            yield put({ type: 'editFeature', payload: { params: { feature: entity?.data?.id } } });
          }
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'handleSave' } });
      }
    },

    * deleteFeature({ payload }, { call, select, put }) {
      const { token } = yield select(state => state.authModel);
      const { id } = payload;
      const status = yield call(deleteFeature, { id, token });
      const { data = [] } = yield call(getFeatures, { token });
      yield put({ type: 'updateState', payload: { data, touched: false } });
    }
  },
  reducers: {}
});
