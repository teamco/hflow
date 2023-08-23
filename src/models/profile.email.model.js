/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

import { monitorHistory } from '@/utils/history';
import { setAs } from '@/utils/object';

import {
  storeProfileEmails,
  getProfileEmails,
} from '@/services/profile.service';

const MODEL_NAME = 'profileEmailModel';
const COMPONENT_NAME = 'profile.emails';

const DEFAULT_STATE = {
  multiplePrimaryEmails: false,
  sEmails: [],
  actionBtns: {}
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

    * getEmails({ payload = {} }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);

      const { resetButtons = true } = payload;

      yield put({ type: 'cleanForm', payload: { isEdit: false, actionBtns: {} } });

      if (ability.can('read', COMPONENT_NAME) && sUser?.profileByRef) {

        const { data } = yield call(getProfileEmails, {
          token,
          userKey: user?.id,
          profileKey: sUser?.profileByRef
        });

        if (data?.error) return false;

        yield put({ type: 'updateEmailState', payload: { data, resetButtons } });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'getEmails' } });
      }
    },

    * updateEmails({ payload }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);
      const { sEmails } = yield select(state => state[MODEL_NAME]);

      const { emails = [] } = payload;

      if (ability.can('update', COMPONENT_NAME)) {

        for (let formValues of emails) {

          const { mail, verified } = formValues;

          const includesEmail = sEmails.find(e => e.mail === mail);
          let info = {};
          let operation = 'Add';

          if (includesEmail) {
            operation = 'Update';
            info = {
              id: includesEmail.id,
              version: includesEmail.version
            };
          }

          const _verified = setAs(verified, !!includesEmail?.verified);
          const _primary = setAs(formValues.primary, !!includesEmail?.primary);
          const _private = setAs(formValues.private, !!includesEmail?.private);

          const data = [
            {
              operation,
              email: {
                mail,
                primary: _primary,
                verified: _verified,
                private: _private,
                ...info
              }
            }
          ];

          const entity = yield call(storeProfileEmails, {
            data,
            token,
            userKey: user.id,
            profileKey: sUser.profileByRef
          });

          if (entity?.data?.error) return false;

          yield put({ type: 'updateEmailState', payload: { data: entity?.data } });
        }

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'handleUpdate' } });
      }
    },

    * deleteEmail({ payload }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);

      const { sEmails } = yield select(state => state[MODEL_NAME]);
      const { email } = payload;

      if (ability.can('delete', COMPONENT_NAME)) {
        const includesEmail = sEmails.find(e => e.id === email?.id);

        if (includesEmail) {

          const data = [{ operation: 'Delete', email }];

          const entity = yield call(storeProfileEmails, {
            data,
            token,
            userKey: user.id,
            profileKey: sUser.profileByRef
          });

          if (entity?.data?.error) return false;

          yield put({ type: 'updateEmailState', payload: { data: entity?.data } });

        } else {

          yield put({ type: 'notFound', payload: { key: 'deleteEmail' } });
        }

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'deleteEmail' } });
      }
    },

    * setAsPrimary({ payload }, { put, select }) {
      const { ability } = yield select(state => state.authModel);
      const { sEmails, multiplePrimaryEmails } = yield select(state => state[MODEL_NAME]);
      const { primaries } = payload;

      if (ability.can('update', COMPONENT_NAME)) {
        if (multiplePrimaryEmails) {
          // TODO (teamco): Do something.
        } else {

          const emails = [];

          // Clean previous primaries
          const prevEmail = sEmails.find(email => email.primary && email.mail !== primaries[0]?.mail);
          if (prevEmail) {
            emails.push({ ...prevEmail, primary: false });
          }

          const email = sEmails.find(email => email.mail === primaries[0]?.mail);
          if (email) {
            emails.push({ ...email, primary: true });
            return !email.primary && (yield put({ type: 'updateEmails', payload: { emails } }));
          }

          yield put({ type: 'notFound', payload: { key: 'setAsPrimary' } });
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'setAsPrimary' } });
      }
    },

    * updateEmailState({ payload }, { put, select }) {
      const { user } = yield select(state => state.authModel);
      const { actionBtns } = yield select(state => state[MODEL_NAME]);

      const { resetButtons = true, data } = payload;

      const accountEmail = {
        mail: user.email,
        verified: user.emailVerified,
        private: true,
        primary: false,
        account: true
      };

      const _actionBtns = resetButtons ? {} : actionBtns;

      yield put({
        type: 'updateState',
        payload: {
          actionBtns: _actionBtns,
          sEmails: [
            accountEmail,
            ...data
          ]
        }
      });
    }

  },

  reducers: {}
});
