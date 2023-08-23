import { connect } from '@umijs/max';

import { ProfileSubscriptions } from './profile.subscriptions';

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
            label: 'profile.assigned.subscriptions',
            isEdit: false
          }
        });

        dispatch({ type: `${MODEL_NAME}/updateActionBtns`, payload: { actionBtns: {} } });
      },
      onGetProfileSubscriptions() {
        dispatch({ type: `${MODEL_NAME}/getProfileSubscriptions` });
      }
    })
)(ProfileSubscriptions);
