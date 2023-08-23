import { connect } from '@umijs/max';

import { ProfileEmails } from '@/pages/landing/profile/emails/profile.emails';

import { onFieldsChangeHandler } from '@/services/common.service';

const MODEL_NAME = 'profileEmailModel';

export default connect(
    ({ authModel, profileModel, profileEmailModel, loading }) => {
      return {
        authModel,
        profileModel,
        profileEmailModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        onFieldsChangeHandler({ changedFields, allFields, MODEL_NAME, dispatch });
      },
      onQuery(assignedModel) {
        dispatch({
          type: `profileModel/updateState`,
          payload: { label: 'profile.public.email.setting' }
        });

        dispatch({ type: `profileModel/updateActionBtns`, payload: { actionBtns: { assignedModel } } });
      },
      onGetEmails() {
        dispatch({ type: `${MODEL_NAME}/getEmails` });
      },
      onSave(formValues) {
        dispatch({ type: `${MODEL_NAME}/updateEmails`, payload: { emails: [formValues] } });
      },
      onSetPrimary(primaries) {
        dispatch({ type: `${MODEL_NAME}/setAsPrimary`, payload: { primaries } });
      },
      onDelete(email) {
        dispatch({ type: `${MODEL_NAME}/deleteEmail`, payload: { email } });
      }
    })
)(ProfileEmails);
