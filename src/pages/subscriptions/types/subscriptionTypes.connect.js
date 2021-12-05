import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import { subscriptionTypes } from './subscriptionTypes';

export default connect(
    ({ authModel, simpleModel, loading }) => ({
      loading,
      authModel,
      simpleModel
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({
          type: `simpleModel/query`,
          payload: {
            component: 'subscriptionTypes',
            doc: 'subscriptionTypes'
          }
        });
      },
      onUpdateTags(tags) {
        dispatch({ type: 'simpleModel/updateTags', payload: { tags } });
      },
      onSave() {
        dispatch({
          type: 'simpleModel/prepareToSave',
          payload: {
            component: 'subscriptionTypes',
            doc: 'subscriptionTypes'
          }
        });
      }
    })
)(withTranslation()(subscriptionTypes));
