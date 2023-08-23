import { connect, history } from '@umijs/max';

import { subscriptionEdit } from './subscriptionEdit';
import { onFieldsChangeHandler } from '@/services/common.service';

const MODEL_NAME = 'subscriptionModel';

export default connect(
    ({ authModel, subscriptionModel, loading }) =>
        ({ authModel, subscriptionModel, loading }),
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        onFieldsChangeHandler({ changedFields, allFields, MODEL_NAME, dispatch });
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
      onUpdateSider(payload) {
        dispatch({ type: `appModel/updateSiderPanel`, payload: { ...payload, model: MODEL_NAME } });
      },
      onHandleScheduler(entityName, prefix, payload, isEdit) {
        dispatch({ type: `schedulerModel/handleScheduler`, payload: { ...payload, isEdit, entityName, prefix, model: MODEL_NAME } });
      },
      onDeleteScheduler(idx, prefix) {
        dispatch({ type: `schedulerModel/deleteScheduler`, payload: { idx, prefix, model: MODEL_NAME } });
      },
      onDeleteSubscription() {
      }
    })
)(subscriptionEdit);
