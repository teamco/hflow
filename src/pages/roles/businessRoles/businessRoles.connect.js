import { connect } from '@umijs/max';

import { businessRoles } from './businessRoles';

const MODEL_NAME = 'roleModel';
const component = 'business.roles';
const docName = 'businessRoles';

export default connect(
    ({ authModel, roleModel, loading }) => {
      return {
        loading,
        authModel,
        roleModel
      };
    },
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/query`, payload: { component, docName } });
      },
      onSave(payload) {
        dispatch({ type: `${MODEL_NAME}/prepareToSave`, payload: { ...payload, component, docName } });
      },
      onUpdateRoles(roles) {
        dispatch({ type: `${MODEL_NAME}/updateRoles`, payload: { roles, component, docName } });
      }
    })
)(businessRoles);
