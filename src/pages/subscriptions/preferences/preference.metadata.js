import React, { useEffect } from 'react';
import { NavLink } from 'umi';
import {
  ContactsTwoTone,
  DownOutlined,
  PauseCircleTwoTone,
  PlayCircleTwoTone,
  SettingOutlined
} from '@ant-design/icons';

import { Avatar, Button, Dropdown, Tag, Tooltip } from 'antd';

import classnames from 'classnames';
import { tsToLocaleDateTime } from 'utils/timestamp';
import { COLORS } from 'utils/colors';
import { BRANDS } from 'utils/brands';

import styles from 'pages/users/users.module.less';
import tableStyles from 'components/Main/Table/table.module.less';
import menuStyles from 'components/menu.less';

/**
 * @export
 * @param t
 * @param ability
 * @param data
 * @param loading
 * @param multiple
 * @return {*}
 */
export const metadata = ({
  t,
  ability,
  loading
}) => {

  useEffect(() => {
  }, []);

  const menuProps = {
    loading,
    ability
  };

  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: t('preference:name'),
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: t('preference:description'),
        dataIndex: 'description',
        key: 'description'
      },
      {
        title: t('preference:status'),
        dataIndex: 'status',
        key: 'status'
      }
    ]
  };
};
