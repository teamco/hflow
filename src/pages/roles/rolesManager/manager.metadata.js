import React from 'react';
import { Tag, Tooltip } from 'antd';
import { ApiOutlined } from '@ant-design/icons';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { COLORS } from '@/utils/colors';

import NewButton from '@/components/Buttons/basic.button';
import EditButton from '@/components/Buttons/edit.button';
import DropdownButton from '@/components/Buttons/dropdown.button';

import { managerMenu } from '@/pages/roles/rolesManager/manager.menu';

import styles from '@/pages/roles/rolesManager/manager.module.less';

/**
 * @export
 * @param props
 * @return {*}
 */
export const metadata = (props) => {
  const {
    ability,
    component,
    roles = [],
    disabled = false,
    intl,
    loading,
    onDeleteRoles = stub,
    onComponent = stub,
    onAbility = stub
  } = props;

  const menuProps = {
    ability,
    loading,
    intl,
    onDeleteRoles
  };

  const emptyMsg = (role) => t(intl, 'msg.noRoles', { role });

  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: t(intl, 'table.component'),
        dataIndex: 'components',
        className: styles.tableCell,
        width: '50%',
        key: 'components',
        render(componentRoles, userRole, key) {
          return componentRoles?.length ? (
              <div className={styles.connectedTags}>
                <div>
                  <EditButton loading={loading}
                              url={'#'}
                              label={t(intl, 'actions.edit', { type: t(intl, 'panel.manageRoles') })}
                              disabled={disabled}
                              component={component}
                              onClick={e => {
                                e.preventDefault();
                                onComponent(userRole, key);
                              }}/>
                </div>
                <div>
                  {componentRoles?.map(({ role }, idx) => (
                      <Tooltip title={role?.description} key={idx}>
                        <Tag color={COLORS.tags.processing}>{role?.title}</Tag>
                      </Tooltip>
                  ))}
                </div>
              </div>
          ) : (
              <div className={styles.noConnected}>
                {emptyMsg(t(intl, 'panel.componentRoles'))}
                <NewButton loading={loading}
                           url={'#'}
                           disabled={disabled}
                           component={component}
                           icon={<ApiOutlined/>}
                           onClick={() => onComponent(userRole, key)}/>
              </div>
          );
        }
      },
      {
        title: t(intl, 'table.ability'),
        dataIndex: 'abilities',
        className: styles.tableCell,
        key: 'abilities',
        render(abilityRoles, userRole, key) {
          return abilityRoles?.length ? (
              <div className={styles.connectedTags}>
                <div>
                  <EditButton loading={loading}
                              url={'#'}
                              label={t(intl, 'actions.edit', { type: t(intl, 'panel.manageRoles') })}
                              disabled={disabled}
                              component={component}
                              onClick={e => {
                                e.preventDefault();
                                onAbility(userRole, key);
                              }}/>
                </div>
                <div>
                  {abilityRoles?.map(({ role }, idx) => (
                      <Tooltip title={role?.description} key={idx}>
                        <Tag color={COLORS.tags.cyan}>{role?.title}</Tag>
                      </Tooltip>
                  ))}
                </div>
              </div>
          ) : (
              <div className={styles.noConnected}>
                {emptyMsg(t(intl, 'panel.abilityRoles'))}
                <NewButton loading={loading}
                           url={'#'}
                           component={component}
                           disabled={disabled}
                           icon={<ApiOutlined/>}
                           onClick={() => onAbility(userRole, key)}/>
              </div>
          );
        }
      },
      {
        title: t(intl, 'table.action'),
        width: 100,
        className: styles.connectedActions,
        render(record) {
          return (
              <div className={styles.connectedActions}>
                  <DropdownButton key={'manage'}
                                  overlay={managerMenu({ record, ...menuProps })}
                                  data-testid={'roles-mng'}
                                  disabled={disabled}
                                  loading={loading}
                                  label={t(intl, 'actions.manage')}/>
              </div>
          );
        }
      }
    ],
    loading: loading.effects['userModel/query']
  };
};
