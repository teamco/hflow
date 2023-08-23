import { connect } from '@umijs/max';

import { ProfileAddresses } from '@/pages/landing/profile/addresses/profile.addresses';

import { onFieldsChangeHandler } from '@/services/common.service';

const MODEL_NAME = 'profileAddressModel';

export default connect(
    ({ authModel, profileModel, profileAddressModel, loading }) => {
      return {
        authModel,
        profileModel,
        profileAddressModel,
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
          payload: { label: 'profile.public.address.setting' }
        });
      },

      onActionButtons(formRef, assignedModel) {
        dispatch({
          type: `profileModel/updateActionBtns`,
          payload: {
            actionBtns: {
              assignedModel,
              save: {
                onClick: () => formRef?.submit(),
                spinOn: [`${MODEL_NAME}/updateAddress`]
              }
            }
          }
        });
      },
      onGetAddresses() {
        dispatch({ type: `${MODEL_NAME}/getAddresses` });
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
      onSave(formValues, selected, initialValues) {
        dispatch({ type: `${MODEL_NAME}/updateAddress`, payload: { formValues, selected, initialValues } });
      },
      onEdit(address, unselect) {
        dispatch({ type: `${MODEL_NAME}/editAddress`, payload: { address, unselect } });
      },
      onDelete(address) {
        dispatch({ type: `${MODEL_NAME}/deleteAddress`, payload: { address } });
      }
    })
)(ProfileAddresses);
