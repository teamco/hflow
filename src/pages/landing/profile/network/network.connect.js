import { connect } from '@umijs/max';

import { ProfilesNetwork } from '@/pages/landing/profile/network/network';


const MODEL_NAME = 'profileModel';

export default connect(
    ({ authModel, profileModel, loading }) => {
      return {
        authModel,
        profileModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/getAllConnections`, payload: { label: 'profile.network', isEdit: false } });
      },
    })
)(ProfilesNetwork);
