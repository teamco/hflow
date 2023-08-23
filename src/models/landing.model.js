import React from 'react';

/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { commonModel } from '@/models/common.model';
import { monitorHistory } from '@/utils/history';
import { apartmentsPreview } from '@/services/apartment.service';
import { findUser } from '@/services/user.service';
import { fbFindById, fbUpdate } from '@/services/firebase.service';

const MODEL_NAME = 'landingModel';

const DEFAULT_STATE = {
  data: {
    realEstate: {
      carousel: {
        cache: {},
        size: 3,
        totalPages: 0,
        currentPage: 0,
        left: false,
        right: true
      },
      trends: {}
    }
  },
  icon: 'data:image/png;base64,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',
  topUnder: 160,
  header: {
    title: 'Welcome Home',
    position: 'fixed'
  },
  locale: {
    current: 'en-US',
    list: ['en-US', 'he-IL']
  },

  // Time in seconds before Notification is closed.
  // When set to 0 or null, it will never be closed automatically
  refreshPageIn: 3 * 60
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
      dispatch({ type: 'query' });
    }
  },

  effects: {

    * query({ payload }, { call, put, select }) {
      // TODO (teamco): Write code here.
    },

    * changeLang({ payload }, { put, select }) {
      const { locale, setLocale } = payload;

      // TODO (teamco): Write code here.
    },

    * getContent({ payload }, { put }) {
      yield put({ type: 'getApartments', payload: { init: true } });
    },

    * getApartments({ payload = {} }, { call, put, select }) {
      const { data } = yield select(state => state[MODEL_NAME]);
      const { user, token, ability } = yield select(state => state.authModel);

      const { realEstate: { carousel, trends } } = data;

      const _direction = payload?.direction ?? 0;
      const _currentPage = carousel?.currentPage;
      const _nextPage = _currentPage + _direction;

      const { size = carousel?.size, page, init, force = false } = payload;

      if (user && ability.can('read', 'apartments')) {
        let _page = page ?? _nextPage;
        _page = _page < 0 ? 0 : _page;

        const _cache = carousel?.cache[_page];

        if ((_currentPage === _page && trends?.content?.length ||
            init && trends?.content?.length) && !force) {

          // TODO (teamco): Do nothing.
          return false;
        }

        let _trends = _cache,
            _carousel = {};

        if (_cache && !force) {

          // TODO (teamco): Do nothing.

        } else {

          const aPreview = yield call(apartmentsPreview,
              { token, size, page: _page });

          _trends = { ...aPreview.data };

          if (aPreview?.data?.error) {
            return false;
          }

          _carousel = {
            carousel: {
              ...carousel,
              cache: {
                ...carousel.cache,
                [_page]: _trends
              }
            }
          };
        }

        yield put({
          type: 'updateState',
          payload: {
            data: {
              ...data,
              realEstate: {
                ...data.realEstate,
                ..._carousel,
                trends: _trends
              }
            }
          }
        });

        yield put({
          type: 'rotateCarousel',
          payload: { list: _trends, currentPage: _page }
        });
      }
    },

    * rotateCarousel({ payload }, { put, select }) {
      const { data } = yield select(state => state[MODEL_NAME]);
      const { list, currentPage } = payload;

      const { totalPages } = list;

      yield put({
        type: 'updateState',
        payload: {

          data: {
            ...data,
            realEstate: {
              ...data.realEstate,
              carousel: {
                ...data.realEstate.carousel,
                totalPages,
                currentPage,
                left: currentPage > 0,
                right: totalPages - 1 > currentPage
              }
            }
          }
        }
      });
    },

    * refreshPage({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);

      const { selectedUser, paramsUser } = payload;
      let uid = paramsUser ? paramsUser : selectedUser.id;

      if (user && ability.can('manage', 'user.profile')) {
        const _user = yield call(fbFindById, {
          collectionPath: 'users',
          docName: uid
        });

        if (_user.exists()) {
          const metadata = {
            ..._user.data().metadata,
            refreshRoles: true,
            updatedAt: +(new Date)
          };

          yield call(fbUpdate, {
            caller: 'refreshPage',
            collectionPath: 'users',
            docName: uid,
            data: { metadata }
          });

        } else {

          yield put({
            type: 'notFound',
            payload: {
              entity: 'user.profile',
              key: 'refreshPage'
            }
          });
        }
      }
    }
  },

  reducers: {}
});
