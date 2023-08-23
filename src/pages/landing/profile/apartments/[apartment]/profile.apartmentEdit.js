import React, { useState } from 'react';
import { useIntl, useParams } from '@umijs/max';
import { Col, Form, Row } from 'antd';
import classnames from 'classnames';

import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import { preventNavigation } from '@/services/profile.menu.service';

import { formProps } from '@/components/Form/formProps';
import Main from '@/components/Main';

import { AssetsSection } from './sections/assets.section';
import { InfoSection } from './sections/info.section';
import { AttributesSection } from './sections/attributes.section';

import styles from './profile.apartmentEdit.module.less';
import { PriceSection } from '@/pages/landing/profile/apartments/[apartment]/sections/price.section';
import { SchedulersList } from '@/components/Scheduler/SchedulersList';
import { updateSchedulerPanel } from '@/pages/subscriptions/[subscription]/panels';
import { DEFAULT_PRICE_VALUES } from '@/components/Price/form.price';

const MODEL_NAME = 'profileApartmentModel';

export const ProfileApartmentEdit = props => {
  const intl = useIntl();
  const [formRef] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [expectedOriginalPrice, setExpectedOriginalPrice] = useState(0);

  const {
    testId,
    loading,
    profileModel,
    profileApartmentModel,
    cloudinaryModel,
    addressModel,
    authModel,
    onQuery = stub,
    onDirectionButton = stub,
    onSave = stub,
    onSignature = stub,
    onGetApartment = stub,
    onFieldsChange = stub,
    onFileRemove = stub,
    onFileChange = stub,
    setSelected = stub,
    onGetStateCities = stub,
    onGetCountryStates = stub,
    onGetAllCountries = stub,
    onHandleScheduler = stub,
    onDeleteScheduler = stub,
    onUpdateSider = stub
  } = props;

  const { user } = authModel;
  const { sUser } = profileModel;
  const { signData } = cloudinaryModel;
  const {
    assets,
    assetsFolder,
    entityForm,
    enums,
    selectedApartment,
    touched,
    spinning,
    maxImageDimensions,
    currencies,
    durationTypes,
    schedulers,
    schedulerTypes
  } = profileApartmentModel;

  const component = 'profile.apartments';
  const params = useParams();

  const handleHeaderButtons = () => {
    onDirectionButton({
      rNext: {
        disabled: disabled || currentStep === formSteps.length - 1,
        onClick: (direction) => setCurrentStep(currentStep + direction),
        title: t(intl, 'actions.next'),
        spinOn: []
      },
      rPrev: {
        disabled: disabled || !currentStep,
        onClick: (direction) => setCurrentStep(currentStep + direction),
        title: t(intl, 'actions.prev'),
        spinOn: []
      },
      rSave: {
        disabled: disabled || currentStep === formSteps.length - 1,
        onClick: () => formRef?.submit(),
        spinOn: []
      }
    }, profileApartmentModel, formRef);
  };

  effectHook(() => {
    user && onQuery();
  }, [user]);

  effectHook(() => {
    if (sUser) {
      onGetApartment(params?.apartment);
    }
  }, [sUser]);

  effectHook(() => {
    handleHeaderButtons();
  }, [currentStep]);

  effectHook(() => {
    assetsFolder && onSignature(assetsFolder);
  }, [assetsFolder]);

  preventNavigation(sUser, intl, t(intl, 'profile.public.apartments.setting'));

  const {
    ability,
    disabled,
    canUpdate,
    canDelete
  } = componentAbilities(authModel, component, false);

  const onChangeFormProps = {
    touched,
    loading,
    spinOn: [
      `${MODEL_NAME}/validateApartment`,
      `${MODEL_NAME}/editApartment`,
      `${MODEL_NAME}/cleanForm`
    ],
    entityForm,
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

  const panelProps = {
    ...metaProps,
    onUpdateSider
  };

  const priceProps = {
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

  const assetsProps = {
    loading,
    disabled,
    assets,
    signData,
    assetsFolder,
    spinning,
    MODEL_NAME,
    onFileRemove,
    onFileChange,
    // crop: false,
    formRef,
    field: 'apartmentImage',
    maxDimensions: { ...maxImageDimensions }
  };

  const infoProps = {
    addressModel,
    disabled,
    setSelected,
    onFieldsChange,
    onGetAllCountries,
    onGetCountryStates,
    onGetStateCities
  };

  const formSteps = [
    {
      title: 'Info',
      description: 'desc',
      content: (
          <InfoSection {...infoProps}/>
      )
    },
    {
      title: 'Attributes',
      description: 'desc',
      content: (
          <AttributesSection enums={enums}/>
      )
    },
    {
      title: 'Assets',
      description: 'desc',
      content: (
          <AssetsSection {...assetsProps}/>
      )
    },
    {
      title: 'Price',
      description: 'desc',
      content: (
          <>
            <PriceSection {...priceProps}/>
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
          </>
      )
    },
    {
      title: 'Preview',
      description: 'desc',
      content: 'Preview'
    }
  ];

  return (
      <div data-testid={testId}
           className={classnames(styles.profileApartmentForm)}>
        <Main.Steps currentStep={currentStep}
                    formSteps={formSteps}/>
        <div>
          <Row gutter={0}>
            <Col span={24}>
              <Form {...formProps(onChangeFormProps)}
                    form={formRef}
                    initialValues={{
                      ...DEFAULT_PRICE_VALUES(currencies[0])
                    }}>
                {formSteps[currentStep].content}
              </Form>
            </Col>
          </Row>
        </div>
      </div>
  );
};