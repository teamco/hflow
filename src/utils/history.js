/**
 * @export
 * @param {{ history, dispatch }} setup
 * @param {string} namespace
 * @param {string} [eventType]
 * @param {number} [duration]
 */
export const monitorHistory = (setup, namespace, eventType = 'Navigation', duration = 0) => {
  const { history, dispatch } = setup;

  return history.listen(data => {
    // In case of route replace
    const location = data.pathname ? { ...data } : { ...data.location };
    Object.keys(location).forEach(key => {
      if (typeof location[key] === 'undefined') {
        location[key] = '';
      }
    });

    const skipOnRoute = ['/admin/logs', '/admin/errors'];
    const skipOnModel = ['userLogModel', 'errorModel'];
    const shouldMonitor = skipOnRoute.indexOf(location.pathname) === -1 ||
        skipOnModel.indexOf(namespace) === -1;

    shouldMonitor && dispatch({
      type: 'userLogModel/monitor',
      payload: {
        eventType,
        location,
        namespace,
        duration
      }
    });
  });
};
