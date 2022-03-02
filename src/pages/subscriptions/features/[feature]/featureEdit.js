import React, { useState } from 'react';
import { ControlOutlined, DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, PageHeader } from 'antd';
import { useIntl } from 'umi';

import SaveButton from '@/components/Buttons/save.button';
import Main from '@/components/Main';
import Page from '@/components/Page';
import Common from '@/components/Common';
import { DEFAULT_PRICE_VALUES } from '@/components/Price/form.price';

import { useParams } from 'umi';

import { fromForm } from '@/utils/object';
import { isLoading } from '@/utils/state';
import { effectHook } from '@/utils/hooks';

import { FeatureInfo } from './form/feature.info';
import { FeatureDiscount } from './form/feature.discount';
import { FeatureTranslate } from './form/feature.translate';
import { FeatureMenu } from '@/pages/subscriptions/features/metadata/feature.menu';
import FeatureTrial from '@/pages/subscriptions/features/[feature]/form/feature.trial';

import menuStyles from '@/components/menu.less';
import styles from '@/pages/subscriptions/features/features.module.less';
import userStyles from '@/pages/users/users.module.less';

const { Info } = Main;

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
    touched
  } = featureModel;

  const { ability } = authModel;
  const component = 'features';
  const disabled = ability.cannot('update', component);
  const canUpdate = ability.can('update', component);

  const [isTrialed, setIsTrialed] = useState(false);

  effectHook(() => {
    canUpdate && onEditFeature(params);
  }, [authModel.user, canUpdate]);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    onSave(formValues, params);
  };

  const tagsProps = {
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

  const prefsProps = {
    formRef,
    disabled,
    featureTypes,
    setIsTrialed
  };

  const discountProps = {
    formRef,
    disabled,
    currencies,
    durationTypes
  };

  const translateProps = {
    formRef,
    disabled
  };

  const infoProps = {
    isEdit,
    touched,
    formRef,
    disabled,
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
    component,
    onDeleteFeature
  };

  const subTitle = (
      <>
        <ControlOutlined style={{ marginRight: 10 }}/>
        {isEdit ?
            intl.formatMessage({id: 'feature.actions.edit', defaultMessage: 'Edit Feature'}) :
            intl.formatMessage({id: 'feature.msg.addNew', defaultMessage: 'Add new Feature?'})
        }
      </>
  );

  return (
      <Page className={userStyles.users}
            component={component}
            touched={!disabled && touched}
            spinEffects={[
              'featureModel/editFeature',
              'featureModel/prepareToSave'
            ]}>
        <div className={styles.featureWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Button key={'close'}
                                size={'small'}
                                loading={isLoading(loading.effects['featureModel/prepareToSave'])}
                                onClick={() => onClose()}>
                          {intl.formatMessage({id: 'actions.close', defaultMessage: 'Add new Feature?'})}
                        </Button>,
                        <SaveButton key={'save'}
                                    isEdit={isEdit}
                                    disabled={!touched || disabled}
                                    formRef={formRef}
                                    loading={loading.effects['featureModel/prepareToSave']}/>,
                        <Dropdown overlay={<FeatureMenu record={selectedFeature} {...menuProps} />}
                                  disabled={!isEdit || disabled}
                                  trigger={['click']}
                                  overlayClassName={menuStyles.customActionMenu}
                                  key={'custom'}>
                          <Button size={'small'}
                                  icon={<SettingOutlined/>}
                                  className={menuStyles.customAction}>
                            {intl.formatMessage({id: 'feature.actions.manage', defaultMessage: 'Manage Feature'})} <DownOutlined/>
                          </Button>
                        </Dropdown>
                      ]}/>
          <Form layout={'vertical'}
                className={styles.form}
                form={formRef}
                fields={entityForm}
                scrollToFirstError={true}
                onFinish={onFinish}
                onFieldsChange={onFieldsChange}
                initialValues={{
                  helper: true,
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
                    on: 'actions:yes',
                    off: 'actions:no'
                  }
                }}>
            <FeatureInfo {...prefsProps} />
            <FeatureDiscount {...discountProps} />
            {isTrialed && (<FeatureTrial {...discountProps} />)}
            <FeatureTranslate {...translateProps} />
            <Common.Tags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
