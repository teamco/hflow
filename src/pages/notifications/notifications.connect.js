import {connect} from 'dva';
import {withTranslation} from 'react-i18next';

import {notifications} from './notifications';

export default connect(
    ({authModel, notificationModel, loading}) => ({
      authModel,
      notificationModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery(userId) {
        dispatch({type: `notificationModel/query`, payload: {userId}});
      }
    })
)(withTranslation()(notifications));
