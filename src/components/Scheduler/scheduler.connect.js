import { connect } from '@umijs/max';

const MODEL_NAME = 'schedulerModel';

import { Scheduler } from '@/components/Scheduler/Scheduler';

export default connect(
    ({ schedulerModel, loading }) => ({ schedulerModel, loading }),
    (dispatch) => ({
      onSetPeriod(payload) {
        dispatch({ type: `${MODEL_NAME}/updatePeriod`, payload });
      }
    })
)(Scheduler);
