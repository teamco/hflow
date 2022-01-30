import React from 'react';

import Footer from '@/components/Footer';

export default class MainFooter extends React.Component {
  render() {
    return (
        <Footer style={{ textAlign: 'center' }}>
          {this.props.author}
        </Footer>
    );
  }
}
