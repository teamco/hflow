/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from 'models/common.model';
import { isNew } from 'services/common.service';
import { detailsInfo } from 'services/cross.model.service';
import { fbFindById } from 'services/firebase.service';
import { history } from 'umi';

import i18n from 'utils/i18n';
import { monitorHistory } from 'utils/history';
import { errorSaveMsg } from 'utils/message';
import { addFeature, getAllPreferences, getFeature, updateFeature } from 'services/subscriptionsPrefs.service';
import { setAs } from 'utils/object';

const DEFAULT_STATE = {};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'subscriptionPrefsModel',
  state: {
    ...DEFAULT_STATE,
    data: [],
    preferenceTypes: [],
    currencies: ['USD']
  },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, 'subscriptionPrefsModel');
    },
    setup({ dispatch }) {
    }
  },
  effects: {

    * query({ payload }, { put, call }) {
      const { data = [] } = yield call(getAllPreferences);

      yield put({
        type: 'updateState',
        payload: { data }
      });
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

        const preference = yield call(getFeature, { id: preferenceId });

        if (preference.exists) {
          const selectedPreference = { ...preference.data };

          yield put({ type: 'updateState', payload: { selectedPreference } });

          const _preference = { ...selectedPreference };
          _preference.metadata = yield call(detailsInfo, { entity: _preference, user });

          return yield put({
            type: 'toForm',
            payload: {
              model: 'subscriptionPrefsModel',
              form: { ..._preference }
            }
          });
        }

        yield put({ type: 'notFound', payload: { entity: 'Preference', key: 'selectedPreference' } });
      }
    },

    * editPreference({ payload }, { put }) {
      const { params } = payload;
      const { preference } = params;

      yield put({ type: 'cleanForm', payload: { isEdit: !isNew(preference) } });
      yield put({ type: 'validatePreference', payload: { preferenceId: preference } });
      yield put({ type: 'preferenceTypes' });
    },

    * preferenceTypes(_, { call, put }) {
      const fbTypes = yield call(fbFindById, {
        collection: 'simpleEntities',
        doc: 'preferenceTypes'
      });

      let preferenceTypes = { tags: [] };

      if (fbTypes.exists) {
        preferenceTypes = fbTypes.data();
      }

      yield put({
        type: 'updateState',
        payload: { preferenceTypes: [...preferenceTypes?.tags] }
      });
    },

    * prepareToSave({ payload, params }, { call, select, put }) {
      const { user, ability } = yield select(state => state.authModel);
      const { selectedPreference, isEdit } = yield select(state => state.subscriptionPrefsModel);
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

      if (user && ability.can('update', 'subscriptionPrefs')) {

        const metadata = {
          ...selectedPreference?.metadata,
          updatedByRef: user.id
        };

        // Not mandatory/defined fields preparation before saving.
        const data = {
          id: selectedPreference.id,
          name: i18n.t(title),
          selectedByDefault,
          price, type, currency,
          translateKeys: {
            description: setAs(description, null),
            title, on, off
          },
          metadata
        };

        if (isEdit) {
          if (selectedPreference && params.preference === selectedPreference.id) {
            data.version = selectedPreference.version;
            const entity = yield call(updateFeature, { id: params.preference, data });

            yield put({
              type: 'isSaved',
              payload: {
                entity, isEdit,
                entityType: i18n.t('route:subscriptionPref'),
                * callback() {
                  yield put({ type: 'updateState', payload: { touched: false, isEdit: true } });
                }
              }
            });
          } else {
            errorSaveMsg(isEdit, i18n.t('route:subscriptionPref'));
          }

        } else {

          data.metadata = {
            ...metadata,
            createdAt: metadata.updatedAt,
            createdByRef: user.id
          };

          const entity = yield call(addFeature, { data });

          yield put({
            type: 'isSaved',
            payload: {
              entity, isEdit,
              entityType: i18n.t('route:subscriptionPref'),
              * callback() {
                yield put({ type: 'updateState', payload: { touched: false, isEdit: true } });
                history.push(`/admin/subscriptionPrefs/${entity?.data?.id}`);
              }
            }
          });
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'selectedPreference' } });
      }
    }
  },
  reducers: {}
});
