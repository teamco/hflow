import { connect } from 'umi';
import { withTranslation } from 'react-i18next';

import { preferenceTypes } from './preferenceTypes';

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
            component: 'preferenceTypes',
            doc: 'preferenceTypes'
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
            component: 'preferenceTypes',
            doc: 'preferenceTypes'
          }
        });
      }
    })
)(withTranslation()(preferenceTypes));
