import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { history } from 'umi';

import { subscriptionEdit } from './subscriptionEdit';

export default connect(
    ({
      authModel,
      subscriptionModel,
      loading
    }) => ({
      authModel,
      subscriptionModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        dispatch({
          type: 'subscriptionModel/updateFields',
          payload: {
            changedFields,
            allFields,
            model: 'subscriptionModel'
          }
        });
      },
      onSave(payload, params) {
        dispatch({ type: 'subscriptionModel/prepareToSave', payload, params });
      },
      onClose(userId) {
        history.push(`/admin/subscriptions`);
      },
      onUpdateTags(tags) {
        dispatch({ type: 'subscriptionModel/updateTags', payload: { tags } });
      },
      onEditSubscription(params) {
        dispatch({ type: `subscriptionModel/editSubscription`, payload: { params } });
      },
      onDeleteSubscription() {
      }
    })
)(withTranslation()(subscriptionEdit));
