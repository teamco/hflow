import React, {useEffect} from 'react';
import Page from 'components/Page';
import userStyles from 'pages/users/users.module.less';
import {useParams, NavLink} from 'umi';
import {Button, Form, PageHeader, Menu, Dropdown} from 'antd';
import {
  TrademarkOutlined,
  DeleteOutlined,
  DownOutlined,
  FileDoneOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';

import Main from 'components/Main';

import {BusinessAddress} from 'pages/users/[user]/businesses/[business]/form/business.address';
import {BusinessInfo} from 'pages/users/[user]/businesses/[business]/form/business.info';
import {BusinessLicense} from 'pages/users/[user]/businesses/[business]/form/business.license';
import {BusinessTags} from 'pages/users/[user]/businesses/[business]/form/business.tags';

import SaveButton from 'components/Buttons/save.button';

import {fromForm} from 'utils/object';
import {isLoading} from 'utils/state';
import {isNew} from 'services/common.service';

import styles from 'pages/users/[user]/businesses/businesses.module.less';

const {Info} = Main;

export const businessEdit = (props) => {
  const [formRef] = Form.useForm();

  const {
    t,
    authModel,
    businessModel,
    loading,
    onEditBusiness,
    onFieldsChange,
    onUpdateTags,
    onSave,
    onClose,
    onGetBusinesses,
    onDeleteBusiness,
    onHoldBusiness,
    onActivateBusiness,
    onManageBusinessUsers,
    onFileRemove,
    onFileChange,
    onHandleStates
  } = props;

  /**
   * @type {{user, business}}
   */
  const params = useParams();

  const {
    entityForm,
    countries,
    businessTypes,
    states,
    selectedCountry,
    uploadedFiles,
    tags,
    isEdit,
    touched
  } = businessModel;

  const {ability} = authModel;
  const component = 'businesses';
  const disabled = ability.cannot('update', component);
  const update = ability.can('update', component);

  useEffect(() => {
    if (update) {
      onEditBusiness(params);
    } else if (isNew(params.business)) {
      onEditBusiness(params);
    }
  }, [
    authModel.user,
    update
  ]);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    onSave(formValues, params);
  };

  const infoProps = {
    t,
    formRef,
    disabled,
    businessTypes,
    uploadLogo: {
      field: 'logo',
      allowed: [
        'image/png',
        'image/jpeg'
      ],
      type: '*',
      ui: 'dragger',
      uploadedFiles,
      onFileRemove,
      onFileChange
    }
  };

  const licenseProps = {
    t,
    formRef,
    disabled,
    uploadLicense: {
      field: 'license',
      allowed: [
        'application/pdf',
        'application/docx',
        'image/png',
        'image/jpeg'
      ],
      type: '*',
      ui: 'dragger',
      uploadedFiles,
      onFileRemove,
      onFileChange
    }
  };

  const addressProps = {
    t,
    formRef,
    disabled,
    countries,
    states,
    onHandleStates
  };

  const tagsProps = {
    t,
    formRef,
    onUpdateTags,
    disabled,
    tags
  };

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const detailProps = {
    t,
    isEdit,
    info: {
      createdBy,
      updatedBy,
      createdAt,
      updatedAt
    }
  };

  const subTitle = (
      <>
        <TrademarkOutlined style={{marginRight: 10}}/>
        {isEdit ?
            t('actions:edit', {type: t('business')}) :
            t('actions:addNew', {type: t('business')})
        }
      </>
  );

  const menu = (
      <Menu>
        <Menu.Item key={'users'}
                   loading={loading.effects['businessModel/manageBusinessUsers']}
                   disabled={!isEdit}
                   icon={<UsergroupAddOutlined/>}>
          <NavLink to={`/admin/users/${params.user}/businesses/${params.business}/users`}>
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
        <Menu.Item key={'delete'}
                   danger
                   loading={loading.effects['businessModel/prepareToSave']}
                   disabled={!isEdit}
                   icon={<DeleteOutlined/>}
                   onClick={() => onDeleteBusiness(params.business)}>
          {t('actions:delete')}
        </Menu.Item>
      </Menu>
  );

  return (
      <Page className={userStyles.users}
            component={component}
            touched={!disabled && touched}
            spinEffects={[
              'businessModel/editBusiness',
              'businessModel/prepareToSave'
            ]}>
        <div className={styles.businessWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Button key={'close'}
                                size={'small'}
                                loading={isLoading(loading.effects['businessModel/prepareToSave'])}
                                onClick={() => onClose(params.user)}>
                          {t('actions:close')}
                        </Button>,
                        <SaveButton key={'save'}
                                    isEdit={isEdit}
                                    disabled={!touched || disabled}
                                    formRef={formRef}
                                    loading={
                                      loading.effects['businessModel/query'] ||
                                      loading.effects['businessModel/prepareToSave']
                                    }/>,
                        <Dropdown overlay={menu}
                                  disabled={!isEdit || disabled}
                                  overlayClassName={styles.customActionMenu}
                                  key={'custom'}>
                          <Button size={'small'}
                                  icon={<SettingOutlined/>}
                                  className={styles.customAction}>
                            {t('actions:manage', {type: t('business')})} <DownOutlined/>
                          </Button>
                        </Dropdown>
                      ]}/>
          <Form layout={'vertical'}
                className={styles.form}
                form={formRef}
                fields={entityForm}
                onFinish={onFinish}
                initialValues={{
                  country: selectedCountry
                }}
                onFieldsChange={onFieldsChange}>
            <BusinessInfo {...infoProps} />
            <BusinessAddress {...addressProps} />
            <BusinessLicense {...licenseProps} />
            <BusinessTags {...tagsProps} />
            <Info {...detailProps} />
          </Form>
        </div>
      </Page>
  );
};
