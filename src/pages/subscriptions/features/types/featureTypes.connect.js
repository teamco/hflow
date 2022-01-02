import { connect } from 'umi';
import { withTranslation } from 'react-i18next';

import { featureTypes } from './featureTypes';

export default connect(
    ({ authModel, simpleModel, loading }) => ({
      loading,
      authModel,
      simpleModel
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({
          type: `simpleModel/query`,
          payload: {
            component: 'featureTypes',
            doc: 'featureTypes'
          }
        });
      },
      onUpdateTags(tags) {
        dispatch({ type: 'simpleModel/updateTags', payload: { tags } });
      },
      onSave() {
        dispatch({
          type: 'simpleModel/prepareToSave',
          payload: {
            component: 'featureTypes',
            doc: 'featureTypes'
          }
        });
      }
    })
)(withTranslation()(featureTypes));
