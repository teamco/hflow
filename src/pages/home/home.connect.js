import {connect} from 'dva';
import {withTranslation} from 'react-i18next';

import {home} from './home';

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
)(withTranslation()(home));
