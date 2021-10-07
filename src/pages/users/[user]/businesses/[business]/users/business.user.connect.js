import {connect} from "dva";
import {withTranslation} from "react-i18next";
import {businessUsers} from './business.users'

export default connect(
    ({businessModel, userRolesModel, loading}) => {
        return {
            businessModel,
            userRolesModel,
            loading
        };
    },
    (dispatch) => ({
        dispatch,
        onQuery(params) {
            dispatch({type: `businessModel/usersQuery`, payload: {...params}});
            dispatch({type: `userRolesModel/query`});
        },
        onUpdateRole(params, user, role) {
            dispatch({type: `businessModel/updateUserRole`, payload: {params, user, role}});
        },
        onAssignUser(user) {
            dispatch({type: `businessModel/assignUser`, payload: {user}});
        },
        onUnassignUser(user) {
            dispatch({type: `businessModel/unassignUser`, payload: {user}});
        }
    })
)(withTranslation()(businessUsers));