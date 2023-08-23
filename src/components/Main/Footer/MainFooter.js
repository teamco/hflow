import React from 'react';

import Footer from '@/components/Footer';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const MainFooter = props => {
  return (
      <Footer style={{ textAlign: 'center' }}>
        {props.author}
      </Footer>
  );
};
