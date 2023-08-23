import { connect } from '@umijs/max';

import { ProfileSubscriptionsAll } from './profile.subscriptions.all';

const MODEL_NAME = 'profileModel';

export default connect(
    ({ authModel, profileModel, subscriptionModel, loading }) => {
      return {
        authModel,
        profileModel,
        subscriptionModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({
          type: `${MODEL_NAME}/handleProfile`,
          payload: {
            label: 'profile.subscriptions',
            isEdit: false
          }
        });

        dispatch({ type: `${MODEL_NAME}/updateActionBtns`, payload: { actionBtns: {} } });
      },
      onGetSubscriptions() {
        dispatch({ type: `${MODEL_NAME}/getSubscriptions` });
      },
      onSelectSubscription(subscription) {
        dispatch({ type: `${MODEL_NAME}/assignSubscription`, payload: { subscription } });
      }
    })
)(ProfileSubscriptionsAll);
