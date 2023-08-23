import { stub } from '@/utils/function';

/**
 * @export
 * @param {Event} e
 * @param dataSource
 * @param _roleFor
 * @param {function} setDataSource
 */
export const handleNewRow = (e, dataSource, _roleFor, setDataSource) => {

  e.preventDefault();
  e.stopPropagation();

  const newData = {
    components: [],
    abilities: [],
    _roleFor
  };

  const _targetRoles = {
    [_roleFor]: [
      ...(dataSource[_roleFor] || []),
      newData
    ]
  };

  setDataSource({ ...dataSource, ..._targetRoles });
};

/**
 * @export
 * @param selectedRole
 * @return {*}
 */
export const getRole = (selectedRole) => {
  return selectedRole?.roles;
};

/**
 * @export
 * @param selectedRole
 * @return {*}
 */
export const getRoleFor = (selectedRole) => {
  return selectedRole?.metadata?.role?._roleFor;
};

/**
 * @export
 * @param {{dataSource, permissions, primaryRole, row, secondaryRole, setDataSource}} props
 */
export const updateRoles = (props) => {
  const {
    row,
    roleFor,
    dataSource,
    permissions,
    primaryRole = 'components',
    secondaryRole = 'abilities',
    setDataSource = stub
  } = props;

  let _newRoles = [];
  let _roleFor = roleFor?.role?._roleFor;

  // Clone data source.
  let targetSource = JSON.parse(JSON.stringify(dataSource));

  if (!_roleFor) return false;

  if (permissions.length) {

    _newRoles = permissions.map(cmpRole => {
      return { role: getRole(cmpRole) };
    });

    // Handle empty row.
    const noData = dataSource[_roleFor][dataSource[_roleFor].length - 1];

    if (!noData[primaryRole]?.length && !noData[secondaryRole]?.length) {
      targetSource[_roleFor].pop();
    }
  }

  targetSource[_roleFor] = [...targetSource[_roleFor]] || [];
  targetSource[_roleFor][row] = targetSource[_roleFor][row] || {};

  const src = targetSource[_roleFor][row];

  src[secondaryRole] = [...(src[secondaryRole] || [])];
  src[primaryRole] = _newRoles;
  src._roleFor = _roleFor;

  setDataSource({
    ...dataSource,
    [_roleFor]: [...(targetSource[_roleFor] || [])]
  });
};

/**
 * @export
 * @param dataSource
 * @param {string} roleFor
 * @return {boolean}
 */
export const isDisabledNew = (dataSource, roleFor) => {
  let isDisabled = false;

  if (dataSource[roleFor]?.length) {
    const { components, abilities } = dataSource[roleFor][0];
    isDisabled = !(components?.length && abilities?.length);
  }

  return isDisabled;
};

/**
 * @export
 * @param roleFor
 * @param roles
 * @return {{data: *[], keys: *[]}}
 */
export const rolesToTransfer = (roleFor, roles = []) => {
  const tempTargetKeys = [];
  const tempData = [];

  const activeItems = roleFor?.role?.[roleFor?.activeType] || [];
  const isData = activeItems?.length;

  for (let i = 0; i < roles?.length; i++) {
    let _chosen = false;

    if (isData) {
      _chosen = activeItems?.find(selected => selected.role.title === roles[i]);
    }

    const _data = {
      key: i.toString(),
      disabled: false,
      title: roles[i],
      description: null,
      chosen: !!_chosen
    };

    if (_data.chosen) {
      tempTargetKeys.push(_data.key);
    }

    tempData.push(_data);
  }

  return { data: tempData, keys: tempTargetKeys };
};