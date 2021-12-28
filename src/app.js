import { createLogger } from 'redux-logger';
import { message } from 'antd';

/**
 * @export
 * @type {{config}}
 */
export const dva = {
  config: {
    // onAction: createLogger(),
    onError(e) {
      message.error(e.message, 3).then((error) => {
        console.warn(error);
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
