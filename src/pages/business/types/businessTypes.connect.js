import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import { businessTypes } from './businessTypes';

export default connect(
    ({ authModel, mainBusinessModel, loading }) => ({
      loading,
      authModel,
      mainBusinessModel
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({
          type: `mainBusinessModel/query`,
          payload: {
            component: 'businessTypes',
            doc: 'businessTypes'
          }
        });
      },
      onUpdateTags(tags) {
        dispatch({ type: 'mainBusinessModel/updateTags', payload: { tags } });
      },
      onSave() {
        dispatch({
          type: 'mainBusinessModel/prepareToSave',
          payload: {
            component: 'businessTypes',
            doc: 'businessTypes'
          }
        });
      }
    })
)(withTranslation()(businessTypes));
