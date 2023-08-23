/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import dayjs from 'dayjs';
import _ from 'lodash';

import { commonModel } from '@/models/common.model';

import { logger } from '@/utils/console';
import { nextDayOf } from '@/utils/timestamp';

import {
  adaptToFormSchedulerDates,
  adaptToSaveSchedulerDates,
  createSchedulers, getAllSchedulers,
  getSchedulersOf,
  updateSchedulers
} from '@/services/schedulers.service';

const MODEL_NAME = 'schedulerModel';

const DEFAULT_STATE = {
  entityFormDefaults: {
    duration: {
      type: 'Week',
      period: 1
    },
    repeat: {
      weekly: {
        days: ['Monday']
      },
      monthly: {
        type: 'Period',
        weekDay: 'First',
        monthDay: 1
      },
      yearly: {
        months: ['January']
      }
    },
    range: {
      startedAt: dayjs(nextDayOf(1)),
      endReason: {
        type: 'Date',
        expiredAt: dayjs(nextDayOf(1)).endOf('month'),
        occurrences: 1
      }
    }
  },
  assignedSchedulers: [],
  actionTypes: {
    create: 'create',
    update: 'update'
  }
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
    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },

  effects: {

    * query({ payload = {} }, { call, put, select }) {
      const { token } = yield select(state => state.authModel);
      const { size = 50, page = 0 } = payload;

      const { data = [] } = yield call(getAllSchedulers, { size, page, token });

      if (data.error) {
        // TODO (teamco): Do something.
      } else {
        yield put({ type: 'updateState', payload: { data } });
      }
    },

    * getSchedulersOf({ payload }, { call, put, select }) {
      const { token } = yield select(state => state.authModel);
      const { apiOf, keyOf, id } = payload;

      const { data = [] } = yield call(getSchedulersOf, { schedulersOf: { apiOf, keyOf, id }, token });

      if (data.error) {
        // TODO (teamco): Do something.
      } else {
        yield put({ type: 'updateState', payload: { assignedSchedulers: [...data] } });
      }
    },

    * distributeSchedulers({ payload }, { put, select }) {
      const { schedulers = [], schedulerType, model } = payload;

      const { assignedSchedulers } = yield select(state => state[MODEL_NAME]);
      const modelState = yield select(state => state[model]);

      const _schedulers = schedulers.map(schedulerRef => {
        return assignedSchedulers.find(scheduler => scheduler.id === schedulerRef);
      });

      yield put({
        type: `${model}/updateState`,
        payload: {
          schedulers: {
            ...modelState.schedulers,
            [schedulerType]: [...adaptToFormSchedulerDates(_schedulers)]
          }
        }
      });
    },

    * handleScheduler({ payload }, { put, select }) {
      const { actionTypes } = yield select(state => state[MODEL_NAME]);
      const { entityName, prefix, model, isEdit } = payload;

      const scheduler = { ...payload[prefix], action: payload[prefix].id ? actionTypes.update : actionTypes.create };

      const modelState = yield select(state => state[model]);
      const selectedEntity = modelState[entityName];

      let schedulers = { ...modelState.schedulers };
      let selectedSchedulers = [...(schedulers[prefix] || [])];

      if (typeof isEdit === 'number') {
        // Update
        schedulers = {
          ...schedulers,
          [prefix]: [
            ...selectedSchedulers.map((selected, idx) => idx === isEdit ? scheduler : selected)
          ]
        };
      } else {
        // Create
        schedulers = {
          ...schedulers,
          [prefix]: [
            ...selectedSchedulers,
            { ...scheduler, action: actionTypes.create }
          ]
        };
      }

      if (selectedEntity) {
        // TODO (teamco): Edit mode.
      }

      yield put({
        type: `${model}/updateState`,
        payload: {
          schedulers,
          touched: true
        }
      });
    },

    * deleteScheduler({ payload }, { put, select }) {
      const { idx, model, prefix } = payload;

      const modelState = yield select(state => state[model]);
      let schedulers = {};

      if (typeof idx === 'number') {
        schedulers = [...(modelState.schedulers[prefix] || [])].filter((_scheduler, key) => idx !== key);
      } else {
        return logger({ type: 'warn', log: 'Unable to find scheduler to delete.' });
      }

      yield put({
        type: `${model}/updateState`,
        payload: {
          schedulers: {
            ...modelState.schedulers,
            [prefix]: schedulers
          },
          touched: true
        }
      });
    },

    * saveScheduler({ payload }, { call, put, select }) {
      const { actionTypes } = yield select(state => state[MODEL_NAME]);
      const { user, ability, token } = yield select(state => state.authModel);

      const { assignedSchedulers = [], COMPONENT_NAME, model, schedulerType } = payload;

      const { schedulers = {} } = yield select(state => state[model]);

      const _schedulers = adaptToSaveSchedulerDates(assignedSchedulers);

      const _toSave = _schedulers.filter(scheduler => scheduler.action === actionTypes.create);
      const _toUpdate = _schedulers.filter(scheduler => scheduler.action === actionTypes.update);
      const _restOfSchedulers = _schedulers.filter(
          scheduler =>
              scheduler.action !== actionTypes.update &&
              scheduler.action !== actionTypes.create);

      if (user && ability.can('update', `${COMPONENT_NAME}.${schedulerType}`)) {
        const savedRes = _toSave.length ? (yield call(createSchedulers, { data: _toSave, token })) : { data: [] };
        const updatedRes = _toUpdate.length ? (yield call(updateSchedulers, { data: _toUpdate, token })) : { data: [] };

        if (savedRes?.data?.error || updatedRes?.data?.error) return false;

        const combined = _.values(_.merge(
            _.keyBy(_restOfSchedulers, 'id'),
            _.keyBy(savedRes.data, 'id'),
            _.keyBy(updatedRes.data, 'id')
        ));

        yield put({
          type: `${model}/updateState`,
          payload: {
            touched: true,
            schedulers: {
              ...schedulers,
              [schedulerType]: [...adaptToFormSchedulerDates(combined)]
            }
          }
        });

      } else {

        yield put({ type: 'noPermissions', payload: { key: 'saveScheduler' } });
      }
    }
  },

  reducers: {}
});
