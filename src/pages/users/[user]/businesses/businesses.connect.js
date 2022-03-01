import { connect } from 'umi';

import { businesses } from './businesses';

export default connect(
    ({ authModel, businessModel, loading }) => ({
      authModel,
      businessModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onNew(userId) {
        dispatch({ type: `businessModel/newBusiness`, payload: { userId } });
      },
      onGetBusinesses(selectedUser, userId) {
        dispatch({ type: `businessModel/query`, payload: { selectedUser, userId } });
      },
      onHoldBusiness() {
      },
      onDeleteBusiness() {
      },
      onActivateBusiness() {
      }
    })
)(businesses);
