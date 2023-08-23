import { connect } from '@umijs/max';

import { ProfileFeed } from '@/pages/landing/profile/feed/feed';


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
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/getProfileFeed`, payload: { label: 'profile.feed', isEdit: false } });
      },
    })
)(ProfileFeed);
