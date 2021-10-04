import {connect} from 'dva';
import {withTranslation} from 'react-i18next';

import {userLogs} from './userLogs';

export default connect(
    ({authModel, userLogModel, loading}) => {
      return {
        authModel,
        userLogModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({type: `userLogModel/query`});
      }
    })
)(withTranslation()(userLogs));
