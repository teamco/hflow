import { connect } from 'umi';
import { withTranslation } from 'react-i18next';

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
)(withTranslation()(Profile));
