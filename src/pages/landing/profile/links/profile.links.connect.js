import { connect } from '@umijs/max';

import { ProfileLinks } from '@/pages/landing/profile/links/profile.links';

import { onFieldsChangeHandler } from '@/services/common.service';

const MODEL_NAME = 'profileLinkModel';

export default connect(
    ({ authModel, profileModel, profileLinkModel, loading }) => {
      return {
        authModel,
        profileLinkModel,
        profileModel,
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
          payload: { label: 'profile.public.links.setting' }
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
                spinOn: [`${MODEL_NAME}/updateLinks`]
              }
            }
          }
        });
      },
      onGetLinks() {
        dispatch({ type: `${MODEL_NAME}/getLinks` });
      },
      onSave(formValues, selected) {
        dispatch({ type: `${MODEL_NAME}/updateLinks`, payload: { formValues, selected } });
      },
      onUpdateTags(tags, formRef) {
        dispatch({ type: `${MODEL_NAME}/updateTags`, payload: { tags } });
      },
      onEdit(link, unselect) {
        dispatch({ type: `${MODEL_NAME}/editLink`, payload: { link, unselect } });
      },
      onDelete(link) {
        dispatch({ type: `${MODEL_NAME}/deleteLink`, payload: { link } });
      }
    })
)(ProfileLinks);
