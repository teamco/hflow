import { connect } from 'umi';
import { withTranslation } from 'react-i18next';

import { notifications } from './notifications';
import i18n from '@/utils/i18n';
import { STATUS } from '@/utils/message';

export default connect(
    ({ authModel, notificationModel, loading }) => ({
      authModel,
      notificationModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery(userId) {
        dispatch({ type: `notificationModel/query`, payload: { userId } });
      },
      onRead(doc) {
        dispatch({ type: `notificationModel/setAsRead`, payload: { doc } });
      },
      onSendMessage({ props }, fields) {
        dispatch({
          type: 'notificationModel/createAndUpdate',
          payload: {
            type: i18n.t('notifications:message'),
            status: STATUS.sent,
            replyTo: fields.replyTo,
            title: fields.title,
            description: fields.description,
            isPrivate: fields.isPrivate,
            sentTo: props.to.email
          }
        });
      }
    })
)(withTranslation()(notifications));
