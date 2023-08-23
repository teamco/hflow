import { connect } from '@umijs/max';

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
