import React from 'react';
import { useIntl } from '@umijs/max';
import { Tooltip } from 'antd';
import {
  CopyOutlined,
  FacebookOutlined,
  MailOutlined,
  TwitterOutlined
} from '@ant-design/icons';

import { t } from '@/utils/i18n';

import { AnchorBlank } from '@/components/Common/Anchor/Blank';

import styles from '../profile.account.module.less';

export const ProfileSocial = props => {
  const intl = useIntl();

  const {
    model,
    disabled = false
  } = props;

  const { href, host } = window.location;
  const url = encodeURIComponent(href);

  const { name = 'mr. Name Surname' } = model;

  const shareTo = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(name)}%20${url}`,
    email: `mailto:?subject=${encodeURIComponent(name)}%20${host}&body=${encodeURIComponent(name)}%20-%20${url}`,
    copy: href
  };

  return disabled ? null : (
      <div className={styles.shareItems}>
        <Tooltip title={t(intl, 'actions.shareOn', { type: 'Facebook' })}>
          <AnchorBlank href={shareTo.facebook}><FacebookOutlined/></AnchorBlank>
        </Tooltip>
        <Tooltip title={t(intl, 'actions.shareOn', { type: 'Twitter' })}>
          <AnchorBlank href={shareTo.twitter}><TwitterOutlined/></AnchorBlank>
        </Tooltip>
        <Tooltip title={t(intl, 'actions.email')}>
          <a href={shareTo.email}><MailOutlined/></a>
        </Tooltip>
        <Tooltip title={t(intl, 'actions.copy')}>
          <div onClick={async () => navigator.clipboard.writeText(shareTo.copy)}><CopyOutlined/></div>
        </Tooltip>
      </div>
  );
};