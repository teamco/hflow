import { connect } from '@umijs/max';

import { RoleManager } from '@/pages/roles/rolesManager/manager';

const MODEL_NAME = 'roleModel';
const component = 'role.manager';
const docName = 'rolesManager';

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
      onGetUserRoles() {
        dispatch({ type: `${MODEL_NAME}/query`, payload: { component, docName: 'userRoles' } });
      },
      onGetBusinessRoles() {
        dispatch({ type: `${MODEL_NAME}/query`, payload: { component, docName: 'businessRoles' } });
      },
      onGetComponentRoles() {
        dispatch({ type: `${MODEL_NAME}/query`, payload: { component, docName: 'componentRoles' } });
      },
      onGetAbilityRoles() {
        dispatch({ type: `${MODEL_NAME}/query`, payload: { component, docName: 'abilityRoles' } });
      },
      onUpdateTouched(touched) {
        dispatch({ type: `${MODEL_NAME}/updateTouched`, payload: { touched } });
      },
      onQuery() {
        dispatch({ type: `${MODEL_NAME}/query`, payload: { component, docName } });
      },
      onSave(payload) {
        dispatch({ type: `${MODEL_NAME}/manage`, payload: { permissions: payload, component, docName } });
      }
    })
)(RoleManager);
