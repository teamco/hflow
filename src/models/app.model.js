/* global window */
/* global document */
/* global location */

/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

import { menus } from '@/services/menu.service';

import request from '@/utils/request';
import { getSiderPanel } from '@/utils/panel';

const appMeta = {
  name: '__TITLE__',
  charSet: 'utf-8'
};

const MODEL_NAME = 'appModel';

const DEFAULT_STATE = {
  dispatch: null,
  is404: false,
  interval: {
    timeout: 3 * 60 * 1000,
    enabled: true
  },
  layoutOpts: {
    mainHeader: false,
    pageBreadcrumbs: false,
    pageHeader: false,
    mainFooter: false,
    mainMenu: false
  },
  activeTab: true,
  collapsedMenu: true,
  meta: { ...appMeta, ...{ title: '' } },
  menus: [],
  activeForm: {
    form: null
  },
  activeModel: {
    isEdit: false,
    title: ''
  },
  waitBeforeLogin: 20000,
  siderPanels: {}
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

    setupHistory(setup) {
      const { dispatch, history } = setup;

      dispatch(
          { type: 'updateState', payload: { location: history.location } });

      history.listen(data => {
        // In case of route replace
        const location = data.pathname ? { ...data } : { ...data.location };

        dispatch({ type: 'updateState', payload: { location } });
        dispatch({ type: 'closeSiderPanel' });
      });
    },

    setup({ dispatch }) {
      dispatch({ type: 'query' });
    }
  },

  effects: {

    * query({ payload }, { put }) {
      yield put({ type: 'updateState', payload: { menus } });
      yield put({ type: 'adminLayout', payload: { visible: true } });
    },

    * adminLayout({ payload }, { put }) {
      const { visible } = payload;
      yield put({
        type: 'updateState',
        payload: {
          layoutOpts: {
            mainHeader: visible,
            pageBreadcrumbs: visible,
            pageHeader: visible,
            mainFooter: visible,
            mainMenu: visible
          }
        }
      });
    },

    * updateDocumentMeta({ payload }, { put, select }) {
      const { meta } = yield select(state => state[MODEL_NAME]);
      yield put({
        type: 'updateState',
        payload: { meta: { ...meta, ...payload.meta } }
      });
    },

    * toggleMenu({ payload }, { put }) {
      const { collapse, model } = payload;

      yield put({
        type: model ? `${model}/updateState` : 'updateState',
        payload: { collapsedMenu: collapse }
      });
    },

    * updateSiderPanel({ payload }, { put, select }) {
      const { siderPanels } = yield select(state => state.appModel);
      const { model } = payload;

      const { currentPanel, panel } = getSiderPanel(siderPanels, payload);

      const refModel = yield select(state => state[model]);
      const _panel = {
        ...panel,
        ...refModel.siderPanelConfig
      };

      if (currentPanel) {
        yield put({
          type: 'updateState',
          payload: {
            siderPanels: {
              ...siderPanels,
              currentPanel,
              [currentPanel]: { ..._panel }
            }
          }
        });
      }
    }
  },

  reducers: {
    update404(state, { payload }) {
      return { ...state, is404: payload?.is404 };
    },
    updateReferrer(state, { payload }) {
      return { ...state, referrer: payload?.referrer };
    },
    activeModel(state, { payload }) {
      return { ...state, activeModel: { ...payload } };
    },
    checkActiveTab(state, { payload }) {
      return { ...state, activeTab: payload };
    },
    handleMessageApi(state, { payload = {} }) {
      const { intl, messageApi } = payload;

      request.xhr.addMessageApi(messageApi, intl);
      return { ...state, messageApi, intl };
    }
  }
});
