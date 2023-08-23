/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

import { monitorHistory } from '@/utils/history';

import {
  getProfileLinks,
  storeProfileLinks
} from '@/services/profile.service';

const MODEL_NAME = 'profileLinkModel';
const COMPONENT_NAME = 'profile.links';

const DEFAULT_STATE = {
  actionBtns: {},
  sLinks: []
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

    * getLinks({ payload = {} }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);

      const { model } = payload;

      yield put({ type: 'cleanForm' });

      if (ability.can('read', COMPONENT_NAME) && sUser?.profileByRef) {

        const { data } = yield call(getProfileLinks, {
          token,
          userKey: user?.id,
          profileKey: sUser?.profileByRef
        });

        if (data?.error) return false;

        yield put({
          type: `${model ? `${model}/` : ''}updateState`,
          payload: { sLinks: [...data] }
        });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'getAddresses' } });
      }
    },

    * updateLinks({ payload = {} }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);
      const { sLinks } = yield select(state => state[MODEL_NAME]);

      const { formValues, selected } = payload;

      const formLinks = { ...formValues };

      if (ability.can('create', COMPONENT_NAME)) {
        let info = {};
        let operation = 'Add';

        const includesLink = sLinks.find(e => e.id === selected?.id);

        if (includesLink) {
          operation = 'Update';
          info = {
            id: selected.id,
            version: selected.version
          };
        }

        const data = [
          {
            operation,
            link: {
              ...formLinks,
              ...info
            }
          }
        ];

        const entity = yield call(storeProfileLinks, {
          data,
          token,
          userKey: user.id,
          profileKey: sUser.profileByRef
        });

        if (entity?.data?.error) return false;

        yield put({ type: 'updateLinkState', payload: { data: entity?.data } });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'updateLinks' } });
      }
    },

    * editLink({ payload = {} }, { put, select }) {
      const { ability } = yield select(state => state.authModel);
      const { sLinks } = yield select(state => state[MODEL_NAME]);

      const { link, unselect = false } = payload;

      if (ability.can('update', COMPONENT_NAME)) {
        const includesLink = sLinks.find(e => e.id === link?.id);

        if (includesLink) {
          const data = {
            isEdit: includesLink && !unselect,
            touched: includesLink && !unselect
          };

          yield put({ type: 'updateState', payload: { ...data } });

        } else {

          yield put({ type: 'notFound', payload: { key: 'editLink' } });
        }

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'editLink' } });
      }
    },

    * deleteLink({ payload = {} }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);
      const { sLinks } = yield select(state => state[MODEL_NAME]);

      const { link } = payload;

      if (ability.can('delete', COMPONENT_NAME)) {
        const includesLink = sLinks.find(e => e.id === link?.id);

        if (includesLink) {

          const data = [{ operation: 'Delete', link }];

          const entity = yield call(storeProfileLinks, {
            data,
            token,
            userKey: user.id,
            profileKey: sUser.profileByRef
          });

          if (entity?.data?.error) return false;

          yield put({ type: 'updateState', payload: { sLinks: entity?.data } });

        } else {

          yield put({ type: 'notFound', payload: { key: 'deleteLink' } });
        }

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'deleteLink' } });
      }
    },

    * updateLinkState({ payload = {} }, { put, select }) {
      const { actionBtns } = yield select(state => state.profileModel);

      const { resetButtons = false, data } = payload;

      const _actionBtns = resetButtons ? {} : actionBtns;

      yield put({
        type: 'updateState',
        payload: {
          actionBtns: _actionBtns,
          sLinks: [...data],
          isEdit: false,
          touched: false
        }
      });
    }

  },

  reducers: {}
});
