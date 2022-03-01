import { connect } from 'umi';

import { profile } from './profile';

export default connect(
    ({ authModel, userModel, loading }) => {
      return {
        authModel,
        userModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onGetUser(selectedUser, userId) {
        dispatch({ type: `userModel/getUser`, payload: { selectedUser, userId } });
      }
    })
)(profile);
