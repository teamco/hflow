import { routes } from '../routes';

it('Correct routes are exported', () => {
  expect(routes.map(({ name, path }) => (
      `${name}: ${path}`
  ))).toMatchSnapshot();
});
