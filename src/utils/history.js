/**
 * @export
 * @param {{ history, dispatch }} setup
 * @param namespace
 */
export const monitorHistory = (setup, namespace) => {
  const { history, dispatch } = setup;

  history.listen(data => {
    // In case of route replace
    const _location = data.pathname ? { ...data } : { ...data.location };
    Object.keys(_location).forEach(key => {
      if (typeof _location[key] === 'undefined') {
        _location[key] = '';
      }
    });

    const skipOnRoute = ['/admin/logs', '/admin/errors'];
    const skipOnModel = ['userLogModel', 'errorModel'];
    const shouldMonitor = skipOnRoute.indexOf(_location.pathname) === -1 ||
        skipOnModel.indexOf(namespace) === -1;

    shouldMonitor && dispatch({
      type   : 'userLogModel/monitor',
      payload: {
        eventType: 'Navigation',
        createdAt: +(new Date()),
        metadata : _location,
        namespace
      }
    });
  });
};
