import { connect } from 'dva';
import { history } from 'umi';
import { withTranslation } from 'react-i18next';

import { businessEdit } from './businessEdit';

export default connect(
    ({
      authModel,
      businessServiceModel,
      businessPreparationModel,
      businessModel,
      dietaryModel,
      startersAndDessertsModel,
      loading
    }) => ({
      authModel,
      businessServiceModel,
      businessPreparationModel,
      businessModel,
      dietaryModel,
      startersAndDessertsModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        dispatch({
          type: 'businessModel/updateFields',
          payload: {
            changedFields,
            allFields,
            model: 'businessModel'
          }
        });
      },
      onFileChange(payload) {
        dispatch({
          type: 'businessModel/handleAddFile',
          payload: {
            ...payload,
            model: 'businessModel'
          }
        });
      },
      onFileRemove(payload) {
        dispatch({
          type: 'businessModel/handleRemoveFile',
          payload: { ...payload, model: 'businessModel' }
        });
      },
      onSave(payload, params) {
        dispatch({ type: 'businessModel/prepareToSave', payload, params });
      },
      onClose(userId) {
        const url = userId ?
            `/admin/users/${userId}/businesses` :
            `/admin/businesses`;
        history.push(url);
      },
      onUpdateTags(tags) {
        dispatch({ type: 'businessModel/updateTags', payload: { tags } });
      },
      onEditBusiness(params) {
        dispatch({ type: `userModel/validateUser`, payload: { userId: params.user } });
        dispatch({ type: `businessModel/editBusiness`, payload: { params } });
      },
      onHandleStates(country) {
        dispatch({ type: `businessModel/handleStates`, payload: { country } });
      },
      onHoldBusiness() {
      },
      onDeleteBusiness() {
      },
      onActivateBusiness() {
      }
    })
)(withTranslation()(businessEdit));
