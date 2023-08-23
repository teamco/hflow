import React from 'react';
import { cleanup } from '@testing-library/react';

import { expectations, mocksWorkaround } from '__tests__/helper';
import { requestMock, tMock } from '__tests__/mock';

import { ProfileAddresses } from '@/pages/landing/profile/addresses/profile.addresses';

import { ADDRESSES_MOCK } from '__tests__/__mocks__/addresses';
import { SERVER_USER_MOCK } from '__tests__/__mocks__/user';

const testId = 'profile.addresses';

const DEFAULT_PROPS = {
  loading: { effects: {} },
  profileModel: { sUser: {} },
  profileAddressModel: { sAddresses: [] },
  authModel: {
    ability: {
      can: jest.fn(),
      cannot: jest.fn()
    },
    user: {}
  },
  onQuery: jest.fn(),
  onSave: jest.fn(),
  onGetAddresses: jest.fn(),
  onActionButtons: jest.fn(),
  onGetAllCountries: jest.fn(),
  onGetCountryStates: jest.fn(),
  onGetStateCities: jest.fn(),
  onFieldsChange: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn()
};

const PARAMS_TO_TEST = [
  'name',
  'addressLine1',
  'city',
  'state',
  'zipCode',
  'country'
];

describe('@/pages/landing/profile/addresses/profile.addresses.js', () => {

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);
  beforeEach(()=>{
    tMock();
    requestMock();
  });

  mocksWorkaround();

  it('Render ProfileAddresses with Empty Addresses', async () => {
    const props = { testId, ...DEFAULT_PROPS };

    const { component } = await expectations(ProfileAddresses, testId, props, true);

    expect(component).toHaveClass('empty');
    expect(component).toHaveTextContent('No data');
    expect(component).toHaveTextContent('address.primary');
    expect(component).toHaveTextContent('form.placeholder');
  });

  it('Render ProfileAddresses with props', async () => {
    const onQuery = jest.fn();
    const onGetAddresses = jest.fn();

    const props = {
      testId,
      ...DEFAULT_PROPS,
      onQuery,
      onGetAddresses,
      profileModel: { sUser: { ...SERVER_USER_MOCK } },
      profileAddressModel: { sAddresses: [...ADDRESSES_MOCK] },
    };

    const { component, render } = await expectations(ProfileAddresses, testId, props, true);

    expect(component).not.toHaveClass('empty');

    const addresses = component.querySelectorAll('.address');
    expect(addresses.length).toEqual(ADDRESSES_MOCK.length);

    for (let i = 0, l = ADDRESSES_MOCK.length; i < l; i++) {
      for(let key of PARAMS_TO_TEST) {
        expect(component).toHaveTextContent(ADDRESSES_MOCK[i][key]);
      }
    }

    expect(onQuery).toHaveBeenCalled();
    expect(onGetAddresses).toHaveBeenCalled();
  });

  it('Render ProfileAddresses with negative flow', async () => {
    const onQuery = jest.fn();
    const onGetAddresses = jest.fn();

    const props = {
      testId,
      ...DEFAULT_PROPS,
      authModel: {
        ability: {
          can: jest.fn(),
          cannot: jest.fn()
        },
        user: null
      },
      profileModel: { sUser: null },
      profileAddressModel: { sAddresses: [] },
      onQuery,
      onGetAddresses
    };

    const { component } = await expectations(ProfileAddresses, testId, props, true);

    expect(component).toHaveClass('empty');

    expect(props.onQuery).not.toHaveBeenCalled();
    expect(props.onGetAddresses).not.toHaveBeenCalled();
  });
});
