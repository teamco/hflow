import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

/**
 * @export
 * @param Component
 * @param props
 * @param testId
 * @return {*}
 */
export const expectations = (Component, testId, props = {}) => {
  const { asFragment } = render(
      <Component {...props}/>
  );

  const _cmpReact = Component(props);
  const _cmpDom = screen.getByTestId(testId);

  expect(asFragment()).toMatchSnapshot();
  expect(_cmpReact).toBeDefined();
  expect(_cmpDom).toBeInTheDocument();

  return _cmpDom;
};
