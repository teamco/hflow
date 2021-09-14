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

    const skipOn = ['/admin/logs', '/admin/errors'];
    const shouldMonitor = skipOn.indexOf(_location.pathname) === -1;

    shouldMonitor && dispatch({
      type: 'userLogModel/monitor',
      payload: {
        eventType: 'Navigation',
        createdAt: +(new Date()),
        metadata: _location,
        namespace
      }
    });
  });
};