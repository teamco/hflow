import { connect } from 'umi';
import { useIntl } from 'umi';
import { notifications } from './notifications';

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
        const intl = useIntl();
        dispatch({
          type: 'notificationModel/createAndUpdate',
          payload: {
            type: intl.formatMessage({id: 'notifications.message', defaultMessage: 'Message' }),
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
)(notifications);
