import React from 'react';
import { Layout } from 'antd';
import SignIn from 'components/Authentication/signIn.connect';

const { Header } = Layout;

export default class MainHeader extends React.Component {

  render() {
    const { user } = this.props;

    return (
      <Header className='site-layout-background'
              style={{
                padding: 0,
                position: 'relative'
              }}>
        <SignIn />
      </Header>
    );
  }
}
