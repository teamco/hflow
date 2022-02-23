import { connect } from 'umi';

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
)(campaigns);
