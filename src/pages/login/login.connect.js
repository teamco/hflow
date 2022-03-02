import { connect } from 'umi';
import withFirebaseAuth from 'react-with-firebase-auth';
import { firebaseAppAuth, providers } from 'services/firebase.service';

import { Login } from './login';

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
      }
    })
)(createComponentWithAuth(Login));
