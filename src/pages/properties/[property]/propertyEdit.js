import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { useIntl, useParams } from '@umijs/max';

import Main from '@/components/Main';
import Page from '@/components/Page/page.connect';
import Common from '@/components/Common';
import { formProps } from '@/components/Form/formProps';
import { SubHeader } from '@/components/Page/page.subheader';
import { validateFieldsOnLoad } from '@/components/Form';

import { propertyMenu } from '@/pages/properties/metadata/properties.menu';

import { t } from '@/utils/i18n';
import { fromForm } from '@/utils/object';
import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';

import styles from '@/pages/properties/properties.module.less';
import userStyles from '@/pages/users/users.module.less';

const { Info } = Main;

const MODEL_NAME = 'campaignModel';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const propertyEdit = (props) => {
  const intl = useIntl();
  const [formRef] = Form.useForm();

  const {
    authModel,
    propertyModel,
    loading,
    testId,
    onFieldsChange,
    onSave,
    onClose,
    onDeleteProperty,
    onUpdateTags,
    onEditProperty
  } = props;

  /**
   * @type {{campaign}}
   */
  const params = useParams();

  const {
    entityForm,
    selectedProperty,
    isEdit,
    touched,
    tags,
    translateMessages
  } = propertyModel;

  const component = 'properties';

  const {
    ability,
    ableFor,
    disabled,
    canUpdate
  } = componentAbilities(authModel, component, isEdit);

  effectHook(() => {
    canUpdate && onEditProperty(params);
  }, [canUpdate]);

  validateFieldsOnLoad(formRef, entityForm);

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const infoProps = {
    isEdit,
    touched,
    loading,
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
    intl,
    params,
    component,
    onDeleteProperty
  };

  const tagsProps = {
    formRef,
    onUpdateTags,
    disabled,
    tags,
    loading,
    header: t(intl, 'campaigns.tags')
  };

  const translateProps = {
    formRef,
    loading,
    disabled,
    translateMessages
  };

  const subTitle = (
      <>
        <HomeOutlined style={{ marginRight: 10 }}/>
        {isEdit ?
            t(intl, 'properties.actions.edit') :
            t(intl, 'properties.actions.addNew')
        }
      </>
  );

  const onChangeFormProps = {
    touched,
    entityForm,
    loading,
    spinOn: [
      `${MODEL_NAME}/validateProperty`,
      `${MODEL_NAME}/editProperty`,
      `${MODEL_NAME}/getSimpleEntity`,
      `${MODEL_NAME}/cleanForm`
    ],
    onFinish(formValues) {
      canUpdate && onSave(formValues, params);
    },
    onFieldsChange
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
      closeBtn: { onClose },
      saveBtn: { ableFor, touched, formRef },
      menuBtn: {
        selectedEntity: selectedProperty,
        label: t(intl, 'properties.actions.manage'),
        menuProps: {
          ...menuProps,
          onDeleteProperty
        },
        dropDownMenu: propertyMenu,
        testId: `${testId}.menuBtn`
      }
    }
  };

  return (
      <Page className={userStyles.users}
            component={component}
            ableFor={ableFor}
            touched={!disabled && touched}
            spinEffects={[
              `${MODEL_NAME}/validateProperty`,
              `${MODEL_NAME}/editProperty`,
              `${MODEL_NAME}/getSimpleEntity`,
              `${MODEL_NAME}/cleanForm`,
              `${MODEL_NAME}/handleUpdate`,
              `${MODEL_NAME}/handleSave`,
              `${MODEL_NAME}/prepareToSave`
            ]}>
        <div className={styles.propertyWrapper}>
          <SubHeader {...pageHeaderProps}/>
          <Form {...formProps(onChangeFormProps)}
                form={formRef}
                initialValues={{}}>
            <Common.Tags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
