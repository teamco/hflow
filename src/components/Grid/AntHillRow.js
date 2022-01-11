import { Col, Row } from 'antd';
import React from 'react';

import { layout } from '@/utils/layout';

const AntHillRow = (props) => {
  const {
    gutter = { xs: 8, sm: 16, md: 24, lg: 32 },
    colProps = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8, xxl: 8 },
    children,
    ...rest
  } = props;

  let items = 1;
  let _children;

  if (Array.isArray(children)) {
    items = children.length;
    _children = [...children];
  } else {
    _children = [children];
  }

  return (
      <Row gutter={layout.rowProps || gutter} {...rest}>
        {_children.filter(item => item).map((child, key) => (
            <Col key={key}
                 {...(layout.colProps[items] || colProps)}>
              {child}
            </Col>
        ))}
      </Row>
  );
};

export default AntHillRow;
