import { connect } from '@umijs/max';

import HistoryLiked from './history.liked';

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
        dispatch({ type: `${MODEL_NAME}/liked` });

        dispatch({
          type: `profileModel/handleProfile`,
          payload: {
            label: 'profile.history.liked',
            isEdit: false
          }
        });
      },
      onActionButtons(formRef) {
        dispatch({
          type: `${MODEL_NAME}/updateActionBtns`,
          payload: {
            actionBtns: {
              reload: {
                onClick: () => dispatch({ type: `${MODEL_NAME}/liked`, payload: { force: true } })
              }
            }
          }
        });
      },
      onLike(id) {
        dispatch({
          type: `apartmentModel/like`,
          payload: { id, callbackType: `${MODEL_NAME}/liked` }
        });
      }
    })
)(HistoryLiked);
