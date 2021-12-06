import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import { subscriptionPrefs } from './subscriptionPrefs';

export default connect(
    ({ authModel, subscriptionPrefsModel, loading }) => ({
      loading,
      authModel,
      subscriptionPrefsModel
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({
          type: `subscriptionPrefsModel/query`,
          payload: {
            component: 'subscriptionTypes',
            doc: 'subscriptionTypes'
          }
        });
      },
      onNew() {
        dispatch({ type: `subscriptionPrefsModel/newPreference` });
      },
      onUpdateTags(tags) {
        dispatch({ type: 'subscriptionPrefsModel/updateTags', payload: { tags } });
      },
      onSave() {
        dispatch({
          type: 'subscriptionPrefsModel/prepareToSave',
          payload: {
            component: 'subscriptionPrefs',
            doc: 'subscriptionPrefs'
          }
        });
      }
    })
)(withTranslation()(subscriptionPrefs));
