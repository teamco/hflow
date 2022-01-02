import React, { useEffect, useState } from 'react';
import { DownOutlined, SettingOutlined, TrademarkOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, PageHeader } from 'antd';

import SaveButton from 'components/Buttons/save.button';

import Main from 'components/Main';
import Page from 'components/Page';

import { useParams } from 'umi';

import { fromForm } from 'utils/object';
import { isLoading } from 'utils/state';

import { FeatureInfo } from './form/feature.info';
import { FeatureDiscount } from './form/feature.discount';
import { FeatureTags } from './form/feature.tags';
import { FeatureTranslate } from './form/feature.translate';
import { FeatureMenu } from '@/pages/subscriptions/features/metadata/feature.menu';

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
    currencies,
    tags,
    isEdit,
    touched
  } = featureModel;

  const { ability } = authModel;
  const component = 'subscriptions';
  const disabled = ability.cannot('update', component);
  const canUpdate = ability.can('update', component);

  const [disabledDescription, setDisabledDescription] = useState(false);
  const [currency, setCurrency] = useState(currencies[0]);

  useEffect(() => {
    canUpdate && onEditFeature(params);
  }, [authModel.user, canUpdate]);

  const price = formRef.getFieldValue('price');

  useEffect(() => {
    setCurrency(price?.currency || currencies[0]);
  }, [price, currencies]);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    onSave(formValues, params);
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

  const prefsProps = {
    t,
    formRef,
    disabled,
    featureTypes,
    currencies,
    currency,
    setDisabledDescription
  };

  const discountProps = {
    formRef,
    disabled,
    currency
  };

  const translateProps = {
    t,
    formRef,
    disabled,
    disabledDescription
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
        <TrademarkOutlined style={{ marginRight: 10 }}/>
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
                  price: {
                    originalPrice: 0,
                    currency
                  },
                  featureType: featureTypes[0],
                  translateKeys: {
                    on: 'actions:yes',
                    off: 'actions:no'
                  }
                }}>
            <FeatureInfo {...prefsProps} />
            <FeatureDiscount {...discountProps} />
            <FeatureTranslate {...translateProps} />
            <FeatureTags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
