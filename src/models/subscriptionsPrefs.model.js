/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { isNew } from 'services/common.service';
import { detailsInfo } from 'services/cross.model.service';
import { fbAdd, fbFindById, fbUpdate, getRef } from 'services/firebase.service';
import { history } from 'umi';

import { monitorHistory } from 'utils/history';
import i18n from 'utils/i18n';
import { errorSaveMsg } from 'utils/message';
import { setAs } from 'utils/object';

const DEFAULT_STATE = {
  
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'subscriptionPrefsModel',
  state: {
    ...DEFAULT_STATE
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, 'subscriptionPrefsModel');
    },
    setup({ dispatch }) {
    }
  },
  effects: {

    * query({ payload }, { put, call, select }) {
      
    },

    * newPreference({ payload }, { put }) {
      yield put({ type: 'cleanForm' });

      history.push(`/admin/subscriptionPrefs/new`);

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

    * validatePreference({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { preferenceId } = payload;

      if (isNew(preferenceId)) {
        // TODO (teamco): Do something.
      } else if (ability.can('read', 'subscriptionPrefs')) {

        const subscription = yield call(fbFindById, {
          collection: 'subscriptionPrefs',
          doc: preferenceId
        });

        if (subscription.exists) {
          const selectedPreference = { ...subscription.data(), ...{ id: subscription.id } };

          yield put({ type: 'updateState', payload: { selectedPreference } });

          const _subscription = { ...selectedPreference };
          _subscription.metadata = yield call(detailsInfo, { entity: _subscription, user });

          return yield put({
            type: 'toForm',
            payload: {
              model: 'subscriptionModel',
              form: { ..._subscription }
            }
          });
        }

        yield put({
          type: 'raiseCondition',
          payload: {
            message: i18n.t('error:notFound', { entity: 'Preference' }),
            key: 'selectedPreference'
          }
        });
      }
    },

    * editPreference({ payload }, { put }) {
      const { params } = payload;
      const { subscription } = params;

      yield put({ type: 'cleanForm', payload: { isEdit: !isNew(subscription) } });
      yield put({ type: 'validatePreference', payload: { preferenceId: subscription } });
    },

    * prepareToSave({ payload, params }, { call, select, put }) {
      const { user, ability } = yield select(state => state.authModel);
      const { selectedPreference, isEdit } = yield select(state => state.subscriptionModel);

      if (user && ability.can('update', 'subscriptionPrefs')) {

        const userRef = getRef({
          collection: 'users',
          doc: user.id
        });

        const metadata = {
          ...selectedPreference?.metadata,
          updatedAt: +(new Date),
          updatedByRef: userRef
        };

        let data = { ...payload, metadata };

        // Not mandatory/defined fields preparation before saving.
        data.analytics = setAs(data.analytics, false);
        data.logoOnPartnersPage = setAs(data.logoOnPartnersPage, false);
        data.profile = setAs(data.profile, false);
        data.requestList = setAs(data.requestList, false);
        data.tags = setAs(data.tags, []);

        if (isEdit) {
          selectedPreference && params.subscription === selectedPreference.id ?
              yield call(fbUpdate, { collection: 'subscriptionPrefs', doc: selectedPreference.id, data }) :
              errorSaveMsg(true, 'Preference');

          yield put({ type: 'updateState', payload: { touched: false } });

        } else {

          data = {
            ...data,
            metadata: {
              ...metadata,
              createdAt: metadata.updatedAt,
              createdByRef: userRef
            }
          };

          const entity = yield call(fbAdd, { collection: 'subscriptionPrefs', data });

          if (entity?.docId) {
            yield put({
              type: 'updateState',
              payload: {
                touched: false,
                isEdit: true
              }
            });

            history.push(`/admin/subscriptionPrefs/${entity.docId}`);
          }
        }
      } else {

        yield put({
          type: 'raiseCondition',
          payload: {
            type: 403,
            message: i18n.t('error:noPermissions'),
            key: 'selectedPreference'
          }
        });
      }
    }
  },
  reducers: {}
});
