import { connect } from '@umijs/max';

import ProfileLayout from './profile.layout';

const MODEL_NAME = 'profileModel';

export default connect((
        {
          authModel,
          subscriptionModel,
          landingModel,
          notificationModel,
          profileModel,
          profileAddressModel,
          profileEmailModel,
          profileLinkModel,
          profileLogoModel,
          loading
        }) => ({
      authModel,
      landingModel,
      profileModel,
      profileAddressModel,
      profileEmailModel,
      profileLinkModel,
      profileLogoModel,
      subscriptionModel,
      notificationModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/handleProfile`, payload: { isEdit: false } });
      },
      onUpdateMenu() {
        dispatch({ type: `${MODEL_NAME}/updateMenu` });
      },
      onToggleMenu(collapse) {
        dispatch({
          type: `appModel/toggleMenu`,
          payload: { collapse, model: MODEL_NAME }
        });
      }
    })
)(ProfileLayout);
