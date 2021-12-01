import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import { subscriptionTypes } from './subscription.types';

export default connect(
    ({ authModel, mainBusinessModel, loading }) => ({
      loading,
      authModel,
      mainBusinessModel
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({
          type: `mainBusinessModel/query`,
          payload: {
            component: 'subscriptionTypes',
            doc: 'subscriptionTypes'
          }
        });
      },
      onUpdateTags(tags) {
        dispatch({ type: 'mainBusinessModel/updateTags', payload: { tags } });
      },
      onSave() {
        dispatch({
          type: 'mainBusinessModel/prepareToSave',
          payload: {
            component: 'subscriptionTypes',
            doc: 'subscriptionTypes'
          }
        });
      }
    })
)(withTranslation()(subscriptionTypes));
