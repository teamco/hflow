import { history, connect } from '@umijs/max';

import { onFieldsChangeHandler } from '@/services/common.service';

import { businessEdit } from './businessEdit';

const MODEL_NAME = 'businessModel';

export default connect(
    ({
       authModel,
       simpleModel,
       businessServiceModel,
       businessPreparationModel,
       businessModel,
       dietaryModel,
       startersAndDessertsModel,
       loading
     }) => ({
      authModel,
      simpleModel,
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
        onFieldsChangeHandler({ changedFields, allFields, MODEL_NAME, dispatch });
      },
      onFileChange(payload) {
        dispatch({
          type: `${MODEL_NAME}/handleAddFile`,
          payload: {
            ...payload,
            type: 'license',
            model: MODEL_NAME
          }
        });
      },
      onFileRemove(payload) {
        dispatch({
          type: 'businessModel/handleRemoveFile',
          payload: { ...payload, model: MODEL_NAME }
        });
      },
      onSave(payload, params) {
        dispatch({ type: `${MODEL_NAME}/prepareToSave`, payload, params });
      },
      onClose(userId) {
        const url = userId ?
            `/admin/users/${userId}/businesses` :
            `/admin/businesses`;
        history.push(url);
      },
      onUpdateTags(tags) {
        dispatch({ type: `${MODEL_NAME}/updateTags`, payload: { tags } });
      },
      onEditBusiness(params) {
        dispatch({ type: `userModel/validateUser`, payload: { userId: params.user } });
        dispatch({ type: `${MODEL_NAME}/editBusiness`, payload: { params } });
      },
      onHandleStates(country) {
        dispatch({ type: `${MODEL_NAME}/handleStates`, payload: { country } });
      },
      onHoldBusiness() {
      },
      onDeleteBusiness() {
      },
      onActivateBusiness() {
      }
    })
)(businessEdit);
