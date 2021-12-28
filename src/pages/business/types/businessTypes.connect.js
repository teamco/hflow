import { connect } from 'umi';
import { withTranslation } from 'react-i18next';

import { businessTypes } from './businessTypes';

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
            component: 'businessTypes',
            doc: 'businessTypes'
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
            component: 'businessTypes',
            doc: 'businessTypes'
          }
        });
      }
    })
)(withTranslation()(businessTypes));
