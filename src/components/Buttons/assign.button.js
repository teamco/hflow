import React from 'react';
import { Button, Popconfirm } from 'antd';
import { useIntl } from '@umijs/max';
import { ApiOutlined } from '@ant-design/icons';

import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

/**
 * @export
 * @default
 * @constant
 * @param {{spinOn}} props
 * @return {JSX.Element}
 */
const assignButton = props => {
  const intl = useIntl();

  const {
    testId,
    loading,
    className,
    disabled,
    icon = <ApiOutlined/>,
    onClick = stub,
    size = 'small',
    type = 'primary',
    spinOn = [],
    behavior = {
      isAssignedAll: stub
    },
    placement = 'topLeft'
  } = props;

  const _spinOn = [...spinOn];

  if (behavior?.all) {
    const isAssigned = behavior?.isAssignedAll();

    return (
        <Button icon={icon}
                data-testid={testId}
                key={'assign-all'}
                size={size}
                type={isAssigned ? 'default' : type}
                className={className}
                disabled={disabled}
                loading={isSpinning(loading, _spinOn)}
                onClick={e => {
                  e.preventDefault();

                  if (isAssigned) {
                    // TODO (teamco): Do something.
                  } else {
                    onClick(isAssigned);
                  }
                }}>
          {isAssigned ? (
                  <Popconfirm title={behavior?.confirm}
                              placement={placement}
                              disabled={disabled}
                              onConfirm={() => onClick(isAssigned)}>
                    {t(intl, 'actions.unAssignAll')}
                  </Popconfirm>
              ) :

              t(intl, 'actions.assignAll')
          }
        </Button>
    );
  }

  return (
      <Button icon={icon}
              data-testid={testId}
              size={size}
              className={className}
              type={behavior?.isAssigned ? 'link' : 'default'}
              onClick={(e) => {
                if (behavior?.isAssigned) {
                  e.preventDefault();
                } else {
                  onClick(behavior?.record, false);
                }
              }}>
        {behavior?.isAssigned ? (
                <Popconfirm title={behavior?.confirm}
                            disabled={disabled}
                            placement={placement}
                            onConfirm={() => onClick(behavior?.record, true)}>
                  {t(intl, 'actions.unAssign')}
                </Popconfirm>
            ) :

            t(intl, 'actions.assign')
        }
      </Button>
  );
};

export default assignButton;
