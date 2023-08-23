import { connect } from '@umijs/max';

import { ErrorPage } from '@/components/Page/Error/error.page';

const MODEL_NAME = 'errorModel';

export default connect(({ authModel, errorModel, loading }) => ({
      authModel,
      errorModel,
      loading
    }),
    dispatch => ({
      onQuery(payload) {
        dispatch({ type: `${MODEL_NAME}/query`, payload });
      }
    })
)(ErrorPage);