import React from 'react';
import { useIntl } from '@umijs/max';
import { Affix, Avatar, Col, Divider, Tooltip } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

import { t } from '@/utils/i18n';

import { SettingHelper } from '@/components/Profile/setting.helper';
import Loader from '@/components/Loader';

import { API } from '@/services/config/api.config';

import styles from '@/pages/landing/profile/public/profile.public.module.less';

export const ProfilePublicLogo = props => {
  const intl = useIntl();

  const { loading, sProfile, sLinks = [], offsetTop = 136 } = props;
  const { primaryLogo } = sProfile || {};

  const spinOn = [
    `profileLinkModel/getLinks`
  ];

  return (
      <Col span={7} offset={1} className={styles.logoSection}>
        <Affix offsetTop={offsetTop}>
          <div className={styles.logoContent}>
            {primaryLogo ? (
                <>
                  <img src={primaryLogo?.encodedBase64}
                       alt={primaryLogo?.altText}/>
                  <div className={styles.metadata}>
                    {primaryLogo?.title && (<h3>{primaryLogo?.title}</h3>)}
                    {primaryLogo?.description &&
                        (<p>{primaryLogo?.description}</p>)}
                  </div>
                </>
            ) : (
                <div className={styles.noLogo}>
                  <Avatar src={API.avatar}/>
                </div>
            )}
            {sProfile && (
                <SettingHelper className={styles.settingHelper}
                               url={'/profile/logos'}
                               type={t(intl, 'profile.logo')}
                               message={t(intl,
                                   'profile.public.logos.setting')}/>
            )}
            <Loader loading={loading} spinOn={spinOn}>
              {sLinks?.length ? (
                  <>
                    <Divider/>
                    <ul>
                      {sLinks?.filter(link => !link.private).
                          map((link, idx) => (
                              <li key={idx}>
                                <Tooltip title={link?.description}>
                                  <GlobalOutlined/>
                                  <a href={link?.url}>{link?.title}</a>
                                </Tooltip>
                              </li>
                          ))}
                    </ul>
                    <SettingHelper className={styles.settingHelper}
                                   url={'/profile/links'}
                                   type={t(intl, 'profile.link')}
                                   message={t(intl,
                                       'profile.public.links.setting')}/>
                  </>
              ) : null}
            </Loader>
          </div>
        </Affix>
      </Col>
  );
};