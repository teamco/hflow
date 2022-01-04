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
      yield put({ type: 'updateState', payload: { data } });
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
          const selectedFeature = { ...feature.data };

          yield put({ type: 'updateState', payload: { selectedFeature } });

          const _feature = { ...selectedFeature };
          _feature.metadata = yield call(detailsInfo, { entity: _feature, user });

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
        currency,
        translateKeys: {
          title,
          description,
          on,
          off
        }
      } = payload;

      if (user && ability.can('update', ABILITY_FOR)) {

        const metadata = {
          ...selectedFeature?.metadata,
          updatedByRef: user.id
        };

        const data = {
          id: selectedFeature?.id,
          name: i18n.t(title),
          selectedByDefault,
          price: {
            ...price,
            discount: {
              ...price.discount,
              startedAt: moment(price.discount.startedAt).format(DEFAULT_DATE_FORMAT),
              type: custDiscountType(price.discount.type)
            }
          },
          type, currency,
          translateKeys: {
            description: setAs(description, null),
            title, on, off
          },
          metadata
        };

        if (isEdit) {
          if (selectedFeature && feature === selectedFeature.id) {
            data.version = selectedFeature.version;
            const entity = yield call(updateFeature, { id: feature, data });

            if (entity.exists) {
              yield put({ type: 'updateState', payload: { touched: false } });
            }
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
