import { connect } from '@umijs/max';

import { ProfileApartmentEdit } from '@/pages/landing/profile/apartments/[apartment]/profile.apartmentEdit';

import { onFieldsChangeHandler } from '@/services/common.service';

const MODEL_NAME = 'profileApartmentModel';

export default connect(
    ({
       authModel,
       profileModel,
       addressModel,
       profileApartmentModel,
       cloudinaryModel,
       loading
     }) => {
      return {
        authModel,
        profileModel,
        addressModel,
        profileApartmentModel,
        cloudinaryModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        onFieldsChangeHandler({
          changedFields,
          allFields,
          MODEL_NAME,
          dispatch
        });
      },
      onQuery() {
        dispatch({
          type: `profileModel/updateState`,
          payload: {
            isEdit: true,
            label: 'profile.public.apartments.setting'
          }
        });
      },
      onDirectionButton(props, assignedModel) {
        const {rNext, rPrev, rSave} = props;

        dispatch({
          type: `profileModel/updateActionBtns`,
          payload: {
            actionBtns: {
              assignedModel,
              save: {
                onClick: rSave.onClick,
                disabled: rSave.disabled,
                spinOn: [...(rSave.spinOn ?? [])]
              },
              navigation: {
                next: {
                  disabled: rNext.disabled,
                  title: rNext.title,
                  onClick: rNext.onClick,
                  spinOn: [...(rNext.spinOn ?? [])]
                },
                prev: {
                  disabled: rPrev.disabled,
                  direction: -1,
                  title: rPrev.title,
                  onClick: rPrev.onClick,
                  spinOn: [...(rPrev.spinOn ?? [])]
                }
              }
            }
          }
        });
      },
      onGetApartment(apartmentId) {
        dispatch({
          type: `${MODEL_NAME}/getApartment`,
          payload: { apartmentId }
        });
      },
      onSignature(folder) {
        dispatch({ type: `cloudinaryModel/cloudinarySignature`, payload: { folder } });
      },
      onFileChange(payload) {
        dispatch({ type: `${MODEL_NAME}/handleUploadFile`, payload });
      },
      onFileRemove(payload) {
        dispatch({
          type: `${MODEL_NAME}/handleRemoveFile`,
          payload: { ...payload, model: MODEL_NAME }
        });
      },
      onGetAllCountries() {
        dispatch({ type: `addressModel/getAllCountries` });
      },
      onGetCountryStates(country) {
        dispatch({ type: `addressModel/getCountryStates`, payload: { country } });
      },
      onGetStateCities(country, state) {
        dispatch({ type: `addressModel/getStateCities`, payload: { country, state } });
      },
      onUpdateSider(payload) {
        dispatch({ type: `appModel/updateSiderPanel`, payload: { ...payload, model: MODEL_NAME } });
      },
      onHandleScheduler(entityName, prefix, payload, isEdit) {
        dispatch({ type: `schedulerModel/handleScheduler`, payload: { ...payload, isEdit, entityName, prefix, model: MODEL_NAME } });
      },
      onDeleteScheduler(idx, prefix) {
        dispatch({ type: `schedulerModel/deleteScheduler`, payload: { idx, prefix, model: MODEL_NAME } });
      }
    })
)(ProfileApartmentEdit);
