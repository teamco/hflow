import React  from 'react';
import { DownOutlined, SettingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, PageHeader } from 'antd';
import { useParams, useIntl } from 'umi';

import SaveButton from '@/components/Buttons/save.button';

import Main from '@/components/Main';
import Page from '@/components/Page';
import Common from '@/components/Common';
import { DEFAULT_PRICE_VALUES } from '@/components/Price/form.price';

import { SubscriptionInfo } from '@/pages/subscriptions/[subscription]/form/subscription.info';
import { SubscriptionFeatures } from '@/pages/subscriptions/[subscription]/form/subscription.features';
import { SubscriptionDiscount } from '@/pages/subscriptions/[subscription]/form/subscription.discount';
import SubscriptionMenu from '@/pages/subscriptions/metadata/subscriptions.menu';

import { fromForm } from '@/utils/object';
import { isLoading } from '@/utils/state';
import { effectHook } from '@/utils/hooks';

import menuStyles from '@/components/menu.less';
import styles from '@/pages/subscriptions/subscriptions.module.less';
import userStyles from '@/pages/users/users.module.less';

const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const subscriptionEdit = (props) => {
  const [formRef] = Form.useForm();
  const intl = useIntl();
  const {
    authModel,
    subscriptionModel,
    loading,
    onEditSubscription,
    onFieldsChange,
    onUpdateTags,
    onSave,
    onClose,
    onDeleteSubscription,
    onChangeFeatureType
  } = props;

  /**
   * @type {{subscription}}
   */
  const params = useParams();

  const {
    entityForm,
    features,
    selectedSubscription,
    subscriptionTypes,
    discountTypes,
    businessUsers,
    currencies,
    durationTypes,
    featureTypes,
    tags,
    isEdit,
    touched
  } = subscriptionModel;

  const { ability } = authModel;
  const component = 'subscriptions';
  const disabled = ability.cannot('update', component);
  const canUpdate = ability.can('update', component);

  effectHook(() => {
    canUpdate && onEditSubscription(params);
  }, [authModel.user, canUpdate]);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    onSave(formValues, params);
  };

  const subscriptionInfoProps = {
    formRef,
    disabled,
    subscriptionTypes,
    durationTypes,
    discountTypes,
    businessUsers
  };

  const featuresProps = {
    isEdit,
    formRef,
    disabled,
    features,
    selectedSubscription,
    featureTypes,
    onChangeFeatureType
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

  const tagsProps = {
    formRef,
    onUpdateTags,
    disabled,
    tags,
    header: intl.formatMessage({id: 'subscription.tags', defaultMessage: 'Tags'})
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
    component,
    onDeleteSubscription
  };

  const subTitle = (
      <>
        <ShoppingCartOutlined style={{ marginRight: 10 }}/>
        {isEdit ?
            intl.formatMessage({id: 'subscription.actions.edit', defaultMessage: 'Edit Subscriptions'}) :
            intl.formatMessage({id: 'subscription.actions.addNew', defaultMessage: 'Add new Subscriptions' })
        }
      </>
  );

  return (
      <Page className={userStyles.users}
            component={component}
            touched={!disabled && touched}
            spinEffects={[
              'subscriptionModel/editSubscription',
              'subscriptionModel/subscriptionTypes',
              'subscriptionModel/changeFeatureType',
              'subscriptionModel/features',
              'subscriptionModel/getSimpleEntity',
              'subscriptionModel/prepareToSave'
            ]}>
        <div className={styles.subscriptionWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Button key={'close'}
                                size={'small'}
                                loading={isLoading(loading.effects['subscriptionModel/prepareToSave'])}
                                onClick={() => onClose()}>
                          {intl.formatMessage({id: 'actions.close', defaultMessage: 'Close'})}
                        </Button>,
                        <SaveButton key={'save'}
                                    isEdit={isEdit}
                                    disabled={!touched || disabled}
                                    formRef={formRef}
                                    loading={loading.effects['subscriptionModel/prepareToSave']}/>,
                        <Dropdown overlay={<SubscriptionMenu record={selectedSubscription} {...menuProps} />}
                                  disabled={!isEdit || disabled}
                                  trigger={['click']}
                                  overlayClassName={menuStyles.customActionMenu}
                                  key={'custom'}>
                          <Button size={'small'}
                                  icon={<SettingOutlined/>}
                                  className={menuStyles.customAction}>
                            {intl.formatMessage({id: 'subscription.actions:manage', defaultMessage: 'Manage Subscriptions'})} <DownOutlined/>
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
                  numberOfUsers: 1,
                  featureType: 'Business',
                  paymentDuration: {
                    type: 'Month',
                    period: 1
                  },
                  ...DEFAULT_PRICE_VALUES(currencies[0])
                }}>
            <SubscriptionInfo {...subscriptionInfoProps} />
            <Common.Translate {...translateProps}/>
            <SubscriptionDiscount {...discountProps}/>
            <SubscriptionFeatures {...featuresProps} />
            <Common.Tags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
