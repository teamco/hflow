import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { history } from 'umi';

import { preferenceEdit } from './preferenceEdit';

export default connect(
    ({
      authModel,
      subscriptionPrefsModel,
      loading
    }) => ({
      authModel,
      subscriptionPrefsModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        dispatch({
          type: 'subscriptionPrefsModel/updateFields',
          payload: {
            changedFields,
            allFields,
            model: 'subscriptionPrefsModel'
          }
        });
      },
      onSave(payload, params) {
        dispatch({ type: 'subscriptionPrefsModel/prepareToSave', payload, params });
      },
      onClose() {
        history.push(`/admin/subscriptionPrefs`);
      },
      onUpdateTags(tags) {
        dispatch({ type: 'subscriptionPrefsModel/updateTags', payload: { tags } });
      },
      onEditSubscription(params) {
        dispatch({ type: `subscriptionPrefsModel/editSubscription`, payload: { params } });
      },
      onDeleteSubscription() {
      }
    })
)(withTranslation()(preferenceEdit));
