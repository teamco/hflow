import React, { useState } from 'react';
import { ControlOutlined } from '@ant-design/icons';
import { Col, Form, Row } from 'antd';
import { useIntl, useParams } from '@umijs/max';

import Main from '@/components/Main';
import Page from '@/components/Page/page.connect';
import Common from '@/components/Common';
import { formProps } from '@/components/Form/formProps';
import { SubHeader } from '@/components/Page/page.subheader';
import { DEFAULT_PRICE_VALUES } from '@/components/Price/form.price';
import { validateFieldsOnLoad } from '@/components/Form';

import { fromForm } from '@/utils/object';
import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { layout } from '@/utils/layout';
import { componentAbilities } from '@/utils/auth/component.setting';

import { FeatureInfo } from './form/feature.info';
import { FeatureDiscount } from './form/feature.discount';

import { featureMenu } from '@/pages/subscriptions/features/metadata/feature.menu';
import FeatureTrial from '@/pages/subscriptions/features/[feature]/form/feature.trial';

import styles from '@/pages/subscriptions/features/features.module.less';
import userStyles from '@/pages/users/users.module.less';

const { Info } = Main;

const MODEL_NAME = 'featureModel';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const featureEdit = (props) => {
  const [formRef] = Form.useForm();
  const intl = useIntl();

  const {
    authModel,
    featureModel,
    loading,
    testId,
    onEditFeature,
    onFieldsChange,
    onUpdateTags,
    onSave,
    onClose,
    onDeleteFeature
  } = props;

  /**
   * @type {{subscription}}
   */
  const params = useParams();

  const {
    entityForm,
    selectedFeature,
    featureTypes,
    durationTypes,
    currencies,
    isEdit,
    tags,
    touched,
    translateMessages
  } = featureModel;

  const component = 'features';

  const {
    ability,
    ableFor,
    disabled,
    canUpdate
  } = componentAbilities(authModel, component, isEdit);

  const [isTrialed, setIsTrialed] = useState(false);

  effectHook(() => {
    if (canUpdate) {
      onEditFeature(params);
    }
  }, [canUpdate]);

  validateFieldsOnLoad(formRef, entityForm);

  const tagsProps = {
    formRef,
    onUpdateTags,
    disabled,
    tags,
    loading
  };

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const prefsProps = {
    formRef,
    disabled,
    featureTypes,
    setIsTrialed,
    loading
  };

  const discountProps = {
    formRef,
    disabled,
    currencies,
    durationTypes,
    setIsTrialed,
    loading
  };

  const translateProps = {
    formRef,
    loading,
    disabled,
    translateMessages
  };

  const infoProps = {
    isEdit,
    touched,
    formRef,
    disabled,
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
    intl,
    loading,
    params,
    component,
    onDeleteFeature
  };

  const subTitle = (
      <>
        <ControlOutlined style={{ marginRight: 10 }}/>
        {isEdit ?
            t(intl, 'feature.actions.edit') :
            t(intl, 'feature.msg.addNew')
        }
      </>
  );

  const gutter = { xs: 8, sm: 16, md: 18, lg: 24 };

  const onChangeFormProps = {
    touched,
    entityForm,
    loading,
    spinOn: [
      `${MODEL_NAME}/validateFeature`,
      `${MODEL_NAME}/editFeature`,
      `${MODEL_NAME}/getSimpleEntity`,
      `${MODEL_NAME}/updateLocales`,
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
        selectedEntity: selectedFeature,
        label: t(intl, 'feature.actions.manage'),
        menuProps: {
          ...menuProps,
          onDeleteFeature
        },
        dropDownMenu: featureMenu,
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
              `${MODEL_NAME}/validateFeature`,
              `${MODEL_NAME}/editFeature`,
              `${MODEL_NAME}/getSimpleEntity`,
              `${MODEL_NAME}/cleanForm`,
              `${MODEL_NAME}/handleUpdate`,
              `${MODEL_NAME}/handleSave`,
              `${MODEL_NAME}/prepareToSave`
            ]}>
        <div className={styles.featureWrapper}>
          <SubHeader {...pageHeaderProps}/>
          <Form {...formProps(onChangeFormProps)}
                form={formRef}
                initialValues={{
                  trialed: false,
                  selectedByDefault: true,
                  ...DEFAULT_PRICE_VALUES(currencies[0]),
                  trialPeriod: {
                    ...DEFAULT_PRICE_VALUES(currencies[0], false, {
                      originalPrice: 0
                    }),
                    duration: {
                      type: 'Week',
                      period: 1
                    }
                  },
                  featureType: featureTypes[0],
                  translateKeys: {
                    title: '',
                    description: ''
                  }
                }}>
            <FeatureInfo {...prefsProps} />
            <Row gutter={gutter} className={styles.stretched}>
              <Col {...layout.halfColumn}>
                <FeatureDiscount {...discountProps} />
              </Col>
              {isTrialed && (
                  <Col {...layout.halfColumn}>
                    <FeatureTrial {...discountProps} />
                  </Col>
              )}
            </Row>
            <Common.Translate {...translateProps} />
            <Common.Tags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
