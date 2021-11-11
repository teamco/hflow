import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import withFirebaseAuth from 'react-with-firebase-auth';
import { firebaseAppAuth, providers } from 'services/firebase.service';

import { signIn } from './signIn';

/** Create the FirebaseAuth component wrapper */
const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth
});

export default connect(
    ({ authModel }) => ({ authModel }),
    (dispatch) => ({
      dispatch,
      onSignIn(user) {
        dispatch({ type: 'authModel/signIn', payload: { user } });
      },
      onSignOut(user) {
        dispatch({ type: 'authModel/signOut', payload: { user } });
      },
      onSignOutUser({ user }) {
        dispatch({ type: 'userModel/signOutUser', payload: { user } });
      },
      onUpdateEmail({ user, email }) {
        dispatch({ type: 'authModel/updateEmail', payload: { user, email } });
      }
    })
)(withTranslation()(createComponentWithAuth(signIn)));
