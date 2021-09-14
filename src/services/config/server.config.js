const { domain, port, protocol } = process.env.REMOTE_SERVER || {};

/**
 * @export
 * @type {{protocol: string, port: number, domain: string}}
 */
export const REMOTE_SERVER = {
  domain: domain || 'localhost',
  port: port || 8000,
  protocol: protocol || 'http'
};
