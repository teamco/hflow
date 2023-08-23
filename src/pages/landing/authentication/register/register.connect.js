import { connect } from '@umijs/max';

import LandingRegister from './register';

const MODEL_NAME = 'authModel';

export default connect(
    ({ authModel, appModel, firebaseModel, landingModel, loading }) => ({
      authModel,
      appModel,
      firebaseModel,
      landingModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onSignInWithGoogle(popup = true) {
        dispatch({
          type: `firebaseModel/signInWithGoogle`,
          payload: { popup }
        });
      },
      onRegisterData(registerData, user) {
        dispatch({
          type: `${MODEL_NAME}/registerData`,
          payload: { registerData, user }
        });
      },
      onSignOut(user) {
        dispatch({ type: `${MODEL_NAME}/signOut`, payload: { user } });
      }
    })
)(LandingRegister);
