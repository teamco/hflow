import { connect } from '@umijs/max';

import { businessShow } from './businessShow';

export default connect(
    ({
      authModel,
      businessModel,
      loading
    }) => ({
      authModel,
      businessModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onEditBusiness(params, isEdit) {
        dispatch({ type: `userModel/validateUser`, payload: { userId: params.user } });
        dispatch({ type: `businessModel/editBusiness`, payload: { params, isEdit } });
      },
      onHoldBusiness() {
      },
      onDeleteBusiness() {
      },
      onActivateBusiness() {
      }
    })
)(businessShow);
