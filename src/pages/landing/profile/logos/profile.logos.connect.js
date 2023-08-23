import { connect } from '@umijs/max';

import { ProfileLogos } from '@/pages/landing/profile/logos/profile.logos';

import { onFieldsChangeHandler } from '@/services/common.service';

const MODEL_NAME = 'profileLogoModel';

export default connect(
    ({ authModel, profileModel, profileLogoModel, loading }) => {
      return {
        authModel,
        profileModel,
        profileLogoModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        onFieldsChangeHandler({ changedFields, allFields, MODEL_NAME, dispatch });
      },
      onQuery() {
        dispatch({
          type: `profileModel/updateState`,
          payload: { label: 'profile.public.logos.setting' }
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
                spinOn: [
                  `${MODEL_NAME}/updateLogos`,
                  `${MODEL_NAME}/handleAddFile`,
                  `${MODEL_NAME}/handleRemoveFile`
                ]
              }
            }
          }
        });
      },
      onGetLogos() {
        dispatch({ type: `${MODEL_NAME}/getLogos` });
      },
      onSave(formValues, selected) {
        dispatch({ type: `${MODEL_NAME}/updateLogos`, payload: { formValues, selected } });
      },
      onFileChange(payload) {
        dispatch({
          type: `${MODEL_NAME}/handleAddFile`,
          payload: { ...payload, type: 'profileLogo', model: MODEL_NAME }
        });
      },
      onFileRemove(payload) {
        dispatch({
          type: `${MODEL_NAME}/handleRemoveFile`,
          payload: { ...payload, model: MODEL_NAME }
        });
      },
      onEdit(logo, unselect) {
        dispatch({ type: `${MODEL_NAME}/editLogo`, payload: { logo, unselect } });
      },
      onDelete(logo) {
        dispatch({ type: `${MODEL_NAME}/deleteLogo`, payload: { logo } });
      }
    })
)(ProfileLogos);
