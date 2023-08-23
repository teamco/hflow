import { connect } from '@umijs/max';

import { properties } from './properties';

const MODEL_NAME = 'propertyModel';

export default connect(
    ({ authModel, propertyModel, loading }) => ({
      authModel,
      propertyModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onNew() {
        dispatch({ type: `${MODEL_NAME}/newProperty` });
      },
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/query` });
      },
      onDeleteCampaign(payload) {
        dispatch({type: `${MODEL_NAME}/deleteProperty`, payload })
      }
    })
)(properties);
