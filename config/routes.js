const colors = require('colors');

const { MAIN_ROUTES } = require('./routes/main.routes');

const { NODE_ENV } = process.env;

const isDevelopment = NODE_ENV === 'development';
const mainRoutes = MAIN_ROUTES();

const print = (route) => console.log(colors.green(route.path), '=>', colors.cyan(route.component));

function routesList() {
  console.log('\n\n==== ROUTES =====\n');
  const admins = [];
  const profiles = [];

  mainRoutes.routes.forEach(r => {
    console.log(colors.green(r.path), '=>', colors.cyan(r.component));

    if (r?.routes?.length) {
      r.routes.forEach(route => {
        if (route.path.match(new RegExp('/admin'))) {
          admins.push(route);
        } else if (route.path.match(new RegExp('/profile'))) {
          profiles.push(route)
        } else {
          print(route);
        }
      });
    }
  });

  console.log('\n==== PROFILE\n');
  profiles.forEach(r => print(r));

  console.log('\n==== ADMIN\n');
  admins.forEach(r => print(r));

  console.log('\n==== /ROUTES =====\n\n');
}

isDevelopment && routesList();

module.exports = { routes: [mainRoutes] };
