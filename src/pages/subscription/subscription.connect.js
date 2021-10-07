import {connect} from 'dva';
import {withTranslation} from 'react-i18next';

import {subscription} from './subscription';

export default connect(
    ({authModel, subscriptionModel, loading}) => ({
      authModel,
      subscriptionModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onSignIn(user) {
        dispatch({type: 'authModel/signIn', payload: {user}});
      },
      onQuery() {
        dispatch({type: 'subscriptionModel/query'});
      },
      onAssignSubscription(subscription) {
        dispatch({type: 'subscriptionModel/assignTo', payload: {subscription}});
      }
    })
)(withTranslation()(subscription));
