import React from 'react';
import classnames from 'classnames';

import styles from '@/components/Iframe/Iframe.less';

class Iframe extends React.Component {
  render() {
    const {
      label,
      width = '100%',
      height,
      src,
      className,
      frameBorder = '0',
      allowFullScreen = true,
      allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      ...rest
    } = this.props;

    return (
        <iframe label={label}
                className={classnames(styles.iframe, className)}
                width={width}
                height={height}
                src={src}
                frameBorder={frameBorder}
                allow={allow}
                allowFullScreen={allowFullScreen}
                {...rest}/>
    );
  }
}

export default Iframe;
