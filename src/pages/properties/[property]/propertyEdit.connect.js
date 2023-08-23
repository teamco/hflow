import { history, connect } from '@umijs/max';

import { propertyEdit } from './propertyEdit';
import { onFieldsChangeHandler } from '@/services/common.service';

const MODEL_NAME = 'propertyModel';

export default connect(
    ({
       authModel,
       propertyModel,
       loading
     }) => ({
      authModel,
      propertyModel,
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
        history.push(`/admin/properties`);
      },
      onUpdateTags(tags) {
        dispatch({ type: `${MODEL_NAME}/updateTags`, payload: { tags } });
      },
      onEditProperty(params) {
        dispatch({ type: `${MODEL_NAME}/editProperty`, payload: { params } });
      }
    })
)(propertyEdit);
