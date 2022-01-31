import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

/**
 * @export
 * @param Component
 * @param testId
 * @param {boolean} [hooked]
 * @param [props]
 * @return {*}
 */
export const expectations = (Component, testId, props = {}, hooked = false) => {
  const { asFragment } = render(<Component {...props}/>);

  const _cmpReact = hooked ?
      renderHook(() => Component(props)) :
      Component(props);

  const _cmpDom = screen.getByTestId(testId);

  // expect(asFragment()).toMatchSnapshot();
  expect(_cmpReact).toBeDefined();
  expect(_cmpDom).toBeInTheDocument();

  return _cmpDom;
};
