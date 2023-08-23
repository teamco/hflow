import { connect } from '@umijs/max';

import { History } from './history';

const MODEL_NAME = 'profileModel';

export default connect(
    ({ authModel, landingModel, profileModel, loading }) => {
      return {
        authModel,
        landingModel,
        profileModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/viewed` });
      }
    })
)(History);
