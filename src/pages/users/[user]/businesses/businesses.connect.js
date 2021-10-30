import {connect} from 'dva';
import {withTranslation} from 'react-i18next';

import {businesses} from './businesses';

export default connect(
    ({authModel, businessModel, loading}) => {
      return {
        authModel,
        businessModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onNew(userId) {
        dispatch({type: `businessModel/newBusiness`, payload: {userId}});
      },
      onGetBusinesses(selectedUser, userId) {
        dispatch({type: `businessModel/query`, payload: {selectedUser, userId}});
      },
      onHoldBusiness() {
      },
      onDeleteBusiness() {
      },
      onActivateBusiness() {
      }
    })
)(withTranslation()(businesses));
