import { connect } from '@umijs/max';

import LandingLogin from './login';

const MODEL_NAME = 'firebaseModel';

export default connect(
    ({
       authModel,
       appModel,
       firebaseModel,
       landingModel,
       loading
     }) => ({
      authModel,
      appModel,
      firebaseModel,
      landingModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onSignIn(user) {
        dispatch({ type: 'authModel/signIn', payload: { user } });
      },
      onSignInWithPassword(payload) {
        dispatch({ type: `${MODEL_NAME}/signInWithPassword`, payload });
      },
      onSignInWithGoogle(popup = true) {
        dispatch({
          type: `${MODEL_NAME}/signInWithGoogle`,
          payload: { popup }
        });
      }
    })
)(LandingLogin);
