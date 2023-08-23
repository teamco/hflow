import { connect } from '@umijs/max';

import { abilityRoles } from './abilityRoles';

const MODEL_NAME = 'roleModel'
const component = 'ability.roles';
const docName = 'abilityRoles';

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
)(abilityRoles);
