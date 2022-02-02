import React from 'react';
import { Form } from 'antd';
import { act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { expectations, mocksWorkaround } from '__tests__/helper';

import Common from '@/components/Common';
import { stub } from '@/utils/function';

describe('@/components/Common/Tags', () => {

  beforeAll(mocksWorkaround);

  jest.mock('react-i18next');

  it('Hooked tags: Collapsed', async () => {
    const { component, render: { queryByText, getByRole } } = expectations(Common.Tags, 'common-tags', {
      t: stub(),
      tags: ['test_1'],
      disabled: false
    }, true, Form);

    // Wait for appearance inside an assertion
    await waitFor(() => {
      expect(queryByText('test_1')).toBeNull();
      expect(component.querySelectorAll('.ant-tag.siteTagDisabled')).toHaveLength(0);
    });
  });

  it('Hooked tags: Expanded', async () => {
    const { component, render: { queryByText } } = expectations(Common.Tags, 'common-tags', {
      t: stub(),
      tags: ['test_2'],
      disabled: false,
      name: 'test_2',
      defaultActiveKey: 'test_2'
    }, true, Form);

    // Wait for appearance inside an assertion
    await waitFor(() => {
      expect(queryByText('test_2')).toBeInTheDocument();
      expect(component.querySelectorAll('.ant-tag.siteTagDisabled')).toHaveLength(0);
    });
  });

  it('Hooked tags: Disabled', async () => {
    const { component, render: { queryByText } } = expectations(Common.Tags, 'common-tags', {
      t: stub(),
      tags: ['test_3'],
      disabled: true,
      name: 'test_3',
      defaultActiveKey: 'test_3'
    }, true, Form);

    // Wait for appearance inside an assertion
    await waitFor(() => {
      expect(queryByText('test_3')).toBeInTheDocument();
      expect(component.querySelectorAll('.ant-tag.siteTagDisabled')).toHaveLength(1);
    });
  });
});
