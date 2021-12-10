import React from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';

import CampaignMenu from './metadata/campaigns.menu';

import menuStyles from 'components/menu.less';

/**
 * @export
 * @param t
 * @param props
 * @return {{rest: Pick<*, Exclude<keyof *, "className"|"style"|"component"|"menuProps"|"data">>, data, style,
 *     className, actions: JSX.Element}}
 */
export const campaignCardMetadata = (t, props) => {
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
        <Dropdown overlay={<CampaignMenu record={data} {...menuProps} />}
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
