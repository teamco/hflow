import React from 'react';
import { cleanup } from '@testing-library/react';

import { Footer } from '../footer';

import { expectations } from '__tests__/helper';

describe('@/components/Footer', () => {

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('Footer', () => {
    const { component } = expectations(Footer, 'footer', {});

    expect(component).toHaveClass('ant-layout-footer footer');
  });
});
