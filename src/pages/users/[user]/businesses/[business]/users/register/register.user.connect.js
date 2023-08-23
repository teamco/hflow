import { connect } from '@umijs/max';

import { registerUser } from './register.user';

export default connect(
    ({ authModel, roleModel, loading }) => ({
      authModel,
      roleModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `roleModel/query`, payload: { component: 'business.users', docName: 'userRoles' } });
      },
      onRegisterBusinessUser(data, intl) {
        dispatch({ type: 'businessModel/sendRegisterLinkBusinessUser', payload: { data, intl } });
      }
    })
)(registerUser);
