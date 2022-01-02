import { connect } from 'umi';
import { withTranslation } from 'react-i18next';

import { features } from './features';

export default connect(
    ({ authModel, featureModel, loading }) => ({
      loading,
      authModel,
      featureModel
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({
          type: `featureModel/query`
        });
      },
      onNew() {
        dispatch({ type: `featureModel/newFeature` });
      },
      onUpdateTags(tags) {
        dispatch({ type: 'featureModel/updateTags', payload: { tags } });
      },
      onSave() {
        dispatch({
          type: 'featureModel/prepareToSave',
          payload: {
            component: 'features',
            doc: 'features'
          }
        });
      }
    })
)(withTranslation()(features));
