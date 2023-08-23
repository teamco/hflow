import React from 'react';
import { useParams, useIntl } from '@umijs/max';
import { Form } from 'antd';
import { TrademarkOutlined } from '@ant-design/icons';

import Page from '@/components/Page/page.connect';
import { SubHeader } from '@/components/Page/page.subheader';

import { fromForm } from '@/utils/object';
import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';
import { t } from '@/utils/i18n';

import { businessMenu } from '@/pages/users/[user]/businesses/metadata/business.menu';

import styles from '@/pages/users/[user]/businesses/businesses.module.less';
import userStyles from '@/pages/users/users.module.less';

export const businessShow = (props) => {
  const [formRef] = Form.useForm();
  const intl = useIntl();

  const {
    authModel,
    businessModel,
    loading,
    testId,
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
  const MODEL_NAME = 'businessModel';
  const {
    ableFor,
    disabled,
    canRead
  } = componentAbilities(authModel, component, isEdit);

  effectHook(() => {
    if (canRead) {
      onEditBusiness(params, false);
    }
  }, [
    authModel.user,
    params.user,
    canRead
  ]);

  const businessInfoProps = {
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
        {t(intl, 'business.actions.show')}
      </>
  );

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    isEdit,
    component,
    actions: {
      exportBtn: false,
      newBtn: false,
      saveBtn: false,
      closeBtn: { onClose: () => onClose(params.user) },
      menuBtn: {
        selectedEntity: { id: params?.business },
        label: t(intl, 'business.actions.manage'),
        menuProps: {
          ...menuProps,
          isEdit,
          params,
          intl,
          onDeleteBusiness
        },
        dropDownMenu: businessMenu,
        testId: `${testId}.menuBtn`
      }
    }
  };

  return (
      <Page className={userStyles.users}
            component={component}
            touched={!disabled && touched}
            spinEffects={[
              'businessModel/editBusiness'
            ]}>
        <div className={styles.businessWrapper}>
          <SubHeader {...pageHeaderProps}/>
        </div>
      </Page>
  );
};
