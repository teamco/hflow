import React from 'react';
import { NavLink, useIntl } from '@umijs/max';

import DropdownButton from '@/components/Buttons/dropdown.button';
import { propertyMenu } from './metadata/properties.menu';

import { t } from '@/utils/i18n';

import styles from './properties.module.less';

/**
 * @export
 * @param ability
 * @param loading
 * @param disabled
 * @param onDeleteCampaign
 * @return {*}
 */
export const metadata = ({ ability, loading, disabled, onDeleteCampaign }) => {
  const intl = useIntl();

  const menuProps = { intl, loading, ability, onDeleteCampaign };

  return {
    width: '100%',
    size: 'middle',
    scroll: { x: 600 },
    columns: [
      {
        title: t(intl, 'properties.name'),
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
                                overlay={propertyMenu({ record, ...menuProps })}
                                data-testid={'campaign-mng'}
                                disabled={disabled}
                                loading={loading}
                                label={t(intl, 'properties.actions.manage')}/>
              </div>
          );
        }
      }
    ]
  };
};
