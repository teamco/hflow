import { connect } from '@umijs/max';
const MODEL_NAME = 'schedulerModel';

import { Schedulers } from '@/pages/schedulers/schedulers';

export default connect(
    ({ authModel, schedulerModel, loading }) => ({ authModel, schedulerModel, loading }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/query` });
      }
    })
)(Schedulers);
