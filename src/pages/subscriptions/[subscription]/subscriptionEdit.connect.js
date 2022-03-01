import { connect, history } from 'umi';

import { subscriptionEdit } from './subscriptionEdit';

const MODEL_NAME = 'subscriptionModel';

export default connect(
    ({ authModel, subscriptionModel, loading }) =>
        ({ authModel, subscriptionModel, loading }),
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        dispatch({
          type: `${MODEL_NAME}/updateFields`,
          payload: {
            changedFields,
            allFields,
            model: MODEL_NAME
          }
        });
      },
      onSave(payload, params) {
        dispatch({ type: `${MODEL_NAME}/prepareToSave`, payload, params });
      },
      onClose() {
        history.push(`/admin/subscriptions`);
      },
      onUpdateTags(tags) {
        dispatch({ type: `${MODEL_NAME}/updateTags`, payload: { tags } });
      },
      onEditSubscription(params) {
        dispatch({ type: `${MODEL_NAME}/editSubscription`, payload: { params } });
      },
      onChangeFeatureType(type) {
        dispatch({ type: `${MODEL_NAME}/changeFeatureType`, payload: { type } });
      },
      onDeleteSubscription() {
      }
    })
)(subscriptionEdit);
