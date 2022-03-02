import { connect } from 'umi';

import withFirebaseAuth from 'react-with-firebase-auth';
import { firebaseAppAuth, providers } from 'services/firebase.service';

import { signUp } from './signUp';

/** Create the FirebaseAuth component wrapper */
const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth
});

export default connect(
    ({ authModel }) => authModel,
    (dispatch) => ({
      dispatch,
      onRegisterData(registerData) {
        dispatch({ type: 'authModel/registerData', payload: { registerData } });
      },
      onSignOut(user) {
        dispatch({ type: 'authModel/signOut', payload: { user } });
      }
    })
)(createComponentWithAuth(signUp));
