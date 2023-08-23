/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

import { monitorHistory } from '@/utils/history';
import { setAs } from '@/utils/object';
import { getImageDimensions, toFile } from '@/utils/file';
import { normalize } from '@/utils/string';

import {
  getProfileLogos,
  storeProfileLogos,
} from '@/services/profile.service';

const MODEL_NAME = 'profileLogoModel';
const COMPONENT_NAME = 'profile.logos';

const DEFAULT_STATE = {
  actionBtns: {},
  sLogos: [],
  maxLogoDimensions: {
    width: 500,
    height: 500
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

    * getLogos({ payload }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);

      yield put({ type: 'cleanForm' });

      if (ability.can('read', COMPONENT_NAME) && sUser?.profileByRef) {

        const { data } = yield call(getProfileLogos, {
          token,
          userKey: user?.id,
          profileKey: sUser?.profileByRef
        });

        if (data?.error) return false;

        yield put({ type: 'updateState', payload: { sLogos: data, isEdit: false } });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'getLogos' } });
      }
    },

    * updateLogos({ payload }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);
      const { sLogos, uploadedFiles: { profileLogo } } = yield select(state => state[MODEL_NAME]);

      const { formValues: { logo }, selected } = payload;

      if (ability.can('update', COMPONENT_NAME)) {
        const includesLogos = sLogos.find(l => l.id === selected?.id);
        let operation = 'Add',
            dimensions,
            encodedBase64,
            filename,
            mimetype;

        const { fileList, fileName, previewUrl } = profileLogo;
        const file = fileList[0];

        if (file) {
          dimensions = yield call(getImageDimensions, { url: previewUrl });
          encodedBase64 = yield call(toFile, { file });
          mimetype = file.type;
          filename = normalize(fileName);
        }

        let info;

        if (includesLogos) {

          operation = 'Update';
          info = {
            id: includesLogos.id,
            version: includesLogos.version,
            dimensions: file ? dimensions : includesLogos.dimensions,
            url: file ? profileLogo?.previewUrl : includesLogos.url,
            encodedBase64: file ? encodedBase64 : includesLogos.encodedBase64,
            filename: file ? filename : includesLogos.filename,
            mimetype: file ? mimetype : includesLogos.mimetype
          };

        } else {

          info = {
            dimensions,
            url: profileLogo?.previewUrl,
            encodedBase64,
            filename,
            mimetype
          };
        }

        const _primary = setAs(logo.primary, !!includesLogos?.primary);

        const data = [
          {
            operation,
            logo: {
              title: logo.title,
              altText: logo.altText,
              description: logo.description,
              primary: _primary,
              ...info
            }
          }
        ];

        const entity = yield call(storeProfileLogos, {
          data,
          token,
          userKey: user.id,
          profileKey: sUser.profileByRef
        });

        if (entity?.data?.error) return false;

        yield put({ type: 'cleanForm' });
        yield put({
          type: 'updateState',
          payload: {
            sLogos: entity?.data,
            isEdit: false,
            touched: false
          }
        });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'handleUpdate' } });
      }
    },

    * editLogo({ payload }, { put, select }) {
      const { ability } = yield select(state => state.authModel);
      const { sLogos } = yield select(state => state[MODEL_NAME]);
      const { logo, unselect = false } = payload;

      if (ability.can('update', COMPONENT_NAME)) {
        const includesLogo = sLogos.find(e => e.id === logo?.id);

        if (includesLogo) {

          let uploadedFiles = {
            profileLogo: {
              previewUrl: logo.encodedBase64,
              fileName: logo.filename,
              fileList: []
            }
          };

          let data = {
            isEdit: true,
            touched: true,
            uploadedFiles
          };

          if (unselect) {
            data = {
              isEdit: false,
              touched: false,
              uploadedFiles: {}
            };
          }

          yield put({ type: 'updateState', payload: { ...data } });

          yield put({
            type: 'toForm',
            payload: {
              form: { profileLogo: uploadedFiles?.profileLogo || null },
              model: MODEL_NAME
            }
          });

        } else {

          yield put({ type: 'notFound', payload: { key: 'editLogo' } });
        }

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'editLogo' } });
      }
    },

    * deleteLogo({ payload }, { put, call, select }) {
      const { user, token, ability } = yield select(state => state.authModel);
      const { sUser } = yield select(state => state.profileModel);
      const { sLogos } = yield select(state => state[MODEL_NAME]);

      const { logo } = payload;

      if (ability.can('delete', COMPONENT_NAME)) {
        const includesLogo = sLogos.find(e => e.id === logo?.id);

        if (includesLogo) {

          const data = [{ operation: 'Delete', logo }];

          const entity = yield call(storeProfileLogos, {
            data,
            token,
            userKey: user.id,
            profileKey: sUser.profileByRef
          });

          if (entity?.data?.error) return false;

          yield put({ type: 'updateState', payload: { sLogos: entity?.data } });

        } else {

          yield put({ type: 'notFound', payload: { key: 'deleteLogo' } });
        }

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'deleteLogo' } });
      }
    }

  },

  reducers: {}
});
