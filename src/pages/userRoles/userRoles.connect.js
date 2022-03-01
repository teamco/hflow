import { connect } from 'umi';

import { userRoles } from './userRoles';

export default connect(
    ({ authModel, userRoleModel, loading }) => {
      return {
        loading,
        authModel,
        userRoleModel
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `userRoleModel/query` });
      },
      onSave(payload) {
        dispatch({
          type: 'userRoleModel/prepareToSave',
          payload
        });
      },
      onUpdateUserRoles(roles) {
        dispatch({
          type: 'userRoleModel/updateUserRoles',
          payload: { roles }
        });
      },
      onUpdateBusinessRoles(roles) {
        dispatch({
          type: 'userRoleModel/updateBusinessRoles',
          payload: { roles }
        });
      }
    })
)(userRoles);
