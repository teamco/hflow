import { terminal } from '@umijs/max';

/**
 * @link https://unicode.org/emoji/charts/full-emoji-list.html
 * @type {{warn: number, log: number, error: number, info: number}}
 */
const ICONS = {
  log: 0x1F7E2,
  info: 0x1F535,
  error: 0x1F534,
  warn: 0x1F7E1
};

/**
 * @export
 * @param type
 * @param args
 * @param [echo]
 */
export const logger = ({ type = 'info', echo = terminal, ...args }) => {
  const icon = String.fromCodePoint(ICONS[type]);
  echo[type] && echo[type](icon, args);
};
