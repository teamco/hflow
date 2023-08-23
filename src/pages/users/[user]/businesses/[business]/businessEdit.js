import React from 'react';
import { useIntl, useParams } from '@umijs/max';
import { Form } from 'antd';
import { TrademarkOutlined } from '@ant-design/icons';

import Main from '@/components/Main';

import { BusinessAddress } from '@/pages/users/[user]/businesses/[business]/form/business.address';
import { BusinessInfo } from '@/pages/users/[user]/businesses/[business]/form/business.info';
import { BusinessLicense } from '@/pages/users/[user]/businesses/[business]/form/business.license';
import { BusinessTags } from '@/pages/users/[user]/businesses/[business]/form/business.tags';
import { businessMenu } from '@/pages/users/[user]/businesses/metadata/business.menu';

import Page from '@/components/Page/page.connect';
import { SubHeader } from '@/components/Page/page.subheader';
import { formProps } from '@/components/Form/formProps';
import { validateFieldsOnLoad } from '@/components/Form';

import { t } from '@/utils/i18n';
import { fromForm } from '@/utils/object';
import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';

import styles from '@/pages/users/[user]/businesses/businesses.module.less';
import userStyles from '@/pages/users/users.module.less';

const { Info } = Main;

export const businessEdit = (props) => {
  const intl = useIntl();

  const [formRef] = Form.useForm();

  const {
    authModel,
    businessModel,
    simpleModel,
    loading,
    testId,
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

  const component = 'businesses';
  const {
    ability,
    ableFor,
    disabled,
    canUpdate
  } = componentAbilities(authModel, component, isEdit);

  effectHook(() => {
    canUpdate && onEditBusiness(params);
  }, [canUpdate, params.user]);

  validateFieldsOnLoad(formRef, entityForm);

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
      uploadedFiles,
      onFileRemove,
      onFileChange,
      formRef
    }
  };

  const licenseProps = {
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
      onFileChange,
      formRef
    }
  };

  const addressProps = {
    formRef,
    disabled,
    countries,
    states,
    onHandleStates
  };

  const tagsProps = {
    formRef,
    onUpdateTags,
    disabled,
    tags,
    canDelete: canUpdate,
    canCreate: canUpdate,
    canUpdate
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

  const subTitle = (
      <>
        <TrademarkOutlined style={{ marginRight: 10 }}/>
        {isEdit ?
            t(intl, 'business.actions.edit') :
            t(intl, 'business.actions.addNew')
        }
      </>
  );

  const MODEL_NAME = 'businessModel';

  const onChangeFormProps = {
    touched,
    entityForm,
    loading,
    spinOn: [
      'simpleModel/query',
      `${MODEL_NAME}/editBusiness`,
    ],
    onFinish(formValues) {
      canUpdate && onSave(formValues, params);
    },
    onFieldsChange
  };

  const metaProps = {
    intl,
    loading,
    ability,
    disabled,
    formRef,
    component,
    MODEL_NAME
  };

  const menuProps = {
    ...metaProps,
    isEdit,
    params,
    onActivateBusiness,
    onHoldBusiness,
    onDeleteBusiness
  };

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
      closeBtn: { onClose: () => onClose(params.user) },
      saveBtn: { ableFor, touched, formRef },
      menuBtn: {
        selectedEntity: selectedBusiness,
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
            ableFor={ableFor}
            spinEffects={[
              'simpleModel/query',
              `${MODEL_NAME}/editBusiness`,
              `${MODEL_NAME}/prepareToSave`
            ]}>
        <div className={styles.businessWrapper}>
          <SubHeader {...pageHeaderProps}/>
          <Form {...formProps(onChangeFormProps)}
                form={formRef}
                initialValues={{
                  country: selectedCountry
                }}>
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
