import React from 'react';
import { Avatar, Tooltip } from 'antd';
import { ContactsTwoTone, PauseCircleTwoTone, PlayCircleTwoTone } from '@ant-design/icons';
import { NavLink } from '@umijs/max';

import { COLORS } from '@/utils/colors';
import { t } from '@/utils/i18n';

import DropdownButton from '@/components/Buttons/dropdown.button';

import { showProfileModal } from '@/pages/users/metadata/profile.modal';
import { userMenu } from '@/pages/users/metadata/users.menu';

import styles from '@/pages/users/users.module.less';

const { API } = require('@/services/config/api.config');

/**
 * @constant
 * @param props
 * @return {{cover: JSX.Element, description: JSX.Element, className, avatar: JSX.Element, actions: JSX.Element[]}}
 */
export const userCardMetadata = (props) => {
  const {
    intl,
    className,
    currentUser,
    disabled,
    loading,
    modal,
    ...rest
  } = props;

  const { metadata, displayName } = props.user;

  const menuProps = { currentUser, intl, ...rest };

  const cover = metadata.photoURL ? (
      <img src={metadata.photoURL}
           referrerPolicy={'no-referrer'}
           alt={displayName}
           className={styles.cardImg}/>
  ) : (
      <Avatar src={API.avatar}
              className={styles.cardImg}/>
  );

  const isCurrentStyle = currentUser?.id === props.user.id ? styles.currentUser : null;
  const isSignedIn = metadata.signedIn;
  const color = isSignedIn ? COLORS.success : COLORS.disabled;
  const signed = {
    status: t(intl, isSignedIn ? 'auth.signedIn' : 'auth.signedOut'),
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
        <NavLink to={`/admin/users/${props?.user?.id}`}>
          <span className={isCurrentStyle}>
            {displayName}
          </span>
        </NavLink>
    ),
    actions: [
      <Tooltip title={t(intl, 'auth.showProfile')}
               key={'profile'}>
        <ContactsTwoTone onClick={() => showProfileModal({ ...props.user }, modal, intl)}
                         twoToneColor={COLORS.tags.blue}/>
      </Tooltip>,
      <DropdownButton key={'manage'}
                      overlay={userMenu({ record: props.user, ...menuProps })}
                      data-testid={'user-mng'}
                      disabled={disabled}
                      loading={loading}/>
    ]
  };
};
