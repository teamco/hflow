import {memo} from 'react';
import {history, withRouter} from 'umi';
import {connect} from 'dva';
import {withTranslation} from 'react-i18next';
import {AppLayout} from './app.layout';

export default withRouter(connect(
        ({appModel, authModel, notificationModel, loading}) => ({
          appModel,
          authModel,
          notificationModel,
          loading
        }),
        (dispatch) => ({
          dispatch,
          onRoute(path) {
            history.push(path);
          },
          onToggleMenu(collapse) {
            dispatch({
              type: `appModel/toggleMenu`,
              payload: {collapse}
            });
          },
          onActiveTab(payload) {
            dispatch({
              type: 'appModel/checkActiveTab',
              payload
            });
          },
          onNotification() {
            dispatch({type: 'appModel/notification'});
          },
          onDefineAbilities() {
            dispatch({type: 'authModel/defineAbilities'});
          },
          onUpdateDocumentMeta(meta) {
            dispatch({type: 'appModel/updateDocumentMeta', payload: {meta}});
          }
        })
    )(withTranslation()(memo(AppLayout)))
);
