import { connect } from '@umijs/max';

import { LandingLayout } from './landing.layout';

const MODEL_NAME = 'appModel';

/**
 * @constant
 * @param appModel
 * @param firebaseModel
 * @param authModel
 * @param loading
 * @return {{authModel, appModel, loading}}
 */
const mapStateToProps = ({ appModel, authModel, loading }) => ({
  appModel,
  authModel,
  loading
});

/**
 * @constant
 * @param dispatch
 * @return {{onUpdateDocumentMeta(*): void, dispatch, onDefineAbilities(): void, onNotification(): void}}
 */
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  onNotification() {
    dispatch({ type: 'notificationModel/refreshNotification' });
  },
  onDefineAbilities() {
    dispatch({ type: `authModel/defineAbilities` });
  },
  onUpdateDocumentMeta(meta) {
    dispatch({ type: 'appModel/updateDocumentMeta', payload: { meta } });
  },
  onUpdateLocales(translateMessages) {
    dispatch({ type: `${MODEL_NAME}/updateLocales`, payload: { translateMessages, MODEL_NAME } });
  },
  onHandleMessageApi(messageApi, intl) {
    dispatch({ type: `${MODEL_NAME}/handleMessageApi`, payload: { messageApi, intl } });
  },
  onOnline(isOnline) {
    dispatch({ type: `${MODEL_NAME}/handleOnline`, payload: { isOnline } });
  },
  onSignIn(user) {
    dispatch({ type: 'authModel/signIn', payload: { user } });
  },
  onRefreshSignIn() {
    dispatch({ type: `firebaseModel/refreshSignIn` });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingLayout);
