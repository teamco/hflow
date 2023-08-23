import { connect } from '@umijs/max';

import { subscriptions } from './subscriptions';

const MODEL_NAME = 'subscriptionModel'

export default connect(
    ({ authModel, subscriptionModel, loading }) => ({
      authModel,
      subscriptionModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onNew() {
        dispatch({ type: `${MODEL_NAME}/newSubscription` });
      },
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/query` });
      },
      onDeleteSubscription(payload) {
        dispatch({type: `${MODEL_NAME}/deleteSubscription`, payload })
      }
    })
)(subscriptions);
