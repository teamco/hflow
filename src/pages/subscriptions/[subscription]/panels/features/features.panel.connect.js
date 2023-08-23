import { connect } from '@umijs/max';

import { FeaturesPanel } from './features.panel';

const MODEL_NAME = 'subscriptionModel';

export default connect(
    ({ subscriptionModel, loading }) =>
        ({ subscriptionModel, loading }),
    (dispatch) => ({
      dispatch,
      onAssignFeature(feature, isAssigned) {
        dispatch({ type: `${MODEL_NAME}/assignFeature`, payload: { feature, isAssigned } });
      },
      onAssignAllFeatures(isAssigned) {
        dispatch({ type: `${MODEL_NAME}/assignAllFeatures`, payload: { isAssigned } });
      }
    })
)(FeaturesPanel);
