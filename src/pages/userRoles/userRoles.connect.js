import {connect} from 'dva';
import {withTranslation} from 'react-i18next';

import {userRoles} from './userRoles';

export default connect(
    ({authModel, userRolesModel, loading}) => {
      return {
        loading,
        authModel,
        userRolesModel
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({type: `userRolesModel/query`});
      },
      onSave(payload) {
        dispatch({
          type: 'userRolesModel/prepareToSave',
          payload
        });
      },
      onUpdateUserRoles(roles) {
        dispatch({
          type: 'userRolesModel/updateUserRoles',
          payload: {roles}
        });
      },
      onUpdateBusinessRoles(roles) {
        dispatch({
          type: 'userRolesModel/updateBusinessRoles',
          payload: {roles}
        });
      }
    })
)(withTranslation()(userRoles));
