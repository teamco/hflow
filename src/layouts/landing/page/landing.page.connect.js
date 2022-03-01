import { connect } from 'umi';
import { LandingPage } from './landing.page.layout';

export default connect(
    ({ landingModel, authModel, loading }) => ({
      landingModel,
      authModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onSignOut() {
        dispatch({ type: 'authModel/signOut', payload: {} });
      }
    })
)(LandingPage);
