import { connect, history } from 'umi';
import { AppLayout } from './app.layout';

export default connect(
    ({ appModel, authModel, notificationModel, loading }) => ({
      appModel,
      authModel,
      notificationModel,
      loading
    }),
    (dispatch) => ({
      onRoute(path) {
        history.push(path);
      },
      onToggleMenu(collapse) {
        dispatch({ type: `appModel/toggleMenu`, payload: { collapse } });
      },
      onActiveTab(payload) {
        dispatch({ type: 'appModel/checkActiveTab', payload });
      },
      onDefineAbilities() {
        dispatch({ type: 'authModel/defineAbilities' });
      },
      onUpdate404(is404) {
        dispatch({ type: 'appModel/update404', payload: { is404 } });
      },
      onUpdateDocumentMeta(meta) {
        dispatch({ type: 'appModel/updateDocumentMeta', payload: { meta } });
      }
    })
)(AppLayout);
