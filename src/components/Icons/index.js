import Icon from '@ant-design/icons';

import {HeartSvg} from './heart.svg';
import {PandaSvg} from './panda.svg';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const HeartIcon = props => <Icon component={HeartSvg} {...props} />;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const PandaIcon = props => <Icon component={PandaSvg} {...props} />;

export default {
  HeartIcon,
  PandaIcon
};
