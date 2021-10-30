import React from 'react';
import {NavLink} from 'umi';
import {Menu, Popconfirm} from 'antd';
import {
  DeleteOutlined,
  FileDoneOutlined,
  PauseCircleOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import {withTranslation} from 'react-i18next';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const BusinessMenu = props => {
  const {
    t,
    isEdit,
    loading,
    params,
    record,
    onActivateBusiness,
    onHoldBusiness,
    onDeleteBusiness
  } = props;

  return (
      <Menu>
        <Menu.Item key={'users'}
                   loading={loading.effects['businessModel/manageBusinessUsers']}
                   disabled={!isEdit}
                   icon={<UsergroupAddOutlined/>}>
          <NavLink to={`/admin/users/${params.user}/businesses/${record.id}/users`}>
            {t('actions:manage', {type: t('auth:users')})}
          </NavLink>
        </Menu.Item>
        <Menu.Item key={'activate'}
                   loading={loading.effects['businessModel/activateBusiness']}
                   disabled={!isEdit}
                   icon={<FileDoneOutlined/>}
                   onClick={() => onActivateBusiness(params.business)}>
          {t('actions:activate')}
        </Menu.Item>
        <Menu.Item key={'hold'}
                   loading={loading.effects['businessModel/holdBusiness']}
                   disabled={!isEdit}
                   icon={<PauseCircleOutlined/>}
                   onClick={() => onHoldBusiness(params.business)}>
          {t('actions:hold')}
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key={'delete'}
                   danger
                   loading={loading.effects['businessModel/prepareToSave']}
                   disabled={!isEdit}
                   icon={<DeleteOutlined/>}>
          <Popconfirm title={t('msg:deleteConfirm', {instance: t('business')})}
                      placement={'topRight'}
                      onConfirm={() => onDeleteBusiness(params.business)}>
            {t('actions:delete')}
          </Popconfirm>
        </Menu.Item>
      </Menu>
  );
};

export default withTranslation()(BusinessMenu);
