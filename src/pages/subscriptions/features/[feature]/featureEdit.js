import React, { useEffect, useState } from 'react';
import { ControlOutlined, DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, PageHeader } from 'antd';

import SaveButton from '@/components/Buttons/save.button';
import Main from '@/components/Main';
import Page from '@/components/Page';
import Common from '@/components/Common';
import { DEFAULT_PRICE_VALUES } from '@/components/Price/form.price';

import { useParams } from 'umi';

import { fromForm } from '@/utils/object';
import { isLoading } from '@/utils/state';

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

  const {
    t,
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

  useEffect(() => {
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
    tags,
    header: t('feature:tags')
  };

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const prefsProps = {
    t,
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
    t,
    formRef,
    disabled
  };

  const infoProps = {
    t,
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
    t,
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
            t('actions:edit', { type: t('menu:feature') }) :
            t('actions:addNew', { type: t('menu:feature') })
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
                          {t('actions:close')}
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
                            {t('actions:manage', { type: t('menu:feature') })} <DownOutlined/>
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
                  defaultState: true,
                  ...DEFAULT_PRICE_VALUES(currencies[0]),
                  trialPeriod: {
                    ...DEFAULT_PRICE_VALUES(currencies[0], false),
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
