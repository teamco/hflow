import { connect } from 'umi';

import Profile from './profile';

export default connect(
    ({ authModel, landingModel, loading }) => {
      return {
        authModel,
        landingModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch
    })
)(Profile);
