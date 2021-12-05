import React, { useEffect } from 'react';
import Page from 'components/Page';
import userStyles from 'pages/users/users.module.less';
import { useParams } from 'umi';
import { Button, Dropdown, Form, PageHeader } from 'antd';
import { DownOutlined, SettingOutlined, TrademarkOutlined } from '@ant-design/icons';

import Main from 'components/Main';

import { BusinessAddress } from 'pages/users/[user]/businesses/[business]/form/business.address';
import { BusinessInfo } from 'pages/users/[user]/businesses/[business]/form/business.info';
import { BusinessLicense } from 'pages/users/[user]/businesses/[business]/form/business.license';
import { BusinessTags } from 'pages/users/[user]/businesses/[business]/form/business.tags';
import BusinessMenu from 'pages/users/[user]/businesses/metadata/business.menu';

import SaveButton from 'components/Buttons/save.button';

import { fromForm } from 'utils/object';
import { isLoading } from 'utils/state';

import styles from 'pages/users/[user]/businesses/businesses.module.less';
import menuStyles from 'components/menu.less';

const { Info } = Main;

export const businessEdit = (props) => {
  const [formRef] = Form.useForm();

  const {
    t,
    authModel,
    businessModel,
    simpleModel,
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
    selectedBusiness,
    uploadedFiles,
    tags,
    isEdit,
    touched
  } = businessModel;

  const { ability } = authModel;
  const component = 'businesses';
  const disabled = ability.cannot('update', component);
  const canUpdate = ability.can('update', component);

  useEffect(() => {
    canUpdate && onEditBusiness(params);
  }, [authModel.user, params.user, canUpdate]);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    onSave(formValues, params);
  };

  const businessInfoProps = {
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

  const infoProps = {
    t,
    isEdit,
    touched,
    info: {
      createdBy,
      updatedBy,
      createdAt,
      updatedAt
    }
  };

  const menuProps = {
    ability,
    isEdit,
    loading,
    params,
    onActivateBusiness,
    onHoldBusiness,
    onDeleteBusiness
  };

  const subTitle = (
      <>
        <TrademarkOutlined style={{ marginRight: 10 }}/>
        {isEdit ?
            t('actions:edit', { type: t('business') }) :
            t('actions:addNew', { type: t('business') })
        }
      </>
  );

  return (
      <Page className={userStyles.users}
            component={component}
            touched={!disabled && touched}
            spinEffects={[
              'simpleModel/query',
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
                                        loading.effects['simpleModel/query'] ||
                                        loading.effects['businessModel/query'] ||
                                        loading.effects['businessModel/prepareToSave']
                                    }/>,
                        <Dropdown overlay={<BusinessMenu record={selectedBusiness} {...menuProps} />}
                                  disabled={!isEdit || disabled}
                                  trigger={['click']}
                                  overlayClassName={menuStyles.customActionMenu}
                                  key={'custom'}>
                          <Button size={'small'}
                                  icon={<SettingOutlined/>}
                                  className={menuStyles.customAction}>
                            {t('actions:manage', { type: t('business') })} <DownOutlined/>
                          </Button>
                        </Dropdown>
                      ]}/>
          <Form layout={'vertical'}
                className={styles.form}
                form={formRef}
                fields={entityForm}
                scrollToFirstError={true}
                onFinish={onFinish}
                initialValues={{
                  country: selectedCountry
                }}
                onFieldsChange={onFieldsChange}>
            <BusinessInfo {...businessInfoProps} />
            <BusinessAddress {...addressProps} />
            <BusinessLicense {...licenseProps} />
            <BusinessTags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
