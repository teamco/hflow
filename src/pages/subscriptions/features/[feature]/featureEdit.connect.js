import { history, connect } from 'umi';

import { featureEdit } from './featureEdit';

const MODEL_NAME = 'featureModel';

export default connect(
    ({
      authModel,
      featureModel,
      loading
    }) => ({
      authModel,
      featureModel,
      loading
    }),
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
        history.push(`/admin/features`);
      },
      onUpdateTags(tags) {
        dispatch({ type: `${MODEL_NAME}/updateTags`, payload: { tags } });
      },
      onEditFeature(params) {
        dispatch({ type: `${MODEL_NAME}/editFeature`, payload: { params } });
      },
      onDeleteFeature() {
      }
    })
)(featureEdit);
