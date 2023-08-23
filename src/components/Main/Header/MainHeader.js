import React from 'react';
import { NavLink, useIntl } from '@umijs/max';
import { Badge, Layout, Tooltip } from 'antd';
import { BellOutlined, BellTwoTone, WifiOutlined } from '@ant-design/icons';

import SignedIn from '@/components/Authentication/signedIn.connect';

import { COLORS } from '@/utils/colors';
import { t } from '@/utils/i18n';

const { Header } = Layout;

/**
 * @export
 * @param user
 * @param isOnline
 * @param count
 * @param overflow
 * @return {JSX.Element}
 * @constructor
 */
export const MainHeader = ({ user, isOnline, badge: { count = 0, overflow = 10 } }) => {
  const intl = useIntl();
  const notificationStyle = { marginRight: count < overflow ? 5 : 0 };

  return (
      <Header className={'site-layout-background'}
              style={{
                padding: 0,
                position: 'relative',
                display: 'flex'
              }}>
        {user && (
            <div className={'site-layout-header-info'}>
              {t(intl, 'auth.welcome')}
              <NavLink to={`/admin/profile`}>
                {user?.displayName}
              </NavLink>
            </div>
        )}
        <div className={'site-layout-header-actions'}>
          <SignedIn/>
          {user && (
              <NavLink to={'/admin/notifications'}
                       style={notificationStyle}>
                {count ? (
                    <Badge count={count}
                           size={'small'}
                           offset={[count < overflow ? 0 : -10, 0]}
                           overflowCount={overflow}>
                      <BellTwoTone/>
                    </Badge>
                ) : (<BellOutlined/>)}
              </NavLink>
          )}
          <div className={'site-connection'}>
            <Tooltip title={isOnline ?
                t(intl, 'msg.connected') :
                t(intl, 'error.noConnection')}>
              <WifiOutlined style={{ color: isOnline ? COLORS.success : COLORS.danger }}/>
            </Tooltip>
          </div>
        </div>
      </Header>
  );
}
