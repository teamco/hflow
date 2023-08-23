import React from 'react';
import { NavLink, useIntl, useParams } from '@umijs/max';
import classnames from 'classnames';
import { Can } from '@/utils/auth/can';
import { Tooltip } from 'antd';
import { EyeTwoTone, ProfileTwoTone, ShopTwoTone } from '@ant-design/icons';

import { tsToLocaleDateTime } from '@/utils/timestamp';
import { COLORS } from '@/utils/colors';

import { businessMenu } from '@/pages/users/[user]/businesses/metadata/business.menu';

import styles from '@/pages/users/users.module.less';
import tableStyles from '@/components/Main/Table/table.module.less';

import { t } from '@/utils/i18n';
import DropdownButton from '@/components/Buttons/dropdown.button';

/**
 * @constant
 * @param props
 * @return {JSX.Element|{size: string, columns: [{filterable, dataIndex: string, sortable, title: string, render(*, *): *, key: string},{filterable, dataIndex: string, width: number, sortable, title: string, key: string},{filterable, dataIndex: string, width: number, sortable, title: string, key: string},{dataIndex: string, width: number, title: string, render: (function(*): string), key: string},{width: number, fixed: string, title: string, render(*): null}], width: string, scroll: {x: number}}|null}
 */
export const metadata = (props) => {
  const {
    data,
    user,
    isEdit = true,
    ability,
    loading,
    disabled,
    multiple,
    onDeleteBusiness,
    onHoldBusiness,
    onActivateBusiness
  } = props;

  /**
   * @type {{user, business}}
   */
  const params = useParams();
  const intl = useIntl();

  const menuProps = {
    intl,
    isEdit,
    loading,
    ability,
    params: {
      user: params?.user || user,
      business: params?.business
    },
    onActivateBusiness,
    onHoldBusiness,
    onDeleteBusiness
  };

  return {
    width: '100%',
    size: 'middle',
    scroll: { x: 900 },
    columns: [
      {
        title: t(intl, 'table.name'),
        dataIndex: 'name',
        key: 'name',
        filterable: multiple,
        sortable: multiple,
        render(name, data) {
          return (
              <div className={classnames(styles.nowrap, tableStyles.tdName)}>
                <span>
                  {data.logo ?
                      <img src={data.logo} alt={name}/> :
                      <ShopTwoTone/>
                  }
                </span>
                <NavLink to={`/admin/users/${user}/businesses/${data?.id}`}>
                  <Tooltip title={name}>{name}</Tooltip>
                </NavLink>
              </div>
          );
        }
      },
      {
        title: t(intl, 'auth.email'),
        dataIndex: 'email',
        key: 'email',
        width: 200,
        filterable: multiple,
        sortable: multiple
      },
      {
        title: t(intl, 'business.type'),
        dataIndex: 'businessType',
        width: 200,
        key: 'businessType',
        filterable: multiple,
        sortable: multiple
      },
      {
        title: t(intl, 'form.updatedAt'),
        dataIndex: 'metadata',
        width: 150,
        key: 'metadata.updatedAt',
        render: metadata => tsToLocaleDateTime(metadata.updatedAt)
      },
      {
        title: t(intl, 'table.action'),
        fixed: 'right',
        width: 250,
        render(record) {
          const businessUrl = params?.user ?
              `/admin/users/${params?.user}/businesses/${record.id}` :
              `/admin/businesses/${record.id}`;
          return data.length ? (
              <div className={styles.nowrap}>
                <Can I={'read'} a={'businesses'}>
                  <Tooltip title={t(intl, 'business.actions.show')}>
                    <NavLink to={`${businessUrl}`}>
                      <EyeTwoTone className={tableStyles.action}
                                  twoToneColor={COLORS.success}/>
                    </NavLink>
                  </Tooltip>
                </Can>
                <Can I={'update'} a={'businesses'}>
                  <Tooltip title={t(intl, 'business.actions.edit')}>
                    <NavLink to={`${businessUrl}`}>
                      <ProfileTwoTone className={tableStyles.action}
                                      twoToneColor={COLORS.success}/>
                    </NavLink>
                  </Tooltip>
                </Can>
                <DropdownButton key={'manage'}
                                overlay={businessMenu({ record, ...menuProps })}
                                data-testid={'business-mng'}
                                disabled={disabled}
                                loading={loading}
                                label={t(intl, 'business.actions.manage')}/>
              </div>
          ) : null;
        }
      }
    ]
  };
};
