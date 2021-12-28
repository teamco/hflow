import { connect } from 'umi';
import { withTranslation } from 'react-i18next';
import { businessUsers } from './business.users';
import { message } from 'antd';
import i18n from 'utils/i18n';

export default connect(
    ({ businessModel, userRolesModel, userModel, loading }) => ({
      businessModel,
      userRolesModel,
      userModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery(params) {
        dispatch({ type: `businessModel/usersQuery`, payload: { ...params } });
        dispatch({ type: `userRolesModel/query` });
      },
      onUpdateRole(params, user, role) {
        dispatch({ type: `businessModel/updateUserRole`, payload: { params, user, role } });
      },
      onAssignUser(user) {
        dispatch({ type: `businessModel/assignUser`, payload: { user } });
      },
      onUnassignUser(user) {
        dispatch({ type: `businessModel/unassignUser`, payload: { user } });
      },
      onSendVerification(user) {
        if (user.email) {
          dispatch({ type: `userModel/sendVerification`, payload: { user } });
        } else {
          message.warning(i18n.t('msg:errorSentEmail')).then(() => {
            message.warning(i18n.t('error:noEmail')).then();
          });
        }
      },
      onResendRegisterLink(data) {
        dispatch({ type: 'businessModel/sendRegisterLink', payload: { data, isResend: true } });
      }
    })
)(withTranslation()(businessUsers));
