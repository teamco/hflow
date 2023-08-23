/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

import { monitorHistory } from '@/utils/history';

import {
  apartmentLike,
  apartmentUnLike,
  apartmentView,
  getAddress,
  getApartment,
  getUserApartmentLike
} from '@/services/apartment.service';

const MODEL_NAME = 'apartmentModel';
const COMPONENT_NAME = 'apartments';

const DEFAULT_STATE = {
  thumbsCount: 3,
  selectedApartment: {},
  selectedAddress: {},
  viewed: 1,
  liked: null,
  forceOn: null
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
      // TODO (teamco): Do something.
      dispatch({ type: 'cleanForm', payload: { ...DEFAULT_STATE } });
    }
  },

  effects: {

    * query({ payload }, { put, call, select }) {
      const { ability, token, user } = yield select(state => state.authModel);
      const { selectedApartment } = yield select(state => state[MODEL_NAME]);

      const { id } = payload;

      if (ability.can('read', COMPONENT_NAME) && selectedApartment?.id !== id) {
        const { data } = yield call(getApartment, { token, id });

        if (data?.error) {
          return false;
        }

        yield put({ type: 'getLikes', payload: { id } });
        yield put({ type: 'getViews', payload: { id } });

        yield put({
          type: 'updateState',
          payload: {
            selectedApartment: data,
            selectedAddress: {}
          }
        });
      }
    },

    * address({ payload }, { put, call, select }) {
      const { ability, token } = yield select(state => state.authModel);
      const { selectedAddress } = yield select(state => state[MODEL_NAME]);

      const { id } = payload;

      if (ability.can('read', COMPONENT_NAME) && selectedAddress?.id !== id) {
        const { data } = yield call(getAddress, { token, id });

        if (data?.error) {
          return false;
        }

        yield put({ type: 'updateState', payload: { selectedAddress: data } });
      }
    },

    * getViews({ payload }, { put, call, select }) {
      const { token, user } = yield select(state => state.authModel);

      const { data } = yield call(apartmentView, {
        token,
        userByRef: user?.id,
        itemByRef: payload?.id
      });

      if (data?.error) {
        return false;
      }

      yield put({ type: 'updateState', payload: { viewed: data?.version } });
    },

    * getLikes({ payload }, { put, call, select }) {
      const { token, user } = yield select(state => state.authModel);

      const { data } = yield call(getUserApartmentLike, {
        token,
        userByRef: user?.id,
        itemByRef: payload?.id
      });

      if (data?.error) {
        return false;
      }

      yield put({ type: 'updateState', payload: { liked: data } });
    },

    * like({ payload }, { put, call, select }) {
      const { ability, token, user } = yield select(state => state.authModel);
      const { liked } = yield select(state => state[MODEL_NAME]);

      const { id, callbackType = 'landingModel/getApartments' } = payload;

      if (ability.can('like', COMPONENT_NAME)) {
        let like, data;

        if (liked?.content && liked?.content[0]?.itemByRef === id) {

          data = { ...liked };

        } else {

          const aLike = yield call(getUserApartmentLike, {
            token,
            userByRef: user?.id,
            itemByRef: id
          });

          if (aLike?.data?.error) {
            return false;
          }

          data = { ...aLike?.data };
        }

        if (data?.content) {

          yield put({ type: 'unLike', payload: { data } });

        } else {

          like = yield call(apartmentLike, {
            token,
            userByRef: user?.id,
            itemByRef: id
          });

          if (like?.data?.error) {
            return false;
          }

          yield put({ type: 'updateState', payload: { liked: { content: [like?.data] } } });
        }

        yield put({ type: 'profileModel/updateState', payload: { viewed: {}, liked: {} } });
        yield put({ type: callbackType, payload: { force: true } });

      }
    },

    * unLike({ payload }, { put, call, select }) {
      const { ability, token } = yield select(state => state.authModel);

      const { data: { content } } = payload;

      if (content) {
        const likeKey = content[0]?.id;

        if (ability.can('unlike', COMPONENT_NAME)) {
          const like = yield call(apartmentUnLike, { token, likeKey });

          if (like?.data?.error) {
            return false;
          }

          yield put({ type: 'updateState', payload: { liked: null } });
        }
      }
    }
  },

  reducers: {}
});
