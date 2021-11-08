import React from 'react';
import {Badge, Layout} from 'antd';
import SignIn from 'components/Authentication/signIn.connect';
import {BellOutlined, BellTwoTone} from '@ant-design/icons';
import {NavLink} from 'umi';

const {Header} = Layout;

export default class MainHeader extends React.Component {

  render() {
    const {t, user, badge: {count = 0, overflow = 10}} = this.props;

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
                <NavLink to={`/admin/users/${user.id}`}>
                  {user?.displayName}
                </NavLink>
              </div>
          )}
          <div className={'site-layout-header-actions'}>
            <SignIn/>
            {user && (
                <NavLink to={'/admin/notifications'}
                         style={count ? count < overflow ? {marginRight: 5} : null : {marginRight: 0}}>
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
          </div>
        </Header>
    );
  }
}
