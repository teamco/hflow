import { connect, history } from '@umijs/max';

import { ProfileApartments } from '@/pages/landing/profile/apartments/profile.apartments';

const MODEL_NAME = 'profileApartmentModel';

export default connect(
    ({ authModel, profileModel, profileApartmentModel, loading }) => {
      return {
        authModel,
        profileModel,
        profileApartmentModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({
          type: `profileModel/updateState`,
          payload: { label: 'profile.public.apartments.setting' }
        });
      },
      onActionButtons(assignedModel) {
        dispatch({
          type: `profileModel/updateActionBtns`,
          payload: {
            actionBtns: {
              assignedModel,
              addNew: {
                spinOn: [`${MODEL_NAME}/newApartment`]
              }
            }
          }
        });
      },
      onGetApartments() {
        dispatch({ type: `${MODEL_NAME}/getApartments` });
      }
    })
)(ProfileApartments);
