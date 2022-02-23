import { connect } from 'umi';
import withFirebaseAuth from 'react-with-firebase-auth';

import { firebaseAppAuth, providers } from 'services/firebase.service';

import { finishSignUp } from './finishSignUp';

/** Create the FirebaseAuth component wrapper */
const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth
});

export default connect(
    ({ authModel, businessModel, loading }) => {
      return {
        authModel,
        businessModel,
        loadingModel: loading
      };
    },
    (dispatch) => ({
      dispatch,
      onPrepareRegistration(params) {
        dispatch({ type: 'businessModel/prepareRegistration', payload: { ...params } });
      },
      onRegisterData(registerData) {
        dispatch({ type: 'authModel/registerData', payload: { registerData } });
      }
    })
)(createComponentWithAuth(finishSignUp));
