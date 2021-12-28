import { connect } from 'umi';
import { Footer } from './footer';

export default connect(
    ({ loading }) => ({
      loading
    }),
    (dispatch) => ({})
)(Footer);
