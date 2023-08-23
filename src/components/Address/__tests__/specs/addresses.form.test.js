import React from 'react';
import { cleanup } from '@testing-library/react';

import { expectations, mocksWorkaround } from '__tests__/helper';
import { tMock } from '__tests__/mock';

import { AddressesForm } from '@/components/Address/addresses.form.js';

const testId = 'addresses.form';
const className = 'addresses-form-class';
const MODEL_NAME = 'addressModel';

describe('@/pages/landing/profile/addresses/profile.addresses.js', () => {

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);
  beforeEach(tMock);

  mocksWorkaround();

  it('Render AddressesForm', async () => {
    const props = { testId };

    const { component } = await expectations(AddressesForm, testId, props, true);

    expect(component).toHaveTextContent('address.primary');
    expect(component).toHaveTextContent('address.billing');
    expect(component).toHaveTextContent('form.placeholder');
    expect(component).toHaveTextContent('address.type');

    const spinner = component.querySelector('.ant-spin-nested-loading');
    expect(spinner).not.toBeNull();

    const spinning = spinner.querySelector('.ant-spin-spinning');
    expect(spinning).toBeNull();
  });

  it('Render AddressesForm with loading props', async () => {
    const props = {
      testId,
      loading: {
        effects: {
          [`${MODEL_NAME}/getAllCountries`]: true
        }
      }
    };

    const { component } = await expectations(AddressesForm, testId, props, true);

    const spinner = component.querySelector('.ant-spin-nested-loading');
    expect(spinner).not.toBeNull();

    const spinning = spinner.querySelector('.ant-spin-spinning');
    expect(spinning).not.toBeNull();
  });

  it('Render AddressesForm with className', async () => {
    const props = { testId, className };

    const { component } = await expectations(AddressesForm, testId, props, true);

    const div = component.querySelector(`.${className}`);
    expect(div).not.toBeNull();
  });

  it('Render AddressesForm with addressType - Positive flow', async () => {
    const props = {
      testId,
      addressModel: {
        initialValues: {
          addressType: 'RES'
        },
        addressTypes: [
          {
            type: 'RES',
            mandatory: [
              'name',
              'companyName',
              'addressLine1',
              'addressLine2'
            ]
          }
        ]
      }
    };

    const { component } = await expectations(AddressesForm, testId, props, true);

    expect(component).toHaveTextContent(props.addressModel.initialValues.addressType);

    expect(component).toHaveTextContent('form.fullName');
    expect(component).toHaveTextContent('address.companyName');

    expect(component).toHaveTextContent('address.addressLine');

    const addressLine1 = component.querySelector('#addressLine1');
    expect(addressLine1).not.toBeNull();

    const addressLine2 = component.querySelector('#addressLine2');
    expect(addressLine2).not.toBeNull();
  });

  it('Render AddressesForm with addressType - Negative flow', async () => {
    const props = {
      testId,
      addressModel: {
        initialValues: {
          addressType: 'RES'
        },
        addressTypes: [
          {
            type: 'RES',
            mandatory: [
              'name',
              'addressLine1'
            ]
          }
        ]
      }
    };

    const { component } = await expectations(AddressesForm, testId, props, true);

    expect(component).toHaveTextContent(props.addressModel.initialValues.addressType);

    expect(component).toHaveTextContent('form.fullName');
    expect(component).not.toHaveTextContent('address.companyName');

    expect(component).toHaveTextContent('address.addressLine');

    const addressLine1 = component.querySelector('#addressLine1');
    expect(addressLine1).not.toBeNull();

    const addressLine2 = component.querySelector('#addressLine2');
    expect(addressLine2).toBeNull();
  });
});
