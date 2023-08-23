import { connect } from '@umijs/max';

import { Apartment } from './apartment';

const MODEL_NAME = 'apartmentModel';

export default connect(
    ({ authModel, landingModel, apartmentModel, loading }) => ({
      authModel,
      landingModel,
      apartmentModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery(id) {
        dispatch({ type: `${MODEL_NAME}/query`, payload: { id } });
      },
      onAddress(id) {
        dispatch({ type: `${MODEL_NAME}/address`, payload: { id } });
      },
      onLike(id) {
        dispatch({ type: `${MODEL_NAME}/like`, payload: { id } });
      },
      onHide(id, hidden) {
        dispatch({ type: `${MODEL_NAME}/hide`, payload: { id, hidden } });
      }
    })
)(Apartment);
