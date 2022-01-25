import React from 'react';
import { NavLink } from 'umi';
import { Badge, Layout, Tooltip } from 'antd';
import { BellOutlined, BellTwoTone, CloudTwoTone } from '@ant-design/icons';

import SignIn from '@/components/Authentication/signIn.connect';
import { COLORS } from '@/utils/colors';

const { Header } = Layout;

export default class MainHeader extends React.Component {

  render() {
    const { t, user, isOnline, badge: { count = 0, overflow = 10 } } = this.props;

    return (
        <Header className={'site-layout-background'}
                style={{
                  padding: 0,
                  position: 'relative',
                  display: 'flex'
                }}>
          {user && (
              <div className={'site-layout-header-info'}>
                {t('auth:welcome')}
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
              <Tooltip title={isOnline ? t('msg:connected') : t('error:noConnection')}>
                <CloudTwoTone twoToneColor={isOnline ? COLORS.success : COLORS.danger}/>
              </Tooltip>
            </div>
          </div>
        </Header>
    );
  }
}
