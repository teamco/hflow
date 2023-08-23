/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { monitorHistory } from '@/utils/history';
import {
  getAllCountries,
  getCountryStates,
  getStateCities
} from '@/services/address.service';

const MODEL_NAME = 'addressModel';

const DEFAULT_STATE = {
  countries: [],
  states: {},
  cities: {},
  countryStates: [],

  /**
   * addressType: This field is used to store the type of address, using the short names (res, bus, pob, mil, rr, hcr, gd)
   * RES - This refers to a residential address, which is the physical location where a person lives.
   * BUS - This refers to a business address, which is the location of a company or organization. It is typically used for commercial purposes, such as shipping and receiving goods.
   * POB - This refers to a post office box address, which is a mailbox rented from a post office or other mailbox provider. It is often used by individuals or businesses who do not have a physical address or who prefer to keep their mailing address separate from their physical address.
   * MIL - This refers to a military address, which is used by members of the armed forces who are stationed overseas. It includes a unique code that identifies the military unit and location.
   * RR - This refers to a rural route address, which is used in areas outside of cities and towns where mail is delivered to mailboxes located along a specific rural route.
   * HCR - This refers to a highway contract route address, which is similar to a rural route address, but is used for mail delivery to locations along a contracted delivery route.
   * GD - This refers to a general delivery address, which is used when someone does not have a specific mailing address. Mail sent to a general delivery address can be picked up at the post office by the recipient.
   *
   * name: This field is used to store the name of the person or entity associated with the address.
   *
   * companyName: This field is used to store the company name associated with the address, if it's a business address.
   *
   * addressLine1: This field is used to store the first line of the street address.
   * addressLine2: This field is used to store the second line of the street address.
   *
   * poBox: This field is used to store the PO Box number if the address is a PO Box address.
   * boxNumber: This field is used to store the box number if the address has a box number.
   *
   * city: This field is used to store the city of the address.
   * state: This field is used to store the state of the address.
   * zipCode: This field is used to store the zip code of the address.
   * country: This field is used to store the country of the address.
   *
   * ruralRoute: This field is used to store the rural route number if the address is a rural route address.
   * highwayContractRoute: This field is used to store the highway contract route number if the address is a highway contract route address.
   * generalDelivery: This field is used to store the general delivery if the address is a general delivery address.
   */
  initialValues: {
    addressType: 'RES',
    name: null,
    companyName: null,
    addressLine1: null,
    addressLine2: null,
    poBox: null,
    ruralRoute: null,
    highwayContractRoute: null,
    generalDelivery: null,
    boxNumber: null,
    city: null,
    state: null,
    zipCode: null,
    country: null,
    neighborhoodByRef: null,
    coordinate: {
      longitude: null,
      latitude: null
    },
    primary: false,
    billing: false
  },
  addressTypes: []
};

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
      dispatch({ type: 'query' });
    }
  },

  effects: {

    * getAllCountries({ payload }, { put, call, select }) {
      const { countries } = yield select(state => state[MODEL_NAME]);
      if (countries.length) return false;

      const data = yield call(getAllCountries);

      yield put({ type: 'updateState', payload: { countries: data } });
    },

    * getCountryStates({ payload }, { put, call, select }) {
      const { states } = yield select(state => state[MODEL_NAME]);
      const { country } = payload;

      if (states[country?.iso2]) return false;

      const data = yield call(getCountryStates, { country });

      yield put({
        type: 'updateState',
        payload: {
          states: { [country?.iso2]: data },
          countryStates: data
        }
      });
    },

    * getStateCities({ payload }, { put, call, select }) {
      const { cities } = yield select(state => state[MODEL_NAME]);
      const { country, state } = payload;

      if (cities[state?.iso2]) return false;

      const data = yield call(getStateCities, { country, state });

      yield put({
        type: 'updateState',
        payload: {
          cities: { [state?.iso2]: data },
          stateCities: data
        }
      });
    }
  },

  reducers: {}
});
