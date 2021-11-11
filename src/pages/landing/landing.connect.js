import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

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
      }
    })
)(withTranslation()(landing));
