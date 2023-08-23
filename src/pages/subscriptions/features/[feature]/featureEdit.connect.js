import { history, connect } from '@umijs/max';

import { featureEdit } from './featureEdit';
import { onFieldsChangeHandler } from '@/services/common.service';

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
        onFieldsChangeHandler({ changedFields, allFields, MODEL_NAME, dispatch })
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
