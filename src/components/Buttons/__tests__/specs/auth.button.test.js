import React from 'react';
import { cleanup } from '@testing-library/react';

import { expectations, mocksWorkaround } from '__tests__/helper';
import { tMock } from '__tests__/mock';

import * as authButton from '@/components/Buttons/auth.button';

const testId = 'authBtn';

const {
  GoogleBtn,
  FacebookBtn,
  TwitterBtn
} = authButton.default;

describe('@/components/Buttons/auth.button.js', () => {

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);
  beforeEach(tMock);

  mocksWorkaround();

  it('auth.button > Google', async () => {
    const props = {
      testId,
      loading: { effects: {} },
      className: 'auth.button.google'
    };

    const { component } = await expectations(GoogleBtn, testId, props);

    expect(component).toHaveClass(props.className);
    expect(component).toHaveTextContent('Google');
  });

  it('auth.button > Twitter', async () => {
    const props = {
      testId,
      loading: { effects: {} },
      className: 'auth.button.twitter'
    };

    const { component } = await expectations(TwitterBtn, testId, props);

    expect(component).toHaveClass(props.className);
    expect(component).toHaveTextContent('Twitter');
  });

  it('auth.button > Facebook', async () => {
    const props = {
      testId,
      loading: { effects: {} },
      className: 'auth.button.facebook'
    };

    const { component } = await expectations(FacebookBtn, testId, props);

    expect(component).toHaveClass(props.className);
    expect(component).toHaveTextContent('Facebook');
  });
});
