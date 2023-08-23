import { connect } from '@umijs/max';
import { Footer } from './footer';

export default connect(
    ({ loading }) => ({
      loading
    }),
    (dispatch) => ({})
)(Footer);
