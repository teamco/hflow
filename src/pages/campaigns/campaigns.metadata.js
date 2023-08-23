import React from 'react';
import { NavLink, useIntl } from '@umijs/max';

import DropdownButton from '@/components/Buttons/dropdown.button';
import { campaignMenu } from './metadata/campaigns.menu';

import { t } from '@/utils/i18n';

import styles from './campaigns.module.less';

/**
 * @export
 * @param props
 * @return {*}
 */
export const metadata = (props) => {
  const intl = useIntl();

  const {
    ability,
    loading,
    disabled,
    canUpdate,
    canDelete,
    onDeleteCampaign
  } = props;

  const menuProps = { intl, loading, ability, onDeleteCampaign, canUpdate, canDelete };

  return {
    width: '100%',
    size: 'middle',
    scroll: { x: 600 },
    columns: [
      {
        title: t(intl, 'campaigns.title'),
        dataIndex: 'translateKeys',
        key: 'translateKeys',
        render(translateKeys, record) {
          return (
              <NavLink to={`/admin/campaigns/${record?.id}`}>
                {/*t(intl, translateKeys.title })*/}
                {translateKeys.title}
              </NavLink>
          );
        }
      },
      {
        title: t(intl, 'campaigns.startAt'),
        dataIndex: 'saleInfo',
        key: 'saleInfo',
        render(saleInfo, record) {
          return (
              <>
                {saleInfo.startedAt}
              </>
          );
        }
      },
      {
        title: t(intl, 'campaigns.expiredAt'),
        dataIndex: 'saleInfo',
        key: 'saleInfo',
        render(saleInfo) {
          return saleInfo.expiredAt;
        }
      },
      {
        title: t(intl, 'table.action'),
        align: 'center',
        fixed: 'right',
        width: 200,
        render(record) {
          return (
              <div className={styles.nowrap}>
                <DropdownButton key={'manage'}
                                overlay={campaignMenu({ record, ...menuProps })}
                                data-testid={'campaign-mng'}
                                disabled={disabled}
                                loading={loading}
                                label={t(intl, 'campaigns.actions.manage')}/>
              </div>
          );
        }
      }
    ]
  };
};
