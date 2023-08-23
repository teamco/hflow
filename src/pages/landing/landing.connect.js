import { connect } from '@umijs/max';

import { landing } from './landing';

const MODEL_NAME = 'landingModel';

export default connect(
    ({ authModel, landingModel, apartmentModel, loading }) => ({
      authModel,
      landingModel,
      apartmentModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onSignOut() {
        dispatch({ type: 'authModel/signOut', payload: {} });
      },
      onGetLandingData() {
        dispatch({ type: `${MODEL_NAME}/getContent` });
      },
      onFetchCarousel(direction) {
        dispatch(
            { type: `${MODEL_NAME}/getApartments`, payload: { direction } });
      },
      onLike(id) {
        dispatch({ type: `apartmentModel/like`, payload: { id } });
      }
    })
)(landing);
