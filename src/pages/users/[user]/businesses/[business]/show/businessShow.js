import React from 'react';
import { useParams } from 'umi';
import { Button, Dropdown, Form, PageHeader } from 'antd';
import { DownOutlined, SettingOutlined, TrademarkOutlined } from '@ant-design/icons';

import Main from '@/components/Main';
import Page from '@/components/Page';
import BusinessMenu from '@/pages/users/[user]/businesses/metadata/business.menu';

import { fromForm } from '@/utils/object';
import { isNew } from '@/services/common.service';

import styles from '@/pages/users/[user]/businesses/businesses.module.less';
import menuStyles from '@/components/menu.less';
import userStyles from '@/pages/users/users.module.less';
import { effectHook } from '@/utils/hooks';

const { Info } = Main;

export const businessShow = (props) => {
  const [formRef] = Form.useForm();

  const {
    t,
    authModel,
    businessModel,
    loading,
    onEditBusiness,
    onActivateBusiness,
    onHoldBusiness,
    onDeleteBusiness,
    onClose
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

  const { ability } = authModel;
  const component = 'businesses';
  const disabled = ability.cannot('update', component);
  const read = ability.can('read', component);

  effectHook(() => {
    if (read) {
      onEditBusiness(params, false);
    }
  }, [
    authModel.user,
    params.user,
    read
  ]);

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
      uploadedFiles
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
      uploadedFiles
    }
  };

  const addressProps = {
    t,
    formRef,
    disabled,
    countries,
    states
  };

  const tagsProps = {
    t,
    formRef,
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
    isEdit,
    loading,
    ability,
    params: {
      user: params?.user || authModel.user?.id,
      business: params?.business
    },
    onActivateBusiness,
    onHoldBusiness,
    onDeleteBusiness
  };

  const subTitle = (
      <>
        <TrademarkOutlined style={{ marginRight: 10 }}/>
        {t('actions:show', { type: t('business') })}
      </>
  );

  return (
      <Page className={userStyles.users}
            component={component}
            touched={!disabled && touched}
            spinEffects={[
              'businessModel/editBusiness'
            ]}>
        <div className={styles.businessWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Button key={'close'}
                                size={'small'}
                                onClick={() => onClose(params.user)}>
                          {t('actions:close')}
                        </Button>,
                        <Dropdown overlay={<BusinessMenu record={{ id: params?.business }} {...menuProps} />}
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
        </div>
      </Page>
  );
};
