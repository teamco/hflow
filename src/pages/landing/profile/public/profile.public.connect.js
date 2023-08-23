import { connect } from '@umijs/max';

import { ProfilePublic } from '@/pages/landing/profile/public/profile.public';

import { onFieldsChangeHandler } from '@/services/common.service';

const MODEL_NAME = 'profileModel';

export default connect(
    ({ authModel, profileModel, loading }) => {
      return {
        authModel,
        profileModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        onFieldsChangeHandler({ changedFields, allFields, MODEL_NAME, dispatch });
      },
      onQuery(formRef) {
        dispatch({
          type: `${MODEL_NAME}/updateState`,
          payload: { label: 'profile.public' }
        });

        dispatch({
          type: `${MODEL_NAME}/updateActionBtns`,
          payload: {
            actionBtns: {
              save: {
                onClick: () => formRef?.submit()
              }
            }
          }
        });
      },
      onGetPublicLinks() {
        dispatch({ type: `${MODEL_NAME}/getPublicLinks` });
      },
      onSave(payload) {
        dispatch({ type: `${MODEL_NAME}/prepareToSave`, payload });
      },
      onGetEmails() {
        dispatch({ type: `${MODEL_NAME}/getEmails`, payload: { resetButtons: false } });
      }
    })
)(ProfilePublic);
