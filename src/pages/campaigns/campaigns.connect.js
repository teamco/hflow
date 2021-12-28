import { connect } from 'umi';
import { withTranslation } from 'react-i18next';

import { campaigns } from './campaigns';

export default connect(
    ({ authModel, campaignModel, loading }) => ({
      authModel,
      campaignModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onNew() {
        dispatch({ type: `campaignModel/newCampaign` });
      },
      onQuery() {
        dispatch({ type: 'campaignModel/query' });
      }
    })
)(withTranslation()(campaigns));
