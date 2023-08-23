import React from 'react';

import { subscriptionMenu } from './metadata/subscriptions.menu';
import DropdownButton from '@/components/Buttons/dropdown.button';

/**
 * @export
 * @param props
 * @return {{rest: Pick<*, Exclude<keyof *, "className"|"style"|"component"|"menuProps"|"data">>, data, style,
 *     className, actions: JSX.Element}}
 */
export const subscriptionCardMetadata = (props) => {
  const {
    className,
    data,
    style,
    menuProps,
    disabled,
    loading,
    testId,
    ...rest
  } = props;

  return {
    data,
    style,
    className,
    actions: (
        <DropdownButton key={'manage'}
                        overlay={subscriptionMenu({ record: data, ...menuProps })}
                        data-testid={testId}
                        placement={'bottomRight'}
                        disabled={!menuProps?.canUpdate && !menuProps?.canDelete}
                        loading={loading}/>
    ),
    rest
  };
};
