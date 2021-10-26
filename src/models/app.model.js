/* global window */
/* global document */
/* global location */

/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import {commonModel} from 'models/common.model';
import {menus} from 'services/menu.service';

const appMeta = {
  name: '__TITLE__',
  charSet: 'utf-8'
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'appModel',
  state: {
    interval: {
      timeout: 60000,
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
    meta: {...appMeta, ...{title: ''}},
    menus: [],
    activeForm: {
      form: null
    },
    activeModel: {
      isEdit: false,
      title: ''
    }
  },
  subscriptions: {
    setupHistory(setup) {
      const {dispatch, history} = setup;

      history.listen(data => {
        // In case of route replace
        const location = data.pathname ? {...data} : {...data.location};

        dispatch({type: 'updateState', payload: {location}});
      });
    },
    setup({dispatch}) {
      dispatch({type: 'query'});
    }
  },
  effects: {

    * query({payload}, {put}) {
      yield put({type: 'updateState', payload: {menus}});
      yield put({type: 'adminLayout', payload: {visible: true}});
    },

    * adminLayout({payload}, {put}) {
      const {visible} = payload;
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

    * updateDocumentMeta({payload}, {put, select}) {
      const {meta} = yield select(state => state.appModel);
      yield put({
        type: 'updateState',
        payload: {
          meta: {...meta, ...payload.meta}
        }
      });
    },

    * updateReferrer({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {
          referrer: payload.referrer
        }
      });
    },

    * toggleMenu({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {
          collapsedMenu: payload.collapse
        }
      });
    },

    * activeModel({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {
          activeModel: {...payload}
        }
      });
    },

    * checkActiveTab({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {
          activeTab: payload
        }
      });
    },

    * notification(_, {call, put, select}) {
      console.log('Notification');

      yield put({type: 'notificationModel/getCount'});
    }
  },

  reducers: {}
});
