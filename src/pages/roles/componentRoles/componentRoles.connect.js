import { connect } from '@umijs/max';

import { componentRoles } from './componentRoles';

const MODEL_NAME = 'roleModel'
const component = 'component.roles';
const docName = 'componentRoles';

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
)(componentRoles);
