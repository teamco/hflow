import React from 'react';
import {Layout, Badge} from 'antd';
import SignIn from 'components/Authentication/signIn.connect';
import {BellTwoTone, BellOutlined} from '@ant-design/icons';
import {NavLink} from 'umi';

const {Header} = Layout;

export default class MainHeader extends React.Component {

  render() {
    const {user, badge: {count = 0, overflow = 10}} = this.props;

    return (
        <Header className={'site-layout-background'}
                style={{
                  padding: 0,
                  position: 'relative'
                }}>
          <div className={'site-layout-header-actions'}>
            <SignIn/>
            {user ? (
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
            ) : null}
          </div>
        </Header>
    );
  }
}
