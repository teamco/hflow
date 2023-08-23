/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import dayjs from 'dayjs';
import { history } from '@umijs/max';

import { commonModel } from '@/models/common.model';
import { REMOTE_SERVER } from '@/services/config/server.config';

/** @type {{getAllCountries, getCountry}} */
import ct from 'countries-and-timezones';

/** @type {array} */
import provinces from 'provinces';

import { sendAuthLink, sendVerificationEmail } from '@/services/user.service';

import {
  findBusinessTempUser,
  getAllBusinesses,
  getBusinessByRef,
  getBusinesses,
  getBusinessUsers,
  getTempBusinessUsers
} from '@/services/business.service';

import { toFile } from '@/utils/file';
import { monitorHistory } from '@/utils/history';
import { errorSaveMsg } from '@/utils/message';
import { setAs } from '@/utils/object';

import { detailsInfo } from '@/services/cross.model.service';
import { fbAdd, fbDelete, fbFindById, fbUpdate, getRef } from '@/services/firebase.service';
import { isAdmin } from '@/services/userRoles.service';
import { isNew } from '@/services/common.service';
import { t } from '@/utils/i18n';

const DEFAULT_STATE = {
  availableCountries: ['US', 'CA', 'IL'], //'ALL'
  selectedCountry: null,
  selectedBusiness: null,
  users: [],
  assignedUsers: [],
  countries: [],
  states: [],
  businessUserRef: null
};

