import { connect } from 'umi';
import { LandingLayout } from './landing.layout';

export default connect(
    ({ appModel, authModel, loading }) => ({
      appModel,
      authModel,
      loading
    }),
    (dispatch) => ({
      onNotification() {
        dispatch({ type: 'appModel/notification' });
      },
      onDefineAbilities() {
        dispatch({ type: 'authModel/defineAbilities' });
      },
      onUpdateDocumentMeta(meta) {
        dispatch({ type: 'appModel/updateDocumentMeta', payload: { meta } });
      }
    })(LandingLayout)
);
