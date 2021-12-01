import React from 'react';
import { EllipsisOutlined, PauseCircleTwoTone, PlayCircleTwoTone } from '@ant-design/icons';
import { Avatar, Dropdown, Tooltip } from 'antd';

import { NavLink } from 'umi';
import { COLORS } from 'utils/colors';

import SubscriptionMenu from './metadata/subscriptions.menu';

import menuStyles from 'components/menu.less';
import styles from './subscriptions.module.less';

export const subscriptionCardMetadata = (t, props) => {
  const {
    className,
    currentUser,
    ...rest
  } = props;

  const { metadata, displayName } = props.user;

  const menuProps = { currentUser, ...rest };

  const cover = metadata.photoURL ? (
      <img src={metadata.photoURL}
           referrerPolicy={'no-referrer'}
           alt={displayName}
           className={styles.cardImg}/>
  ) : (
      <Avatar src={'https://joeschmoe.io/api/v1/random'}
              className={styles.cardImg}/>
  );

  const isCurrentStyle = currentUser?.id === props.user.id ? styles.currentUser : null;
  const isSignedIn = metadata.signedIn;
  const color = isSignedIn ? COLORS.success : COLORS.disabled;
  const signed = {
    status: t(isSignedIn ? 'auth:signedIn' : 'auth:signedOut'),
    icon: isSignedIn ?
        (<PlayCircleTwoTone twoToneColor={color}/>) :
        (<PauseCircleTwoTone twoToneColor={color}/>)
  };

  return {
    cover,
    className,
    avatar: (
        <Tooltip title={signed.status}>
          {signed.icon}
        </Tooltip>
    ),
    description: (
        <NavLink to={`/admin/users/${props.user.id}`}>
          <span className={isCurrentStyle}>
            {displayName}
          </span>
        </NavLink>
    ),
    actions: [
      <Dropdown overlay={<SubscriptionMenu record={props.user} {...menuProps} />}
                overlayClassName={menuStyles.customActionMenu}
                trigger={['click']}
                key={'custom'}>
        <EllipsisOutlined key={'more'}/>
      </Dropdown>
    ]
  };
};
