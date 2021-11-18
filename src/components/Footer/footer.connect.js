import { connect } from 'dva';
import { footer } from './footer';

export default connect(
    ({ loading }) => ({
      loading
    }),
    (dispatch) => ({})
)(footer);
