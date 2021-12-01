import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import { subscriptions } from './subscriptions';

export default connect(
    ({ authModel, subscriptionModel, loading }) => ({
      authModel,
      subscriptionModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onNew() {
        dispatch({ type: `subscriptionModel/newSubscription` });
      },
      onQuery() {
        dispatch({ type: 'subscriptionModel/query' });
      }
    })
)(withTranslation()(subscriptions));
