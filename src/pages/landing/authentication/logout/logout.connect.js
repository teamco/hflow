import { connect } from '@umijs/max';

import LandingLogout from './logout';

export default connect(({ authModel, loading }) => ({ authModel, loading }),
    (dispatch) => ({
      dispatch,
      onSignOut() {
        dispatch({ type: 'authModel/signOut' });
      }
    })
)(LandingLogout);
