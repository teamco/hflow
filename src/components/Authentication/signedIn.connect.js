import { connect } from '@umijs/max';

import { SignedIn } from './signedIn';

export default connect(
    ({ authModel }) => ({ authModel }),
    (dispatch) => ({
      dispatch,
      onSignOut() {
        dispatch({ type: 'authModel/signOut' });
      },
      onSignOutUser({ user }) {
        dispatch({ type: 'userModel/signOutUser', payload: { user } });
      }
    })
)(SignedIn);
