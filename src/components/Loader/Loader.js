import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { Spin } from 'antd';

import './loader.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Loader = (props) => {
  const [t] = useTranslation();
  const { contained, fullScreen, text = 'loading', page, sider } = props;
  const spinning = 'spinning' in props ? props.spinning : true;

  const loaderClassNames = classnames('loader', {
    ['hidden']: !spinning,
    ['fullScreen']: fullScreen,
    ['contained']: contained,
    ['page']: page,
    ['sider']: sider
  });

  return (
      <div className={loaderClassNames}>
        <div className={'wrapper'}>
          <Spin spinning={spinning}/>
        </div>
      </div>
  );
};

Loader.propTypes = {
  spinning: PropTypes.bool,
  fullScreen: PropTypes.bool
};

Loader.displayName = 'Loader';

export default Loader;
