import * as umi from '@umijs/max';
import { firebaseAppAuth } from '@/services/firebase.service';

export default (props = {}) => {
  const { Navigate, Outlet, useLocation } = umi;
  const { currentUser } = firebaseAppAuth;

  const { pathname } = useLocation();

  let component = <Outlet context={props}/>;

  if (currentUser && currentUser.emailVerified) {

    // TODO (teamco): Make a validation isAdmin
  } else {
    component = <Navigate to={`/login?ref=${decodeURIComponent(pathname)}`}/>;
  }

  return component;
}
