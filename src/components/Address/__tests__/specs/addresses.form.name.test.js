import React from 'react';
import { cleanup } from '@testing-library/react';

import { expectations, mocksWorkaround } from '__tests__/helper';
import { tMock } from '__tests__/mock';

import { AddressName } from '@/components/Address/sections/address.name.js';

const testId = 'addresses.form.name';

describe('@/components/Address/__tests__/specs/addresses.form.name.test.js', () => {

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);
  beforeEach(tMock);

  mocksWorkaround();

  it('Render AddressName with rules - Positive flow', async () => {
    const props = {
      testId,
      rules: {
        mandatory: ['name', 'companyName']
      }
    };

    const { component } = await expectations(AddressName, testId, props, true);

    expect(component).toHaveTextContent('form.fullName');
    expect(component).toHaveTextContent('address.companyName');
  });

  it('Render AddressName with rules - Negative flow', async () => {
    const props = {
      testId,
      rules: {
        mandatory: ['name']
      }
    };

    const { component } = await expectations(AddressName, testId, props, true);

    expect(component).toHaveTextContent('form.fullName');
    expect(component).not.toHaveTextContent('address.companyName');
  });
});