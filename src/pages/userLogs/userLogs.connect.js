import { connect } from '@umijs/max';

import { userLogs } from './userLogs';

export default connect(
    ({ authModel, userLogModel, loading }) => {
      return {
        authModel,
        userLogModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `userLogModel/query` });
      }
    })
)(userLogs);
