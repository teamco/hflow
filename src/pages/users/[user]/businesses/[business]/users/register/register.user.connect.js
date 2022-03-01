import { connect } from 'umi';

import { registerUser } from './register.user';

export default connect(
    ({ authModel, userRoleModel, loading }) => ({
      authModel,
      userRoleModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `userRoleModel/query` });
      },
      onRegisterBusinessUser(data) {
        dispatch({ type: 'businessModel/sendRegisterLinkBusinessUser', payload: { data } });
      }
    })
)(registerUser);
