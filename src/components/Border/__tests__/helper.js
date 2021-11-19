import React from 'react';
import { render, screen } from '@testing-library/react';

import Border from '../index';

/**
 * @export
 * @param props
 * @return {*}
 */
export const expectations = (props) => {
  const { asFragment } = render(
      <Border {...props}/>
  );

  expect(asFragment()).toMatchSnapshot();

  const _borderReact = Border(props);

  expect(_borderReact).toBeDefined();
  expect(_borderReact.type).toEqual('div');

  const _borderDom = screen.getByTestId('border');

  expect(_borderDom).toBeInTheDocument();

  return _borderDom;
};
