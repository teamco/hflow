import { connect } from 'umi';
import { withTranslation } from 'react-i18next';

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
      onEditBusiness(params) {
        dispatch({ type: `userModel/validateUser`, payload: { userId: params.user } });
        dispatch({ type: `businessModel/editBusiness`, payload: { params } });
      },
      onHoldBusiness() {
      },
      onDeleteBusiness() {
      },
      onActivateBusiness() {
      }
    })
)(withTranslation()(businessShow));
