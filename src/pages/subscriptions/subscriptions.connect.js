import { connect } from 'umi';

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
)(subscriptions);
