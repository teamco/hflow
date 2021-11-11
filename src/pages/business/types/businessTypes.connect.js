import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import { businessTypes } from './businessTypes';

export default connect(
    ({ authModel, businessTypesModel, loading }) => {
      return {
        loading,
        authModel,
        businessTypesModel
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `businessTypesModel/query` });
      },
      onUpdateTags(tags) {
        dispatch({ type: 'businessTypesModel/updateTags', payload: { tags } });
      },
      onSave() {
        dispatch({ type: 'businessTypesModel/prepareToSave' });
      }
    })
)(withTranslation()(businessTypes));
