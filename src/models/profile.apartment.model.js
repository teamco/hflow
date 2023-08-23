/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import {
  DatePicker,
  Input,
  InputNumber
} from 'antd';

import { commonModel } from '@/models/common.model';

import { monitorHistory } from '@/utils/history';

import { getAddressRules } from '@/services/address.service';
import { API } from '@/services/config/api.config';

const MODEL_NAME = 'profileApartmentModel';
const COMPONENT_NAME = 'profile.apartments';

const DEFAULT_STATE = {
  actionBtns: {},
  sApartments: [],
  enums: {
    attributes: [
      'shelter',
      'balcony',
      'airCondition',
      'elevator',
      'furniture',
      'disabledAccess',
      'storageRoom'
    ],
    properties: [
      { name: 'numberOfBedrooms', Component: InputNumber, range: [1, 10] },
      { name: 'buildInYear', Component: DatePicker, picker: 'year' },
      { name: 'numberOfRooms', Component: InputNumber, range: [1, 10] },
      { name: 'numberOfBathrooms', Component: InputNumber, range: [1, 10] },
      { name: 'condition', Component: Input },
      { name: 'windowsFeatures', Component: Input },
      { name: 'waterHeaterType', Component: Input },
      { name: 'numberOfParkingPlaces', Component: InputNumber, range: [1, 10] },
      { name: 'numberOfFloorsInBuilding', Component: InputNumber, range: [1, 100] },
      { name: 'lotSize', Component: InputNumber, addonBefore: 'ft' },
      { name: 'livingArea', Component: InputNumber, addonBefore: 'ft' }
    ]
  },
  assets: {},
  assetsFolder: null,
  errorUpload: null,
  spinning: false,
  durationTypes: [],
  currencies: [],
  schedulers: {},
  schedulerTypes: {
    sale: 'saleScheduler',
    discount: 'discountScheduler'
  }
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: { ...DEFAULT_STATE },

  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, MODEL_NAME);
    },

    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },

  effects: {

    * getApartments({ payload = {} }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);

      if (ability.can('read', COMPONENT_NAME) && sUser?.profileByRef) {

        // const { data } = yield call(getUserApartments, {
        //   token,
        //   userKey: user?.id,
        //   profileKey: sUser?.profileByRef
        // });
        //
        // if (data?.error) return false;
        //
        // yield put({ type: `${model ? `${model}/` : ''}updateState`, payload: { sLinks: [...data] } });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'getAddresses' } });
      }
    },

    * newApartment() {

    },

    * getApartment({ payload }, { call, put, select }) {
      const { user, ability, token } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);

      if (ability.can('read', COMPONENT_NAME) && sUser?.profileByRef) {

        // Store upload folder.
        yield put({ type: 'updateState', payload: { assetsFolder: `${user.id}/apartments` } });

        const rules = yield call(getAddressRules, { token });

        if (rules?.error) return false;

        yield put({ type: 'addressModel/updateState', payload: { addressTypes: [...rules.data] } });

        yield put({ type: 'getSimpleEntity', payload: { docName: 'currencies' } });
        yield put({ type: 'getSimpleEntity', payload: { docName: 'durationTypes' } });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'getApartment' } });
      }
    },

    * handleUploadFile({ payload }, { call, put, select }) {
      const { ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);
      const { assetsFolder, assets } = yield select(state => state[MODEL_NAME]);

      yield put({ type: 'updateState', payload: { assetsFolder, spinning: true } });

      if (ability.can('upload', COMPONENT_NAME) && sUser?.profileByRef) {
        yield put({
          type: 'cloudinaryModel/cloudinaryAddFile',
          payload: {
            ...payload,
            assets,
            folder: assetsFolder,
            model: MODEL_NAME
          }
        });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'handleUploadFile' } });
      }
    },

    * subscriptionSchedulers({ payload }, { put, select, take }) {
      const { apartment: { data } } = payload;

      yield put({
        type: 'profileApartmentModel/getSchedulersOf',
        payload: {
          apiOf: API.apartments.get,
          keyOf: 'apartmentKey',
          id: data?.id
        }
      });

      yield take('profileApartmentModel/getSchedulersOf/@@end');

      const { schedulerTypes } = yield select(state => state[MODEL_NAME]);

      yield put({
        type: 'profileApartmentModel/distributeSchedulers',
        payload: {
          schedulers: data?.schedulersByRef,
          schedulerType: schedulerTypes.sale,
          model: MODEL_NAME
        }
      });

      if (data?.price?.discounted) {

        yield put({
          type: 'profileApartmentModel/distributeSchedulers',
          payload: {
            schedulers: data?.price?.schedulersByRef,
            schedulerType: schedulerTypes.discount,
            model: MODEL_NAME
          }
        });
      }
    }
  },

  reducers: {}
});
