import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import { subscriptionsTypes } from './subscriptionsTypes';

export default connect(
    ({ authModel, subscriptionsTypesModel, loading }) => {
      return {
        loading,
        authModel,
        subscriptionsTypesModel
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `subscriptionsTypesModel/query` });
      },
      onUpdateTags(tags) {
        dispatch({ type: 'subscriptionsTypesModel/updateTags', payload: { tags } });
      },
      onSave() {
        dispatch({ type: 'subscriptionsTypesModel/prepareToSave' });
      }
    })
)(withTranslation()(subscriptionsTypes));
