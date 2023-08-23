import React from 'react';
import { cleanup } from '@testing-library/react';

import { expectations, mocksWorkaround } from '__tests__/helper';
import { tMock } from '__tests__/mock';

import { stub } from '@/utils/function';

import assignButton from '@/components/Buttons/assign.button';

const testId = 'assignBtn';

describe('@/components/Buttons/assign.button.js', () => {

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);
  beforeEach(tMock);

  mocksWorkaround();

  it('assign.button > All > false', async () => {
    const props = {
      testId,
      loading: { effects: {} },
      className: 'assign.button.all',
      behavior: {
        all: true,
        isAssignedAll: stub
      }
    };

    const { component } = await expectations(assignButton, testId, props);

    expect(component).toHaveClass(props.className);
    expect(component).toHaveTextContent('actions.assignAll');
  });

  it('assign.button > All > true', async () => {
    const props = {
      testId,
      loading: { effects: {} },
      className: 'assign.button.all',
      behavior: {
        all: true,
        isAssignedAll: () => true
      }
    };

    const { component } = await expectations(assignButton, testId, props);

    expect(component).toHaveClass(props.className);
    expect(component).toHaveTextContent('actions.unAssignAll');
  });

  it('assign.button > Single > false', async () => {
    const props = {
      testId,
      loading: { effects: {} },
      className: 'assign.button.single',
      behavior: {
        isAssigned: false
      }
    };

    const { component } = await expectations(assignButton, testId, props);

    expect(component).toHaveClass(props.className);
    expect(component).toHaveTextContent('actions.assign');
  });

  it('assign.button > Single > true', async () => {
    const props = {
      testId,
      loading: { effects: {} },
      className: 'assign.button.single',
      behavior: {
        isAssigned: true
      }
    };

    const { component } = await expectations(assignButton, testId, props);

    expect(component).toHaveClass(props.className);
    expect(component).toHaveTextContent('actions.unAssign');
  });
});
