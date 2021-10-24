const {domain = 'localhost', port = 8003, protocol = 'http'} = process.env.REMOTE_SERVER || {};

/**
 * @export
 * @type {{protocol: string, port: number, domain: string}}
 */
export const REMOTE_SERVER = {
  domain,
  port,
  protocol
};
