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
      onQuery() {
        dispatch({type: `notificationModel/query`});
      }
    })
)(withTranslation()(notifications));
