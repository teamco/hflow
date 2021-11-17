import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { footer } from './footer';

export default connect(
    ({ pageModel, loading }) => ({
      pageModel,
      loading
    }),
    (dispatch) => ({
      dispatch
    })
)(withTranslation()(footer));
