import { connect } from '@umijs/max';

import { ProfileAccount } from './profile.account';

const MODEL_NAME = 'profileModel';

export default connect(
    ({ authModel, profileModel, userModel, loading }) => {
      return {
        authModel,
        profileModel,
        userModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({
          type: `${MODEL_NAME}/updateActionBtns`,
          payload: { actionBtns: {} }
        });

        dispatch({
          type: `${MODEL_NAME}/updateState`,
          payload: { label: 'profile.account' }
        });
      },
      onSendVerification(user) {
        if (user.email) {
          dispatch({ type: `userModel/sendVerification`, payload: { user } });
        }
      }
    })
)(ProfileAccount);
