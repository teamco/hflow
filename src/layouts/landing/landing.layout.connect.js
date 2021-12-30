import { connect, withRouter } from 'umi';
import { LandingLayout } from './landing.layout';

/**
 * @constant
 * @param appModel
 * @param authModel
 * @param loading
 * @return {{authModel, appModel, loading}}
 */
const mapStateToProps = ({ appModel, authModel, loading }) => ({ appModel, authModel, loading });

/**
 * @constant
 * @param dispatch
 * @return {{onUpdateDocumentMeta(*): void, dispatch, onDefineAbilities(): void, onNotification(): void}}
 */
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  onNotification() {
    dispatch({ type: 'appModel/notification' });
  },
  onDefineAbilities() {
    dispatch({ type: 'authModel/defineAbilities' });
  },
  onUpdateDocumentMeta(meta) {
    dispatch({ type: 'appModel/updateDocumentMeta', payload: { meta } });
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LandingLayout));
