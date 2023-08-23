import { connect } from '@umijs/max';

import HistoryViewed from './history.viewed';

const MODEL_NAME = 'profileModel';

export default connect(
    ({ authModel, landingModel, profileModel, loading }) => {
      return {
        authModel,
        landingModel,
        profileModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/viewed` });

        dispatch({
          type: `profileModel/handleProfile`,
          payload: {
            label: 'profile.history.viewed',
            isEdit: false
          }
        });
      },
      onActionButtons() {
        dispatch({
          type: `${MODEL_NAME}/updateActionBtns`,
          payload: {
            actionBtns: {
              reload: {
                onClick: () => dispatch({ type: `${MODEL_NAME}/viewed`, payload: { force: true } })
              }
            }
          }
        });
      },
      onLike(id) {
        dispatch({
          type: `apartmentModel/like`,
          payload: { id, callbackType: `${MODEL_NAME}/viewed` }
        });
      }
    })
)(HistoryViewed);
