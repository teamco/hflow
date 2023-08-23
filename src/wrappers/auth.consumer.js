import * as umi from '@umijs/max';
import { firebaseAppAuth } from '@/services/firebase.service';

export default (props = {}) => {
  const { Navigate, Outlet, useLocation } = umi;
  const { currentUser } = firebaseAppAuth;

  const { pathname } = useLocation();

  const isLoginPage = pathname.match('login');
  const isRegisterPage = pathname.match('register');

  let component = <Outlet context={props}/>;

  if (currentUser && currentUser.emailVerified) {
    if (isLoginPage) {
      component = <Navigate to="/profile"/>;
    }
  } else if (isLoginPage || isRegisterPage) {
    // TODO (teamco): Do nothing.
  } else {
    component = <Navigate to={`/login?ref=${decodeURIComponent(pathname)}`}/>;
  }

  return component;
}
