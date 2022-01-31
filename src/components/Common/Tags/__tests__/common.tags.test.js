import React from 'react';
import { cleanup } from '@testing-library/react';

import { expectations } from '__tests__/helper';

import Common from '@/components/Common';
import { stub } from '@/utils/function';

describe('@/components/Common/Tags', () => {

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  jest.mock('react-i18next');

  it('Top', () => {
    const _tagsDom = expectations(Common.Tags, 'common-tags', {
      t: stub(),
      tags: ['test'],
      disabled: false
    }, true);
  });
});
