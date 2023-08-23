import React, { useRef, useState } from 'react';
import { useIntl } from '@umijs/max';
import { Collapse } from 'antd';
import { OrderedListOutlined, PartitionOutlined } from '@ant-design/icons';

import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';
import { t } from '@/utils/i18n';
import { fromForm } from '@/utils/object';
import { updateRoles, handleNewRow, isDisabledNew } from '@/utils/roles';

import Main from '@/components/Main';
import Page from '@/components/Page/page.connect';
import NewButton from '@/components/Buttons/basic.button';
import { SubHeader } from '@/components/Page/page.subheader';

import { metadata } from '@/pages/roles/rolesManager/manager.metadata';
import { TransferRoles } from '@/pages/roles/rolesManager/transfer.roles';

import styles from '@/pages/roles/rolesManager/manager.module.less';

const { Table, Info } = Main;

const MODEL_NAME = 'roleModel';

export const RoleManager = props => {
  const intl = useIntl();
  const refTarget = useRef(null);

  const {
    authModel,
    roleModel,
    loading,
    onGetUserRoles,
    onGetComponentRoles,
    onGetAbilityRoles,
    onUpdateTouched,
    onQuery,
    onSave
  } = props;

  const { ability } = authModel;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [roles, setRoles] = useState(false);
  const [title, setTitle] = useState(false);
  const [roleFor, setRoleFor] = useState({});

  const [activeKey, setActiveKey] = useState('0');
  const [dataSource, setDataSource] = useState({});

  const [targetComponents, setTargetComponents] = useState([]);
  const [targetAbilities, setTargetAbilities] = useState([]);

  const componentRolesLabel = t(intl, 'panel.componentRoles');
  const abilityRolesLabel = t(intl, 'panel.abilityRoles');

  const component = 'role.manager';

  const {
    touched,
    isEdit,
    entityForm,
    abilityRoles,
    userRoles,
    componentRoles,
    rolesManager
  } = roleModel;

  const {
    ableFor,
    disabled,
    canUpdate,
    canDelete,
    canCreate,
    canExport,
    canRead
  } = componentAbilities(authModel, component, isEdit);

  effectHook(() => {
    if (canUpdate && canRead) {
      onGetUserRoles();
      onGetComponentRoles();
      onGetAbilityRoles();
      onQuery();
    }
  }, [canUpdate, canRead]);

  effectHook(() => {
    onUpdateTouched(touched);
  }, [touched]);

  effectHook(() => {
    setDataSource(rolesManager);
  }, [rolesManager]);

  effectHook(() => {
    const row = roleFor.row;

    updateRoles({
      row,
      roleFor,
      dataSource,
      setDataSource,
      permissions: targetComponents
    });

  }, [targetComponents]);

  effectHook(() => {
    const row = roleFor.row;

    updateRoles({
      row,
      roleFor,
      dataSource,
      setDataSource,
      permissions: targetAbilities,
      secondaryRole: 'components',
      primaryRole: 'abilities'
    });

  }, [targetAbilities]);

  const showModal = (_title, _permission, _userRole, row, activeType) => {
    setTitle(_title);
    setRoles(_permission?.roles);
    setRoleFor({ role: _userRole, row, activeType });

    setIsModalOpen(true);
  };

  const handleOk = (title, data, targetKeys, roleFor) => {
    const _rules = targetKeys.map(key => ({
      metadata: roleFor,
      roles: data[key]
    }));

    if (title === componentRolesLabel) {
      setTargetComponents(_rules);
    } else if (title === abilityRolesLabel) {
      setTargetAbilities(_rules);
    }

    handleCancel();

    onUpdateTouched(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const transferProps = {
    loading,
    disabled,
    isModalOpen,
    component,
    roles,
    title,
    roleFor,
    spinOn: [],
    handleOk,
    handleCancel
  };

  const abilityProps = {
    loading,
    ability,
    disabled,
    component,
    onComponent: (userRole, row) => showModal(componentRolesLabel,
        componentRoles, userRole, row, 'components'),
    onAbility: (userRole, row) => showModal(abilityRolesLabel, abilityRoles,
        userRole, row, 'abilities')
  };

  const subTitle = (
      <>
        <PartitionOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'panel.userRoles')}
      </>
  );

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    component,
    actions: {
      exportBtn: { refTarget, data: dataSource, disabled: !canExport },
      saveBtn: {
        ableFor,
        disabled,
        component,
        touched,
        canType: 'update',
        spinOn: [],
        onClick() {
          onSave(dataSource);
        }
      },
      newBtn: false,
      closeBtn: false,
      menuBtn: false
    }
  };

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const infoProps = {
    isEdit,
    touched,
    info: {
      createdBy,
      updatedBy,
      createdAt,
      updatedAt
    }
  };

  const panelBtns = (idx) => {
    const _roleFor = userRoles.roles[idx];
    let isDisabled = isDisabledNew(dataSource, _roleFor);

    return (
        <NewButton loading={loading}
                   url={'#'}
                   disabled={isDisabled}
                   icon={<OrderedListOutlined/>}
                   title={t(intl, 'table.addRow')}
                   onClick={e => {
                     onUpdateTouched(true);
                     handleNewRow(e, dataSource, _roleFor, setDataSource);
                   }}/>
    );
  };

  const collapseItems = [...(userRoles?.roles || [])]?.map((tRole, idx) => ({
    label: tRole,
    key: idx,
    extra: activeKey === idx.toString() && panelBtns(idx),
    children: (
        <Table data={dataSource[tRole]}
               bordered
               {...metadata({
                 roles: dataSource[tRole],
                 intl,
                 ...abilityProps
               })} />
    )
  }));

  return (
      <Page spinEffects={[`${MODEL_NAME}/query`]}
            ableFor={ableFor}
            touched={!disabled && touched}
            component={component}>
        <SubHeader {...pageHeaderProps}/>
        <div className={styles.rolesManager} ref={refTarget}>
          <Collapse activeKey={[activeKey]}
                    items={collapseItems}
                    onChange={([, key]) => {
                      key && setActiveKey(key);
                    }}/>
          <div className={styles.info}>
            <Info {...infoProps} />
          </div>
          <TransferRoles {...transferProps} />
        </div>
      </Page>
  );
};