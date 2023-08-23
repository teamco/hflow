import { connect } from '@umijs/max';

import { notifications } from './notifications';

export default connect(
    ({ authModel, notificationModel, loading }) => ({
      authModel,
      notificationModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery(userId, type) {
        dispatch({ type: `notificationModel/query`, payload: { userId, type } });
      },
      onRead(docName) {
        dispatch({ type: `notificationModel/setAsRead`, payload: { docName } });
      },
      onSendMessage({ props }, fields) {
        dispatch({
          type: 'notificationModel/createAndUpdate',
          payload: {
            type: 'notifications.message',
            status: 'status.sent',
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
