import { message } from 'antd';

/**
 * @export
 * @type {{config}}
 */
export const dva = {
  config: {
    //onAction: createLogger(),
    onError(e) {
      message.error(e.message, 3).then(() => {
      });
    }
  }
};

export function onRouteChange(router) {
  // const { matchedRoutes } = router;
  // const dispatch = useDispatch();
  // dispatch({
  //   type: 'appModel/updateReferrer',
  //   payload: { referrer: document.referrer }
  // });
}
