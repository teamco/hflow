import { connect } from 'umi';
import { withTranslation } from 'react-i18next';

import { registerUser } from './register.user';

export default connect(
    ({ authModel, userRolesModel, loading }) => ({
      authModel,
      userRolesModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `userRolesModel/query` });
      },
      onRegisterBusinessUser(data) {
        dispatch({ type: 'businessModel/sendRegisterLinkBusinessUser', payload: { data } });
      }
    })
)(withTranslation()(registerUser));
