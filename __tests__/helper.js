import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

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
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
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
 * @return {*}
 */
export const expectations = (Component, testId, props = {}, hooked = false, WrappedBy = null) => {
  const _render = WrappedBy ?
      render(<WrappedBy><Component {...props}/></WrappedBy>) :
      render(<Component {...props}/>);

  const _cmpReact = hooked ?
      renderHook(() => Component(props)) :
      Component(props);

  const _cmpDom = screen.getByTestId(testId);

  // expect(_render.asFragment()).toMatchSnapshot();
  expect(_cmpReact).toBeDefined();
  expect(_cmpDom).toBeInTheDocument();

  return { component: _cmpDom, render: _render };
};

