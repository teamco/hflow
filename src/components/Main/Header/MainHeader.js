import React from 'react';
import { NavLink, useIntl } from 'umi';
import { Badge, Layout, Tooltip } from 'antd';
import { BellOutlined, BellTwoTone, WifiOutlined } from '@ant-design/icons';

import SignIn from '@/components/Authentication/signIn.connect';
import { COLORS } from '@/utils/colors';

const { Header } = Layout;

export default class MainHeader extends React.Component {

  render() {
    const { t, user, isOnline, badge: { count = 0, overflow = 10 } } = this.props;
    const intl = useIntl();
    return (
        <Header className={'site-layout-background'}
                style={{
                  padding: 0,
                  position: 'relative',
                  display: 'flex'
                }}>
          {user && (
              <div className={'site-layout-header-info'}>
                {intl.formatMessage({id: 'auth.welcome', defaultMessage: 'Welcome'})}
                <NavLink to={`/admin/profile`}>
                  {user?.displayName}
                </NavLink>
              </div>
          )}
          <div className={'site-layout-header-actions'}>
            <SignIn/>
            {user && (
                <NavLink to={'/admin/notifications'}
                         style={count ? count < overflow ? { marginRight: 5 } : null : { marginRight: 0 }}>
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
              <Tooltip title={isOnline ? intl.formatMessage({id: 'msg:connected', defaultMessage: 'Successfully' +
                    ' connected to the network'}) : intl.formatMessage({id: 'error.noConnection', defaultMessage: 'No internet connection'})}>
                <WifiOutlined style={{ color: isOnline ? COLORS.success : COLORS.danger }}/>
              </Tooltip>
            </div>
          </div>
        </Header>
    );
  }
}
