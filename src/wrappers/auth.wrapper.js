import { Redirect } from 'umi';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export default (props) => {
  // const { isLogin } = useAuth();
  // if (isLogin) {
  //   return <div>{props.children}</div>;
  // } else {
  //   return <Redirect to='/login' />;
  // }
  return <>{props.children}</>;
}