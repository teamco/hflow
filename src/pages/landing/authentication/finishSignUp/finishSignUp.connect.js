import { connect } from '@umijs/max';

import { finishSignUp } from './finishSignUp';

export default connect(
    ({ authModel, businessModel, landingModel, loading }) => {
      return {
        authModel,
        businessModel,
        landingModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onPrepareRegistration(params, intl) {
        dispatch({ type: 'businessModel/prepareRegistration', payload: { ...params, intl } });
      },
      onRegisterData(registerData) {
        dispatch({ type: 'authModel/registerData', payload: { registerData } });
      }
    })
)(finishSignUp);
