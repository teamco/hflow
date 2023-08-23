import { useState } from 'react';

import { effectHook } from '@/utils/hooks';

/**
 * @export
 * @param authModel
 * @param {string} component
 * @param {boolean} isEdit
 * @return {{ability, canUpdate, canRead, canDelete, canCreate, canExport, ableFor, disabled}}
 */
export const componentAbilities = (authModel, component, isEdit) => {
  const { ability } = authModel;

  const [ableFor, setAbleFor] = useState(isEdit ? 'update' : 'create');
  const [disabled, setDisabled] = useState(ability?.cannot?.(ableFor, component));
  const [canUpdate, setCanUpdate] = useState(ability?.can?.(ableFor, component));

  const canRead = ability?.can?.('read', component);
  const canDelete = ability?.can?.('delete', component);
  const canCreate = ability?.can?.('create', component);
  const canExport = ability?.can?.('export', component);

  effectHook(() => {
    setAbleFor(isEdit ? 'update' : 'create');
  }, [isEdit]);

  effectHook(() => {
    setDisabled(ability?.cannot?.(ableFor, component));
    setCanUpdate(ability?.can?.(ableFor, component));
  }, [ableFor]);

  return {
    ability,
    ableFor,
    disabled,
    canUpdate,
    canRead,
    canDelete,
    canCreate,
    canExport
  };
};