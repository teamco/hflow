import React from 'react';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { expectations } from '__tests__/helper';

import Common from '@/components/Common';
import { stub } from '@/utils/function';

describe('@/components/Common/Tags', () => {

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  jest.mock('react-i18next');

  it('Hooked tags', async () => {
    const { component, render: { getByText, getByRole } } = expectations(Common.Tags, 'common-tags', {
      t: stub(),
      tags: ['test'],
      disabled: false
    }, true);

    fireEvent(
        getByRole('button'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
    );

    // wait for appearance inside an assertion
    await waitFor(() => {
      // expect(getByText('form:tags')).toBeInTheDocument();
    });
  });
});