const MODEL_NAME = 'businessModel';
const COMPONENT_NAME = 'businesses';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: MODEL_NAME,
  state: { ...DEFAULT_STATE, data: [] },
  subscriptions: {
    setupHistory({ history, dispatch }) {
      monitorHistory({ history, dispatch }, MODEL_NAME);
    },
    setup({ dispatch }) {
      // TODO (teamco): Do something.
    }
  },

  effects: {

    * query({ payload }, { put, call, select }) {
      let { user, ability } = yield select(state => state.authModel);
      const { userId = user?.id } = payload;

      if (ability.can('read', 'profile') && ability.can('read', COMPONENT_NAME)) {
        if (userId === user?.id) {
          // TODO (teamco): Do nothing.
        } else {
          const _user = yield call(fbFindById, { collectionPath: 'users', docName: userId });
          if (_user.exists()) {
            user = _user.data();
          } else {

            return yield put({ type: 'notFound', payload: { entity: 'User', key: 'selectedUser' } });
          }
        }

        // TODO (teamco): Fix business user.
        const businessUser = false;//isBusiness(_user);
        let businesses = { data: [] };

        if (businessUser) {
          businesses.data = yield call(getBusinessByRef, { businessRef: user.business?.metadata?.businessRef });
        } else {
          businesses = yield call(getBusinesses, { userId: user.id });
        }

        yield put({
          type: 'updateState',
          payload: { data: businesses.data }
        });
      }
    },

    * allBusinesses(_, { call, put }) {
      const businesses = yield call(getAllBusinesses);
    },

    * handleStates({ payload }, { put }) {
      const states = provinces.filter(p => p.country === payload.country);
      yield put({ type: 'updateState', payload: { states } });
    },

    * businessAddress(_, { select, put }) {
      const { availableCountries } = yield select(state => state[MODEL_NAME]);
      let countries = [];

      if (availableCountries === 'ALL') {
        countries = Object.values(ct.getAllCountries());
      } else {
        countries = availableCountries.map(country => ct.getCountry(country));
      }

      yield put({ type: 'updateState', payload: { countries } });

      yield put({
        type: 'toForm',
        payload: {
          form: {},
          model: MODEL_NAME
        }
      });
    },

    * newBusiness({ payload }, { put, select }) {
      const { selectedUser } = yield select(state => state.userModel);

      yield put({
        type: 'handleNew',
        payload: {
          component: COMPONENT_NAME,
          BASE_URL: `/admin/users/${selectedUser.id}/businesses/new`,
          state: DEFAULT_STATE,
          selected: 'selectedBusiness'
        }
      });
    },

    * validateBusiness({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { selectedUser } = yield select(state => state.userModel);
      const { businessId } = payload;

      if (isNew(businessId)) {
        yield put({ type: 'newBusiness' });
        // TODO (teamco): Do something.

      } else if (ability.can('read', COMPONENT_NAME)) {
        const business = yield call(fbFindById, {
          collectionPath: 'businesses',
          docName: businessId
        });

        if (business.exists() && selectedUser) {
          const selectedBusiness = { ...business.data(), ...{ id: business.id } };
          const { license, logo } = selectedBusiness;

          history.push(`/admin/users/${selectedUser?.id}/businesses/${business?.id}`);

          yield put({
            type: 'updateState',
            payload: {
              selectedBusiness,
              uploadedFiles: {
                license: {
                  previewUrl: license,
                  fileList: [],
                  fileName: `license`
                },
                logo: {
                  previewUrl: logo,
                  fileList: [],
                  fileName: `logo`
                }
              }
            }
          });

          const _business = { ...selectedBusiness };
          _business.licenseExpiration = _business.licenseExpiration ?
              dayjs(_business.licenseExpiration) :
              null;

          // Phone preparation before loading.
          const phone = _business.phone.split('.');
          _business.phone = {
            code: phone[0],
            area: phone[1],
            number: phone[2],
            ext: phone[3]
          };

          _business.metadata = yield call(detailsInfo, { entity: _business, user });

          yield put({ type: 'handleStates', payload: { country: _business.country } });
          yield put({ type: 'updateTags', payload: { tags: _business.tags, touched: false } });

          return yield put({
            type: 'toForm',
            payload: {
              model: MODEL_NAME,
              form: { ..._business }
            }
          });
        }

        yield put({ type: 'notFound', payload: { entity: 'Business', key: 'selectedBusiness' } });
      }
    },

    * editBusiness({ payload }, { put, select, take }) {
      const { selectedUser } = yield select(state => state.userModel);

      const { params, isEdit } = payload;
      const { business, user } = params;

      yield put({
        type: 'userModel/validateUser',
        payload: { selectedUser, userId: user }
      });

      yield take('userModel/getUser/@@end');

      yield put({ type: 'cleanForm', payload: { isEdit: typeof isEdit === 'undefined' ? !isNew(business) : isEdit } });
      yield put({ type: 'validateBusiness', payload: { businessId: business } });

      yield put({ type: 'businessAddress' });
      yield put({ type: 'getSimpleEntity', payload: { docName: 'businessTypes' } });
    },

    * prepareToSave({ payload, params }, { call, select, put }) {
      const { user, ability } = yield select(state => state.authModel);
      const { uploadedFiles, selectedBusiness, isEdit } = yield select(state => state[MODEL_NAME]);
      const { selectedUser } = yield select(state => state.userModel);

      const logo = uploadedFiles.logo;
      const license = uploadedFiles.license;

      const manageByAdmin = isAdmin(user.roles);

      if (selectedUser.roles.includes('Owner')) {
        // Do nothing.
      } else {

        // Create owner role.
        yield put({
          type: 'userModel/updateRoles',
          payload: {
            selectedUser,
            roles: [...selectedUser.roles, 'Owner']
          }
        });
      }

      if (user && ability.can('update', COMPONENT_NAME)) {

        const userRef = getRef({
          collectionPath: 'users',
          document: manageByAdmin ? selectedUser.id : user.id
        });

        const metadata = {
          ...selectedBusiness?.metadata,
          updatedAt: +(new Date),
          updatedByRef: userRef
        };

        let data = { ...payload, metadata };

        // Phone preparation before saving.
        const ext = data.phone.ext ? `.${data.phone.ext}` : '';
        data.phone = `${data.phone.code}.${data.phone.area}.${data.phone.number}${ext}`;

        data.license = yield call(toFile, {
          entity: selectedBusiness,
          file: license?.fileList[0],
          type: 'license',
          isEdit
        });

        data.logo = yield call(toFile, {
          entity: selectedBusiness,
          file: logo?.fileList[0],
          type: 'logo',
          isEdit
        });

        // Not mandatory fields preparation before saving.
        data.description = setAs(data.description);
        data.website = setAs(data.website);
        data.tags = setAs(data.tags, []);
        data.delivery = setAs(data.delivery, false);

        data.logo = setAs(data.logo);
        data.license = setAs(data.license);

        data.licenseExpiration = setAs(data?.licenseExpiration?.format('YYYY-MM-DD'));

        yield put({ type: 'handleUpdate', payload: { data, isEdit, selectedBusiness, id: params.business } });
        yield put({ type: 'handleSave', payload: { isEdit, metadata, data, userRef, manageByAdmin, selectedUser } });
      }
    },

    * handleUpdate({ payload }, { put, call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { isEdit, selectedBusiness, id, data } = payload;

      if (user && ability.can('update', COMPONENT_NAME)) {
        if (isEdit) {
          if (selectedBusiness && id === selectedBusiness.id) {
            yield call(fbUpdate, {
              caller: 'handleUpdate',
              collectionPath: 'businesses',
              docName: selectedBusiness.id,
              data
            });
            yield put({ type: 'updateState', payload: { touched: false } });
          } else {
            errorSaveMsg(true, 'selectedBusiness').then();
          }
        } else {
          // TODO (teamco): Going to save.
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'handleUpdate' } });
      }
    },

    * handleSave({ payload }, { put, call, select }) {
      const { user, ability } = yield select(state => state.authModel);
      let { isEdit, metadata, data, userRef } = payload;

      if (user && ability.can('update', COMPONENT_NAME)) {
        if (isEdit) {
          // TODO (teamco): Going to update.
        } else {

          data = {
            ...data,
            metadata: {
              ...metadata,
              createdAt: metadata.updatedAt,
              createdByRef: userRef,
              belongsToRef: userRef
            }
          };

          const entity = yield call(fbAdd, { collectionPath: 'businesses', data });

          if (entity?.docId) {

            yield put({ type: 'updateState', payload: { touched: false, isEdit: true } });
            yield put({ type: 'editBusiness', payload: { params: { business: entity?.data?.id, isEdit: true } } });

          } else {
            errorSaveMsg(false, 'Business').then();
          }
        }
      } else {

        yield put({ type: 'noPermissions', payload: { key: 'handleSave' } });
      }
    },

    * sendRegisterLink({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { domain, port, protocol } = REMOTE_SERVER;
      const { data, intl, isResend = false } = payload;
      const { email, userId } = data;

      if (userId) {
        const ts = +(new Date);

        if (isResend) {

          // Update user
          yield call(fbUpdate, {
            caller: 'sendRegisterLink',
            collectionPath: 'tempBusinessUsers',
            docName: userId,
            data: { 'metadata.invitedAt': ts }
          });
        }

        yield put({
          type: 'notificationModel/createAndUpdate',
          payload: {
            type: t(intl, 'notifications.invitation'),
            title: isResend ?
                t(intl, 'notifications.reSentInvitation') :
                t(intl, 'notifications.sentInvitation'),
            description: t(intl, 'error.na'),
            status: 'status.pending',
            isPrivate: true,
            sentTo: email
          }
        });

        yield call(sendAuthLink, {
          email,
          setting: {
            url: `${protocol}://${domain}:${port}`,
            userId
          }
        });
      }
    },

    * sendRegisterLinkBusinessUser({ payload }, { call, put, select }) {
      const { user, ability } = yield select(state => state.authModel);
      const { email, userRoles, business } = payload.data;

      if (user && ability.can('create', 'businessUsers')) {
        let _tempExist = yield call(findBusinessTempUser, { email });

        if (_tempExist.docId) {
          return console.warn(t(payload.intl, 'error.userExist'));
          // return yield call(message.warning, t(payload.intl, 'error.userExist'));
        }

        const data = {
          email,
          roles: userRoles,
          metadata: {
            pending: true,
            invitedAt: +(new Date),
            creatorRef: getRef({ collectionPath: 'users', document: user.id }),
            businessRef: getRef({ collectionPath: 'businesses', document: business })
          }
        };

        _tempExist = yield call(fbAdd, { collectionPath: 'tempBusinessUsers', data });

        if (_tempExist?.docId) {
          yield put({ type: 'sendRegisterLink', payload: { email, userId: _tempExist.docId } });
        }
      }
    },

    * prepareRegistration({ payload }, { call, put }) {
      const { user, intl } = payload;

      if (user) {
        const userRef = yield call(fbFindById, {
          collectionPath: 'tempBusinessUsers',
          docName: user
        });

        let _tempExist = userRef.data();

        if (_tempExist?.metadata?.pending) {
          const invitedBy = (yield call(fbFindById, { docRef: _tempExist.metadata.creatorRef })).data();
          const assignedTo = (yield call(fbFindById, { docRef: _tempExist.metadata.businessRef })).data();

          const data = {
            email: _tempExist.email,
            userRoles: _tempExist.userRoles,
            invitedByUser: invitedBy.displayName,
            assignedTo: assignedTo.name
          };

          yield put({
            type: 'updateState',
            payload: { businessUserRef: userRef }
          });

          yield put({
            type: 'toForm',
            payload: {
              model: MODEL_NAME,
              form: { ...data }
            }
          });

        } else {

          console.warn(t(payload.intl, 'error.userAssigned'));
          // yield call(message.warning, t(intl, 'error.userAssigned'));

          history.push(`/errors/404`);
        }
      }
    },

    * finishRegistration({ payload }, { call, put, select }) {
      const { businessUserRef } = yield select(state => state[MODEL_NAME]);
      const { _userExist } = payload;

      if (_userExist.docId && businessUserRef) {

        let data = { ..._userExist.data };

        data.business = businessUserRef.data();
        const { metadata } = data.business;

        data.business = {
          metadata: {
            ...metadata,
            ...{ assignedAt: +(new Date) }
          }
        };

        data.metadata.pending = false;

        // TODO (teamco): Need fetch roles from API and apply them to App.
        data.roles = ['Business User'];

        yield call(fbUpdate, {
          caller: 'finishRegistration',
          collectionPath: 'users',
          docName: _userExist.docId,
          data: { ...data, id: _userExist.docId }
        });

        yield call(fbDelete, {
          collectionPath: 'tempBusinessUsers',
          docName: businessUserRef.id
        });

        yield call(sendVerificationEmail, { user: _userExist.data() });

        yield put({
          type: 'updateState',
          payload: { businessUserRef: null }
        });
      }
    },

    * usersQuery({ payload }, { put, call }) {
      const businessRef = getRef({ collectionPath: 'businesses', document: payload.business });
      const assignedUsers = yield call(getBusinessUsers, { businessRef });
      const tempUsers = yield  call(getTempBusinessUsers, { businessRef });

      yield put({
        type: 'updateState',
        payload: { assignedUsers: [...assignedUsers, ...tempUsers] }
      });
    },

    * updateUserRole({ payload }, { put, call }) {
      const { params, user, role } = payload;

      yield call(fbUpdate, {
        caller: 'updateUserRole',
        collectionPath: 'users',
        docName: user.id,
        data: {
          business: {
            ...user.business,
            userRoles: role
          }
        }
      });

      yield put({
        type: 'usersQuery',
        payload: { business: params.business }
      });
    }
  },

  reducers: {}
});
