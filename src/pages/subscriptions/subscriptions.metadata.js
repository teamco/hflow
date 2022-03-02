import React from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';

import SubscriptionMenu from './metadata/subscriptions.menu';

import menuStyles from '@/components/menu.less';

/**
 * @export
 * @param t
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
    ...rest
  } = props;

  return {
    data,
    style,
    className,
    actions: (
        <Dropdown overlay={<SubscriptionMenu record={data} {...menuProps} />}
                  overlayClassName={menuStyles.customActionMenu}
                  trigger={['click']}
                  key={'custom'}
                  {...rest}>
          <EllipsisOutlined key={'more'}/>
        </Dropdown>
    ),
    rest
  };
};
