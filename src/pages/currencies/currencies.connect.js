import { connect } from 'umi';
import { withTranslation } from 'react-i18next';

import { currencies } from './currencies';

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
            component: 'currencies',
            doc: 'currencies'
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
            component: 'currencies',
            doc: 'currencies'
          }
        });
      }
    })
)(withTranslation()(currencies));
