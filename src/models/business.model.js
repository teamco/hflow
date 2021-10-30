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
  sendAuthLink,
  sendVerificationEmail
} from 'services/user.service';

import {
  findBusinessTempUser,
  getAllBusinesses,
  getBusinessByRef,
  getBusinesses,
  getBusinessUsers,
  getTempBusinessUsers
} from 'services/business.service';

import {toFile} from 'utils/file';
import {monitorHistory} from 'utils/history';
import {errorSaveMsg, STATUS} from 'utils/message';
import {setAs} from 'utils/object';

import {detailsInfo} from 'services/cross.model.service';
import {fbAdd, fbFindById, fbUpdate, getRef} from 'services/firebase.service';
import {isAdmin} from 'services/userRoles.service';
import {isNew} from 'services/common.service';

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

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'businessModel',
  state: {...DEFAULT_STATE, data: []},
  subscriptions: {
    setupHistory({history, dispatch}) {
      monitorHistory({history, dispatch}, 'businessModel');
    },
    setup({dispatch}) {
    }
  },

  effects: {

    * query({payload}, {put, call, select}) {
      const {ability} = yield select(state => state.authModel);
      const {selectedUser, userId} = payload;

      if (ability.can('read', 'profile')) {
        const user = yield call(fbFindById, {
          collection: 'users',
          doc: userId
        });

        if (user.exists && ability.can('read', 'businesses')) {
          const _user = user.data();

          // TODO (teamco): Fix business user.
          const businessUser = false;//isBusiness(_user);
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

      history.push(`/admin/users/${selectedUser.id}/businesses/new`);

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

    * validateBusiness({payload}, {call, put, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {selectedUser} = yield select(state => state.userModel);
      const {businessId, userId} = payload;

      yield put({
        type: 'userModel/validateUser',
        payload: {selectedUser, userId}
      });

      if (isNew(businessId)) {
        // TODO (teamco): Do something.
      } else if (ability.can('read', 'businesses')) {

        const business = yield call(fbFindById, {
          collection: 'businesses',
          doc: businessId
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
          });

          return yield put({
            type: 'toForm',
            payload: {
              model: 'businessModel',
              form: {..._business}
            }
          });
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
      yield put({type: 'businessTypes'});
      yield put({type: 'updateState', payload: {isEdit: params.business !== 'new'}});
    },

    * businessTypes(_, {call, put}) {
      const fbTypes = yield call(fbFindById, {
        collection: 'businessConfig',
        doc: 'types'
      });

      let businessTypes = {types: []};

      if (fbTypes.exists) {
        businessTypes = fbTypes.data();
      }

      yield put({
        type: 'updateState',
        payload: {businessTypes: [...businessTypes?.types]}
      });
    },

    * prepareToSave({payload, params}, {call, select, put}) {
      const {user, ability} = yield select(state => state.authModel);
      const {uploadedFiles, selectedBusiness, isEdit} = yield select(state => state.businessModel);
      const {selectedUser} = yield select(state => state.userModel);

      let entity;
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

      if (user && ability.can('update', 'businesses')) {
        const metadata = {
          ...selectedBusiness.metadata,
          updatedAt: +(new Date),
          updatedBy: manageByAdmin ? selectedUser.uid : user.uid
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
              yield call(fbUpdate, {collection: 'businesses', doc: selectedBusiness.id, data}) :
              errorSaveMsg(true, 'Business');

          yield put({type: 'updateState', payload: {touched: false}});

        } else {

          data = {
            ...data,
            metadata: {
              ...metadata,
              createdAt: metadata.updatedAt,
              createdBy: manageByAdmin ? selectedUser.uid : user.uid,
              belongsToRef: getRef({
                collection: 'users',
                doc: manageByAdmin ? selectedUser.id : user.id
              })
            }
          };

          entity = yield call(fbAdd, {collection: 'businesses', data});

          if (entity?.docId) {

            yield put({
              type: 'updateState',
              payload: {
                touched: false,
                isEdit: true
              }
            });

            history.push(`/admin/users/${manageByAdmin ? selectedUser.id : user.id}/businesses/${entity.docId}`);

          } else {
            errorSaveMsg(false, 'Business');
          }
        }
      }
    },

    * sendRegisterLink({payload}, {call, put, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {domain, port, protocol} = REMOTE_SERVER;
      const {data, isResend = false} = payload;
      const {email, userId} = data;

      if (userId) {
        const ts = +(new Date);

        if (isResend) {

          // Update user
          yield call(fbUpdate, {
            collection: 'tempBusinessUsers',
            doc: userId,
            data: {'metadata.invitedAt': ts}
          });
        }

        yield put({
          type: 'notificationModel/createAndUpdate',
          payload: {
            type: i18n.t('notifications:invitation'),
            title: isResend ?
                i18n.t('notifications:reSentInvitation') :
                i18n.t('notifications:sentInvitation'),
            description: i18n.t('error:na'),
            status: STATUS.pending,
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

    * sendRegisterLinkBusinessUser({payload}, {call, put, select}) {
      const {user, ability} = yield select(state => state.authModel);
      const {email, userRoles, business} = payload.data;

      if (user && ability.can('create', 'businessUsers')) {
        let _tempExist = yield call(findBusinessTempUser, {email});

        if (_tempExist.docId) {
          return yield call(message.warning, i18n.t('error:userExist'));
        }

        const data = {
          email,
          userRoles,
          metadata: {
            pending: true,
            invitedAt: +(new Date),
            creatorRef: getRef({collection: 'users', doc: user.id}),
            businessRef: getRef({collection: 'businesses', doc: business})
          }
        };

        _tempExist = yield call(fbAdd, {collection: 'tempBusinessUsers', data});

        if (_tempExist?.docId) {
          yield put({type: 'sendRegisterLink', payload: {email, userId: _tempExist.docId}});
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
        data.business.userLogsMetadata = {
          ...data.business.metadata,
          ...{assignedAt: +(new Date)}
        };

        yield call(fbUpdate, {
          collection: 'users',
          doc: user.docId,
          data: {...data, id: user.docId}
        });

        yield call(fbUpdate, {
          collection: 'tempBusinessUsers',
          doc: businessUserRef.id,
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
      const tempUsers = yield  call(getTempBusinessUsers, {businessRef});

      yield put({
        type: 'updateState',
        payload: {assignedUsers: [...assignedUsers, ...tempUsers]}
      });
    },

    * updateUserRole({payload}, {put, call}) {
      const {params, user, role} = payload;

      yield call(fbUpdate, {
        collection: 'users',
        doc: user.id,
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
