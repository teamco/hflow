import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import { subscriptions } from './subscriptions';

export default connect(
    ({ authModel, subscriptionsModel, loading }) => ({
      authModel,
      subscriptionsModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onSignIn(user) {
        dispatch({ type: 'authModel/signIn', payload: { user } });
      },
      onQuery(type) {
        dispatch({ type: 'subscriptionsModel/query', payload: { type } });
      },
      onAssignSubscription(subscription) {
        dispatch({ type: 'subscriptionsModel/assignTo', payload: { subscription } });
      }
    })
)(withTranslation()(subscriptions));
