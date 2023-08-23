/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

import { monitorHistory } from '@/utils/history';

import {
  getProfileAddresses,
  storeProfileAddresses
} from '@/services/profile.service';

import { getAddressRules } from '@/services/address.service';

const MODEL_NAME = 'profileAddressModel';
const COMPONENT_NAME = 'profile.address';

const DEFAULT_STATE = {
  actionBtns: {},
  sAddresses: []
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

    * getAddresses({ payload = {} }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);

      yield put({ type: 'cleanForm' });

      if (ability.can('read', COMPONENT_NAME) && sUser?.profileByRef) {

        const { data } = yield call(getProfileAddresses, {
          token,
          userKey: user?.id,
          profileKey: sUser?.profileByRef
        });

        if (data?.error) return false;

        const rules = yield call(getAddressRules, { token });

        if (rules?.error) return false;

        yield put({ type: 'addressModel/updateState', payload: { addressTypes: [...rules.data] } });
        yield put({ type: 'updateState', payload: { sAddresses: [...data] } });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'getAddresses' } });
      }
    },

    * updateAddress({ payload = {} }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);
      const { sAddresses } = yield select(state => state[MODEL_NAME]);

      const { formValues, selected, initialValues } = payload;

      const formAddress = { ...initialValues, ...formValues };

      if (ability.can('create', COMPONENT_NAME)) {
        let info = {};
        let operation = 'Add';

        const includesAddress = sAddresses.find(e => e.id === selected?.id);

        if (includesAddress) {
          operation = 'Update';
          info = {
            id: selected.id,
            version: selected.version
          };
        }

        const data = [
          {
            operation,
            address: {
              ...formAddress,
              ...info
            }
          }
        ];

        const entity = yield call(storeProfileAddresses, {
          data,
          token,
          userKey: user.id,
          profileKey: sUser.profileByRef
        });

        if (entity?.data?.error) return false;

        yield put({ type: 'updateAddressState', payload: { data: entity?.data } });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'updateAddress' } });
      }
    },

    * editAddress({ payload = {} }, { put, select }) {
      const { ability } = yield select(state => state.authModel);
      const { sAddresses } = yield select(state => state[MODEL_NAME]);
      const { address, unselect = false } = payload;

      if (ability.can('update', COMPONENT_NAME)) {
        const includesAddress = sAddresses.find(e => e.id === address?.id);

        if (includesAddress) {
          const data = {
            isEdit: includesAddress && !unselect,
            touched: includesAddress && !unselect
          };

          yield put({ type: 'updateState', payload: { ...data } });

        } else {

          yield put({ type: 'notFound', payload: { key: 'editAddress' } });
        }

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'editAddress' } });
      }
    },

    * deleteAddress({ payload = {} }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);
      const { sAddresses } = yield select(state => state[MODEL_NAME]);

      const { address } = payload;

      if (ability.can('delete', COMPONENT_NAME)) {
        const includesAddress = sAddresses.find(e => e.id === address?.id);

        if (includesAddress) {

          const data = [{ operation: 'Delete', address }];

          const entity = yield call(storeProfileAddresses, {
            data,
            token,
            userKey: user.id,
            profileKey: sUser.profileByRef
          });

          if (entity?.data?.error) return false;

          yield put({ type: 'updateState', payload: { sAddresses: entity?.data } });

        } else {

          yield put({ type: 'notFound', payload: { key: 'deleteAddress' } });
        }

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'deleteAddress' } });
      }
    },

    * updateAddressState({ payload = {} }, { put, select }) {
      const { actionBtns } = yield select(state => state.profileModel);

      const { resetButtons = false, data } = payload;

      const _actionBtns = resetButtons ? {} : actionBtns;

      yield put({
        type: 'updateState',
        payload: {
          actionBtns: _actionBtns,
          sAddresses: [...data],
          isEdit: false,
          touched: false
        }
      });
    }

  },

  reducers: {}
});
