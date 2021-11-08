import {connect} from 'dva';
import {withTranslation} from 'react-i18next';
import {LandingPage} from './landing.page.layout';

export default connect(
    ({landingModel, authModel, loading}) => ({
      landingModel,
      authModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onSignOut() {
        dispatch({type: 'authModel/signOut', payload: {}});
      }
    })
)(withTranslation()(LandingPage));
