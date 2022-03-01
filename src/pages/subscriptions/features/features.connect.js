import { connect } from 'umi';

import { features } from './features';

const MODEL_NAME = 'featureModel';

export default connect(
    ({ authModel, featureModel, loading }) => ({
      loading,
      authModel,
      featureModel
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/query` });
      },
      onNew() {
        dispatch({ type: `${MODEL_NAME}/newFeature` });
      },
      onUpdateTags(tags) {
        dispatch({ type: `${MODEL_NAME}/updateTags`, payload: { tags } });
      },
      onSave() {
        dispatch({
          type: `${MODEL_NAME}/prepareToSave`,
          payload: {
            component: 'features',
            doc: 'features'
          }
        });
      }
    })
)(features);
