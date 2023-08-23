import React from 'react';
import { Tabs } from 'antd';

const GenericTabs = props => {
  const {
    children,
    tabs,
    defaultActiveKey
  } = props;

  const _children = Array.isArray(children) ?
      [...children] : [children];

  const items = _children.map((child, idx) => ({
    label: tabs[idx],
    key: idx,
    children: child
  }));

  return (
      <Tabs defaultActiveKey={defaultActiveKey} items={items}/>
  );
};

export default GenericTabs;
