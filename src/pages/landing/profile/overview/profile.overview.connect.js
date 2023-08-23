import { connect } from '@umijs/max';

import { ProfileOverview } from '@/pages/landing/profile/overview/profile.overview';


const MODEL_NAME = 'profileModel';

export default connect(
    ({ authModel, profileModel, loading }) => {
      return {
        authModel,
        profileModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery(profileId) {
        dispatch({ type: `${MODEL_NAME}/loadOpenProfile`, payload: { label: 'profile.overview', profileId } });
      },
      onGetEmails() {
        dispatch({ type: `${MODEL_NAME}/getPublicEmail`, payload: {} });
      },
      onGetLogos() {
        dispatch({ type: `${MODEL_NAME}/getLogos`, payload: {} });
      }
    })
)(ProfileOverview);
