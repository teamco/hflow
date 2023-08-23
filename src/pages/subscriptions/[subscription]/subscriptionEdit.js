import React, { useState } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { useIntl, useParams } from '@umijs/max';

import Main from '@/components/Main';
import Page from '@/components/Page/page.connect';
import Common from '@/components/Common';
import { DEFAULT_PRICE_VALUES } from '@/components/Price/form.price';
import { SchedulersList } from '@/components/Scheduler/SchedulersList';
import { formProps } from '@/components/Form/formProps';
import { SubHeader } from '@/components/Page/page.subheader';
import { validateFieldsOnLoad } from '@/components/Form';

import { SubscriptionInfo } from '@/pages/subscriptions/[subscription]/form/subscription.info';
import { SubscriptionFeatures } from '@/pages/subscriptions/[subscription]/form/subscription.features';
import { SubscriptionDiscount } from '@/pages/subscriptions/[subscription]/form/subscription.discount';
import { subscriptionMenu } from '@/pages/subscriptions/metadata/subscriptions.menu';

import { fromForm } from '@/utils/object';
import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { componentAbilities } from '@/utils/auth/component.setting';

import { isNew } from '@/services/common.service';

import {
  updateFeaturesPanel,
  updateSchedulerPanel
} from '@/pages/subscriptions/[subscription]/panels';

import userStyles from '@/pages/users/users.module.less';
import styles from '@/pages/subscriptions/subscriptions.module.less';

const { Info } = Main;

const MODEL_NAME = 'subscriptionModel';

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
    testId,
    onEditSubscription,
    onFieldsChange,
    onUpdateTags,
    onSave,
    onClose,
    onDeleteSubscription,
    onChangeFeatureType,
    onHandleScheduler,
    onDeleteScheduler,
    onUpdateSider
  } = props;

  /**
   * @type {{subscription}}
   */
  const params = useParams();

  const {
    entityForm,
    features,
    selectedSubscription = {},
    subscriptionTypes,
    discountTypes,
    businessUsers,
    currencies,
    durationTypes,
    featureTypes,
    tags,
    schedulers,
    schedulerTypes,
    isEdit,
    touched,
    translateMessages
  } = subscriptionModel;

  const component = 'subscriptions';

  const {
    ability,
    ableFor,
    disabled,
    canUpdate
  } = componentAbilities(authModel, component, !isNew(params.subscription));

  const [expectedOriginalPrice, setExpectedOriginalPrice] = useState(0);

  effectHook(() => {
    if (canUpdate) {
      onEditSubscription(params);
    }
  }, [canUpdate]);

  validateFieldsOnLoad(formRef, entityForm);

  const {
    featuresByRef = []
  } = selectedSubscription || {};

  const metaProps = {
    intl,
    loading,
    ability,
    disabled,
    formRef,
    component,
    MODEL_NAME
  };

  const panelProps = {
    ...metaProps,
    onUpdateSider
  };

  const subscriptionInfoProps = {
    ...metaProps,
    subscriptionTypes,
    durationTypes,
    discountTypes
  };

  const featuresProps = {
    ...metaProps,
    isEdit,
    features,
    featuresByRef,
    businessUsers,
    selectedSubscription,
    featureTypes,
    onChangeFeatureType,
    setExpectedOriginalPrice,
    onOpenSiderPanel(visible) {
      updateFeaturesPanel({
        ...panelProps,
        onChangeFeatureType
      }, visible);
    }
  };

  const discountProps = {
    ...metaProps,
    currencies,
    durationTypes,
    expectedOriginalPrice,
    readOnlyFields: ['originalPrice'],
    renderScheduler: () => (
        <SchedulersList data={schedulers['discountScheduler']} {...metaProps}
                        prefix={schedulerTypes.discount}
                        formRef={formRef}
                        entityType={t(intl, 'price.discount')}
                        onDeleteScheduler={onDeleteScheduler}
                        onOpenSiderPanel={(visible, entityForm = {}) => {
                          updateSchedulerPanel({
                            ...panelProps,
                            ...entityForm,
                            prefix: schedulerTypes.discount,
                            entityType: t(intl, 'price.discount'),
                            onHandleScheduler,
                            durationTypes
                          }, visible);
                        }}/>
    )
  };

  const translateProps = { ...metaProps, translateMessages };

  const tagsProps = {
    ...metaProps,
    tags,
    onUpdateTags,
    canDelete: canUpdate,
    canCreate: canUpdate,
    canUpdate,
    header: t(intl, 'subscription.tags')
  };

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const infoProps = {
    ...metaProps,
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
        <ShoppingCartOutlined style={{ marginRight: 10 }}/>
        {isEdit ?
            t(intl, 'subscription.actions.edit') :
            t(intl, 'subscription.actions.addNew')}
      </>
  );

  const onChangeFormProps = {
    touched,
    entityForm,
    onFinish(formValues) {
      canUpdate && onSave(formValues, params);
    },
    onFieldsChange,
    loading,
    spinOn: [
      `${MODEL_NAME}/validateSubscription`,
      `${MODEL_NAME}/editSubscription`,
      `${MODEL_NAME}/getSimpleEntity`,
      `${MODEL_NAME}/features`,
      `${MODEL_NAME}/cleanForm`
    ]
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
        label: t(intl, 'subscription.actions.manage'),
        selectedEntity: selectedSubscription,
        menuProps: {
          ...metaProps,
          isEdit,
          params,
          intl,
          onDeleteSubscription
        },
        dropDownMenu: subscriptionMenu,
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
              `${MODEL_NAME}/validateSubscription`,
              `${MODEL_NAME}/editSubscription`,
              `${MODEL_NAME}/getSimpleEntity`,
              `${MODEL_NAME}/features`,
              `${MODEL_NAME}/cleanForm`,
              `${MODEL_NAME}/handleUpdate`,
              `${MODEL_NAME}/handleSave`,
              `${MODEL_NAME}/prepareToSave`
            ]}>
        <div className={styles.subscriptionWrapper}>
          <SubHeader {...pageHeaderProps}/>
          <Form {...formProps(onChangeFormProps)}
                form={formRef}
                initialValues={{
                  type: 'Basic',
                  numberOfUsers: 1,
                  featureType: 'Business',
                  paymentDuration: {
                    type: 'Month',
                    period: 1
                  },
                  translateKeys: {
                    title: '',
                    description: ''
                  },
                  ...DEFAULT_PRICE_VALUES(currencies[0])
                }}>
            <SubscriptionInfo {...subscriptionInfoProps} />
            <SchedulersList data={schedulers[schedulerTypes.sale]} {...metaProps}
                            prefix={schedulerTypes.sale}
                            formRef={formRef}
                            entityType={t(intl, 'subscription.saleAt')}
                            onDeleteScheduler={onDeleteScheduler}
                            onOpenSiderPanel={(visible, entityForm = {}) => {
                              updateSchedulerPanel({
                                ...panelProps,
                                ...entityForm,
                                prefix: schedulerTypes.sale,
                                entityType: t(intl, 'subscription.saleAt'),
                                onHandleScheduler,
                                durationTypes
                              }, visible);
                            }}/>
            <SubscriptionFeatures {...featuresProps} />
            <SubscriptionDiscount {...discountProps} />
            <Common.Translate {...translateProps} />
            <Common.Tags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
