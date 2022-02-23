import { connect } from 'umi';

import { home } from './home';

export default connect(
    ({ pageModel, loading }) => {
      return {
        pageModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch
    })
)(home);
