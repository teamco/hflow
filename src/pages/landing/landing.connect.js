import { connect } from 'umi';

import { landing } from './landing';

export default connect(
    ({ authModel, landingModel, loading }) => {
      return {
        authModel,
        landingModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onSignOut() {
        dispatch({ type: 'authModel/signOut', payload: {} });
      },
      onGetLandingData() {
        dispatch({ type: 'landingModel/getContent' });
      }
    })
)(landing);
