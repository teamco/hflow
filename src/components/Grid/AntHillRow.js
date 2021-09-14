import React from 'react';
import { Col, Row } from 'antd';

import { calculateColProps, calculatePadding, layout } from 'utils/layout';

const AntHillRow = (props) => {
  const {
    gutter = { xs: 8, sm: 16, md: 24, lg: 32 },
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

  // const [width] = useWindowSize(useState, useLayoutEffect);

  return (
    <Row gutter={layout.rowProps[items] || gutter} {...rest}>
      {_children.filter(item => item).map((child, key) => {
        return (
          <Col span={child.props.span || layout.colsSpan[items]}
               key={key}
               {...calculateColProps(layout.colProps[items], child.props.span)}
               style={calculatePadding(items)}>
            {child}
          </Col>
        );
      })}
    </Row>
  );
};

export default AntHillRow;