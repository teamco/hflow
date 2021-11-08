import {withRouter} from 'umi';
import {connect} from 'dva';
import {LandingLayout} from './landing.layout';

export default withRouter(connect(
    ({appModel, authModel, loading}) => ({
      appModel,
      authModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onNotification() {
        dispatch({type: 'appModel/notification'});
      },
      onDefineAbilities() {
        dispatch({type: 'authModel/defineAbilities'});
      },
      onUpdateDocumentMeta(meta) {
        dispatch({type: 'appModel/updateDocumentMeta', payload: {meta}});
      }
    }))(LandingLayout)
);
