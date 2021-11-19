import { connect } from 'dva';
import { Footer } from './footer';

export default connect(
    ({ loading }) => ({
      loading
    }),
    (dispatch) => ({})
)(Footer);
