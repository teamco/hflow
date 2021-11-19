import React from 'react';
import { cleanup } from '@testing-library/react';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { expectations } from './helper';

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

describe('Components/Border', () => {

  it('Top', () => {
    const topProps = {
      direction: 'top',
      dims: {
        left: { width: '15vw' },
        right: { width: '45vw' },
        bottom: { width: '15vh', color: 'rgb(241, 241, 241)', style: 'solid' }
      }
    };

    const _borderDom = expectations(topProps);

    expect(_borderDom).toHaveClass('border top');
    expect(_borderDom).toHaveStyle(
        'border-left-width: 15vw; border-right-width: 45vw; border-bottom-width: 15vh; border-bottom-color: rgb(241, 241, 241); border-bottom-style: solid;');
  });

  it('Bottom', () => {
    const bottomProps = {
      direction: 'bottom',
      dims: {
        left: { width: '45vw' },
        right: { width: '15vw' },
        top: { width: '15vh', color: 'rgb(241, 241, 241)', style: 'solid' }
      }
    };

    const _borderDom = expectations(bottomProps);

    expect(_borderDom).toHaveClass('border bottom');
    expect(_borderDom).toHaveStyle(
        'border-left-width: 45vw; border-right-width: 15vw; border-top-width: 15vh; border-top-color: rgb(241, 241, 241); border-top-style: solid;');
  });
});
