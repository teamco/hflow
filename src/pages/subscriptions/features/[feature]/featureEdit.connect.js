import { withTranslation } from 'react-i18next';
import { history, connect } from 'umi';

import { featureEdit } from './featureEdit';

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
          type: 'featureModel/updateFields',
          payload: {
            changedFields,
            allFields,
            model: 'featureModel'
          }
        });
      },
      onSave(payload, params) {
        dispatch({ type: 'featureModel/prepareToSave', payload, params });
      },
      onClose() {
        history.push(`/admin/features`);
      },
      onUpdateTags(tags) {
        dispatch({ type: 'featureModel/updateTags', payload: { tags } });
      },
      onEditFeature(params) {
        dispatch({ type: `featureModel/editFeature`, payload: { params } });
      },
      onDeleteFeature() {
      }
    })
)(withTranslation()(featureEdit));
