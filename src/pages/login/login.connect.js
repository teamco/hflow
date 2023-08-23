import { connect } from '@umijs/max';

import { Login } from './login';

export default connect(
    ({ authModel }) => ({ authModel }),
    (dispatch) => ({
      dispatch,
      onSignIn(user) {
        dispatch({ type: 'authModel/signIn', payload: { user } });
      }
    })
)(Login);
