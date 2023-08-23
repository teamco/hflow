import { connect, history } from '@umijs/max';
import { AppLayout } from './app.layout';

const MODEL_NAME = 'appModel';

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
        dispatch({ type: `${MODEL_NAME}/checkActiveTab`, payload });
      },
      onDefineAbilities() {
        dispatch({ type: 'authModel/defineAbilities' });
      },
      onUpdate404(is404) {
        dispatch({ type: `${MODEL_NAME}/update404`, payload: { is404 } });
      },
      onUpdateDocumentMeta(meta) {
        dispatch({ type: `${MODEL_NAME}/updateDocumentMeta`, payload: { meta } });
      },
      onCloseSiderPanel(name) {
        dispatch({ type: `${MODEL_NAME}/closeSiderPanel`, payload: { currentPanel: name } });
      }
    })
)(AppLayout);
