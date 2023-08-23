import { connect } from '@umijs/max';

import { campaigns } from './campaigns';

const MODEL_NAME = 'campaignModel';

export default connect(
    ({ authModel, campaignModel, loading }) => ({
      authModel,
      campaignModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onNew() {
        dispatch({ type: `${MODEL_NAME}/newCampaign` });
      },
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/query` });
      },
      onDeleteCampaign(payload) {
        dispatch({type: `${MODEL_NAME}/deleteCampaign`, payload })
      }
    })
)(campaigns);
