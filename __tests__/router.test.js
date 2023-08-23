import { routes } from '../config/routes';

it('Correct routes are exported', () => {
  expect(routes.map(({ name, path }) => (
      `${name}: ${path}`
  ))).toMatchSnapshot();
});
