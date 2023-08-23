import React from 'react';
import { cleanup } from '@testing-library/react';

import { Footer } from '../footer';

import { expectations } from '__tests__/helper';

const testId = 'footer';

describe('@/components/Footer', () => {

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('Footer', async () => {
    const { component } = await expectations(Footer, testId, { testId, className: 'component-footer' });

    expect(component).toHaveClass('component-footer');
  });
});
