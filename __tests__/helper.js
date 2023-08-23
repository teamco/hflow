import React from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { queryHelpers } from '@testing-library/dom';

import '@testing-library/jest-dom';

/**
 * The Jest documentation now has an "official" workaround.
 * @link https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 * @export
 */
export const mocksWorkaround = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),     // Deprecated
      removeListener: jest.fn(),  // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  });
};

/**
 * @export
 * @param Component
 * @param testId
 * @param {boolean} [hooked]
 * @param [props]
 * @param [WrappedBy]
 * @param {boolean} [snapshot]
 * @return {*}
 */
export const expectations = async (
    Component,
    testId,
    props = {},
    hooked = false,
    WrappedBy = null,
    snapshot = false
) => {

  const _render = await act(async () => {
    return WrappedBy ?
        render(<WrappedBy><Component {...props}/></WrappedBy>) :
        render(<Component {...props}/>);
  });

  const _cmpReact = hooked ?
      renderHook(() => Component(props)) :
      Component(props);

  const _cmpDom = await waitFor(() => screen?.queryByTestId(testId));

  snapshot && expect(_render.asFragment()).toMatchSnapshot();
  expect(_cmpReact).toBeDefined();
  expect(_cmpDom).toBeInTheDocument();

  return { component: _cmpDom, render: _render };
};

export const queryByTestId = queryHelpers.queryByAttribute.bind(
    null,
    'data-testid'
);

export const queryAllByTestId = queryHelpers.queryAllByAttribute.bind(
    null,
    'data-testid'
);

export function getAllByTestId(container, id, ...rest) {
  const els = queryAllByTestId(container, id, ...rest);
  if (!els.length) {
    throw queryHelpers.getElementError(
        `Unable to find an element by: [data-testid="${id}"]`,
        container
    );
  }
  return els;
}

export function getByTestId(container, id, ...rest) {
  // result >= 1
  const result = getAllByTestId(container, id, ...rest);
  if (result.length > 1) {
    throw queryHelpers.getElementError(
        `Found multiple elements with the [data-testid="${id}"]`,
        container
    );
  }
  return result[0];
}
