import { history, connect } from '@umijs/max';

import { campaignEdit } from './campaignEdit';
import { onFieldsChangeHandler } from '@/services/common.service';

const MODEL_NAME = 'campaignModel';

export default connect(
    ({
      authModel,
      campaignModel,
      loading
    }) => ({
      authModel,
      campaignModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        onFieldsChangeHandler({ changedFields, allFields, MODEL_NAME, dispatch });
      },
      onSave(payload, params) {
        dispatch({ type: `${MODEL_NAME}/prepareToSave`, payload, params });
      },
      onClose() {
        history.push(`/admin/campaigns`);
      },
      onUpdateTags(tags) {
        dispatch({ type: `${MODEL_NAME}/updateTags`, payload: { tags } });
      },
      onEditCampaign(params) {
        dispatch({ type: `${MODEL_NAME}/editCampaign`, payload: { params } });
      },
      onDeleteCampaign() {
      },
      onSubscriptions(payload) {
        dispatch({ type: `${MODEL_NAME}/campaignSubscriptions`, payload });
      },
      onUpdateEntityForm(fields) {
        dispatch({
          type: `${MODEL_NAME}/updateEntityForm`,
          payload: {
            fields,
            model: MODEL_NAME
          }
        });
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
)(campaignEdit);
