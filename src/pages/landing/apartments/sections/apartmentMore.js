import React from 'react';
import { NavLink, useIntl } from '@umijs/max';
import {
  DashboardOutlined,
  EllipsisOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  WarningOutlined
} from '@ant-design/icons';
import classnames from 'classnames';

import { t } from '@/utils/i18n';

import DropdownButton from '@/components/Buttons/dropdown.button';

import landingStyles from '@/layouts/landing/landing.layout.module.less';

export const ApartmentMore = props => {
  const intl = useIntl();

  const {
    hidden,
    loading,
    className
  } = props;

  const moreMenu = () => {
    const dividerItem = { type: 'divider' };

    const basicItems = [
      {
        label: (
            <NavLink to={`/`}>
              {t(intl, hidden ? 'actions.unHide' : 'actions.hide', { type: t(intl, 'apartment') })}
            </NavLink>
        ),
        key: 'hide',
        icon: hidden ? <EyeOutlined/> : <EyeInvisibleOutlined/>
  },
      {
        label: (
            <NavLink to={`/`}>
              {t(intl, 'apartment.ownerDashboard')}
            </NavLink>
        ),
        key: 'ownerDashboard',
        icon: <DashboardOutlined/>
      },
      dividerItem,
      {
        label: (
            <NavLink to={`/`}>
              {t(intl, 'apartment.reportProblem')}
            </NavLink>
        ),
        key: 'reportProblem',
        icon: <WarningOutlined/>
      }
    ];

    return [
      ...basicItems
    ];
  };

  return (
      <div className={className}>
        <DropdownButton key={'more'}
                        placement={'bottomLeft'}
                        overlay={moreMenu()}
                        data-testid={'more'}
                        disabled={false}
                        loading={loading}>
          <EllipsisOutlined key={'more'}
                            className={classnames(landingStyles.prettified, landingStyles.regular)}/>
        </DropdownButton>
      </div>
  );
};