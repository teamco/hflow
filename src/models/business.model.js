/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import {message} from 'antd';
import {commonModel} from 'models/common.model';
import {REMOTE_SERVER} from 'services/config/server.config';
import i18n from 'utils/i18n';
import moment from 'moment';
import {history} from 'umi';

/** @type {{getAllCountries, getCountry}} */
import ct from 'countries-and-timezones';

/** @type {array} */
import provinces from 'provinces';

import {
  isBusiness,
  sendAuthLink,
  sendVerificationEmail
} from 'services/user.service';

import {
  findBusinessTempUser, getAllBusinesses,
  getBusinessByRef,
  getBusinesses,
  getBusinessUsers
} from 'services/business.service';

import {detailsInfo} from 'services/cross.model.service';
import {fbAdd, fbFindById, fbUpdate, getRef} from 'services/firebase.service';
import {getExtension, toBase64, toFile} from 'utils/file';
import {monitorHistory} from 'utils/history';
import {errorSaveMsg} from 'utils/message';
import {setAs} from 'utils/object';

const DEFAULT_STATE = {
  availableCountries: ['US', 'CA', 'IL'], //'ALL'
  selectedCountry: null,
  selectedBusiness: null,
  data: [],
  users: [],
  assignedUsers: [],
  countries: [],
  states: [],
  businessUserRef: null
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'businessModel',
  state: {...DEFAULT_STATE},
  subscriptions: {
    setupHistory({history, dispatch}) {
      monitorHistory({history, dispatch}, 'businessModel');
    },
    setup({dispatch}) {
    }
  },

  effects: {

    * query({payload}, {put, call}) {
      const {selectedUser, userId} = payload;

      yield put({
        type: 'userModel/validateUser',
        payload: {selectedUser, userId}
      });

      let user = yield call(fbFindById, {
        collection: 'users',
        doc: userId
      });

      if (user.exists) {
        const _user = user.data();
        const businessUser = isBusiness(_user);
        let businesses = {data: []};

        if (businessUser) {
          businesses.data = yield call(getBusinessByRef, {businessRef: _user.business?.metadata?.businessRef});
        } else {
          businesses = yield call(getBusinesses, {userId: _user.id});
        }

        yield put({
          type: 'updateState',
          payload: {data: businesses.data}
        });
      }
    },

    * allBusinesses(_, {call, put}) {
      const businesses = yield call(getAllBusinesses);
    },

    * handleStates({payload}, {put}) {
      const states = provinces.filter(p => p.country === payload.country);
      yield put({type: 'updateState', payload: {states}});
    },

    * businessAddress(_, {select, put}) {
      const {availableCountries} = yield select(state => state.businessModel);
      let countries = [];

      if (availableCountries === 'ALL') {
        countries = Object.values(ct.getAllCountries());
      } else {
        countries = availableCountries.map(country => ct.getCountry(country));
      }

      yield put({type: 'updateState', payload: {countries}});

      yield put({
        type: 'toForm',
        payload: {
          form: {},
          model: 'businessModel'
        }
      });
    },

    * newBusiness({payload}, {put, select}) {
      const {selectedUser} = yield select(state => state.userModel);

      yield put({type: 'cleanForm'});
      yield put({type: 'businessServiceModel/query'});
      yield put({type: 'businessPreparationModel/query'});

      yield put({
        type: 'updateState',
        payload: {
          ...DEFAULT_STATE,
          ...{
            isEdit: false,
            tags: [],
            uploadedFiles: {}
          }
        }
      });

      history.push(`/admin/users/${selectedUser.id}/businesses/new`);
    },

    * validateBusiness({payload}, {call, put, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {businessId} = payload;

      if (businessId === 'new') {
        // Do nothing.
      } else if (ability.can('read', 'businesses')) {

        const business = yield call(fbFindById, {
          collection: 'businesses',
          doc: payload.businessId
        });

        if (business.exists) {
          const selectedBusiness = {...business.data(), ...{id: business.id}};
          const {license, logo} = selectedBusiness;

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

          const _business = {...selectedBusiness};
          _business.licenseExpiration = _business.licenseExpiration ?
              moment(_business.licenseExpiration) :
              null;

          // Phone preparation before loading.
          const phone = _business.phone.split('.');
          _business.phone = {
            code: phone[0],
            area: phone[1],
            number: phone[2],
            ext: phone[3]
          };

          _business.metadata = yield call(detailsInfo, {entity: _business, user});

          yield put({
            type: 'handleStates',
            payload: {country: _business.country}
          })

          yield put({
            type: 'toForm',
            payload: {
              model: 'businessModel',
              form: {..._business}
            }
          });

          return false;
        }

        yield put({
          type: 'raiseCondition',
          payload: {
            message: i18n.t('error:notFound', {entity: 'Business'}),
            key: 'selectedBusiness'
          }
        });
      }
    },

    * editBusiness({payload}, {put}) {
      const {params} = payload;
      const {business} = params;

      yield put({type: 'cleanForm'});

      yield put({
        type: 'validateBusiness',
        payload: {
          businessId: business,
          userId: params.user
        }
      });

      yield put({type: 'businessAddress'});
      yield put({type: 'updateState', payload: {isEdit: params.business !== 'new'}});
    },

    * prepareToSave({payload, params}, {call, select, put}) {
      const {user, ability} = yield select(state => state.authModel);
      const {uploadedFiles, selectedBusiness, isEdit} = yield select(state => state.businessModel);

      let entity;
      const logo = uploadedFiles.logo;
      const license = uploadedFiles.license;

      if (user && ability.can('update', 'businesses')) {
        const metadata = {
          updatedAt: +(new Date),
          updatedBy: user.uid
        };

        let data = {...payload, metadata};

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

        if (isEdit) {
          selectedBusiness && params.business === selectedBusiness.id ?
              yield call(fbUpdate, {collection: 'businesses', docId: selectedBusiness.id, data}) :
              errorSaveMsg(true, 'Business');

        } else {

          data = {
            ...data,
            metadata: {
              createdAt: metadata.updatedAt,
              createdBy: user.uid,
              belongsToRef: getRef({collection: 'users', doc: user.id}),
              ...metadata
            }
          };

          entity = yield call(fbAdd, {collection: 'businesses', data});

          if (entity?.docId) {

            history.push(`/admin/users/${user.id}/businesses/${entity.docId}`);
            yield put({type: 'updateState', payload: {isEdit: true}});

          } else {
            errorSaveMsg(false, 'Business');
          }
        }
      }
    },

    * sendRegisterLinkBusinessUser({payload}, {call, put, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {email, userRoles, business} = payload.data;

      if (user && ability.can('create', 'businessUsers')) {
        let _tempExist = yield call(findBusinessTempUser, {email});

        if (_tempExist.docId) {
          message.warning(i18n.t('error:userExist')).then();
          return false;
        }

        const data = {
          email,
          userRoles,
          metadata: {
            pending: true,
            creatorRef: getRef({collection: 'users', doc: user.id}),
            businessRef: getRef({collection: 'businesses', doc: business})
          }
        };

        _tempExist = yield call(fbAdd, {collection: 'tempBusinessUsers', data});

        if (_tempExist?.docId) {
          const {domain, port, protocol} = REMOTE_SERVER;

          yield call(sendAuthLink, {
            email,
            setting: {
              url: `${protocol}://${domain}:${port}`,
              userId: _tempExist.docId
            }
          });
        }
      }
    },

    * prepareRegistration({payload}, {call, put}) {
      const {user} = payload;

      if (user) {
        const userRef = yield call(fbFindById, {
          collection: 'tempBusinessUsers',
          doc: user
        });

        let _tempExist = userRef.data();

        if (_tempExist?.metadata?.pending) {
          const invitedBy = (yield call(fbFindById, {docRef: _tempExist.metadata.creatorRef})).data();
          const assignedTo = (yield call(fbFindById, {docRef: _tempExist.metadata.businessRef})).data();

          const data = {
            email: _tempExist.email,
            userRoles: _tempExist.userRoles,
            invitedByUser: invitedBy.displayName,
            assignedTo: assignedTo.name
          };

          yield put({
            type: 'updateState',
            payload: {businessUserRef: userRef}
          });

          yield put({
            type: 'toForm',
            payload: {
              model: 'businessModel',
              form: {...data}
            }
          });

        } else {
          yield call(message.warning, i18n.t('error:userAssigned'));
          history.push(`/errors/404`);
        }
      }
    },

    * finishRegistration({payload}, {call, put, select}) {
      const {businessUserRef} = yield select(state => state.businessModel);
      const {user} = payload;

      let _userExist = yield call(fbFindById, {
        collection: 'users',
        doc: user.docId
      });

      if (_userExist.id && businessUserRef) {

        let data = {...user.data};

        data.business = businessUserRef.data();
        data.business.metadata = {
          ...data.business.metadata,
          ...{assignedAt: +(new Date)}
        };

        yield call(fbUpdate, {
          collection: 'users',
          docId: user.docId,
          data: {...data, id: user.docId}
        });

        yield call(fbUpdate, {
          collection: 'tempBusinessUsers',
          docId: businessUserRef.id,
          data: {
            ...data.business,
            metadata: {
              ...data.business.metadata,
              pending: false
            }
          }
        });

        yield call(sendVerificationEmail, {user: _userExist});

        yield put({
          type: 'updateState',
          payload: {businessUserRef: null}
        });
      }
    },

    * usersQuery({payload}, {put, call}) {
      const businessRef = getRef({collection: 'businesses', doc: payload.business});
      const assignedUsers = yield call(getBusinessUsers, {businessRef});

      yield put({
        type: 'updateState',
        payload: {assignedUsers}
      });
    },

    * updateUserRole({payload}, {put, call}) {
      const {params, user, role} = payload;

      yield call(fbUpdate, {
        collection: 'users',
        docId: user.id,
        data: {
          business: {
            ...user.business,
            userRoles: role
          }
        }
      });

      yield put({
        type: 'usersQuery',
        payload: {business: params.business}
      });
    }
  },

  reducers: {}
});
