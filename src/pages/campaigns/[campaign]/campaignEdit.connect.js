import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { history } from 'umi';

import { campaignEdit } from './campaignEdit';

export default connect(
    ({
      authModel,
      campaignModel,
      loading
    }) => ({
      authModel,
      campaignModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        dispatch({
          type: 'campaignModel/updateFields',
          payload: {
            changedFields,
            allFields,
            model: 'campaignModel'
          }
        });
      },
      onSave(payload, params) {
        dispatch({ type: 'campaignModel/prepareToSave', payload, params });
      },
      onClose() {
        history.push(`/admin/campaigns`);
      },
      onUpdateTags(tags) {
        dispatch({ type: 'campaignModel/updateTags', payload: { tags } });
      },
      onEditCampaign(params) {
        dispatch({ type: `campaignModel/editCampaign`, payload: { params } });
      },
      onDeleteCampaign() {
      },
      onSubscriptions() {
        dispatch({ type: 'campaignModel/campaignSubscriptions' });
      }
    })
)(withTranslation()(campaignEdit));
