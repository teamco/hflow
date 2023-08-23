import React, { useCallback, useContext } from 'react';

import { useBlocker, useConfirm } from '@/utils/hooks';

import { ConfirmContext } from '@/components/Page/Prompt/lib/ConfirmContext';

export const ReactRouterPrompt = ({ when, children }) => {
  const {
    onConfirm,
    resetConfirmation,
    isActive,
    proceed,
    cancel
  } = useConfirm(ConfirmContext);

  const { resolve } = useContext(ConfirmContext) || {};

  const blocker = useCallback(
      // @ts-ignore
      async tx => {
        if (await onConfirm()) {
          resetConfirmation();
          tx.retry();
        }
      },
      [resetConfirmation, onConfirm]
  );

  useBlocker(blocker, when && !resolve);

  return (
      <div>
        {children({
          isActive,
          onConfirm: proceed,
          onCancel: cancel
        })}
      </div>
  );
};