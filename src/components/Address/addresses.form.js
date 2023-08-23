import React, { useState } from 'react';
import { Form, message, Tooltip } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import { stub } from '@/utils/function';
import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';

import { fieldName, formProps, resetField } from '@/components/Form/formProps';
import { AddressRoute } from '@/components/Address/sections/address.route';
import { AddressGeo } from '@/components/Address/sections/address.geo';
import { AddressBox } from '@/components/Address/sections/address.box';
import { AddressLine } from '@/components/Address/sections/address.line';
import { AddressCountry } from '@/components/Address/sections/address.country';
import { AddressName } from '@/components/Address/sections/address.name';
import { AddressPrimary } from '@/components/Address/sections/address.primary';
import { AddressType } from '@/components/Address/sections/address.type';
import Loader from '@/components/Loader';

import styles from '@/components/Address/addresses.module.less';

const MODEL_NAME = 'addressModel';

export const AddressesForm = props => {
  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    testId,
    loading,
    formRef,
    canUpdate,
    disabled,
    selected,
    className,
    ns = '',
    nestedForm = false,
    helper = false,
    geo = false,
    spinOn = [],
    addressModel = {},
    assignedModel = {},
    setHelper = stub,
    setSelected = stub,
    onSave = stub,
    onFieldsChange = stub,
    onGetStateCities = stub,
    onGetCountryStates = stub,
    onGetAllCountries = stub
  } = props;

  const { touched, entityForm } = assignedModel;
  const {
    initialValues,
    countries = [],
    countryStates = [],
    stateCities = [],
    addressTypes = []
  } = addressModel;

  const onChangeFormProps = {
    touched,
    entityForm,
    loading,
    spinOn,
    onFieldsChange,
    onFinish(formValues) {
      if (canUpdate) {
        onSave(formValues, selected, initialValues);
        formRef.resetFields();
        setSelected(false);
      }
    }
  };

  const [country, selectCountry] = useState(null);
  const [state, selectState] = useState(null);
  const [city, selectCity] = useState(null);
  const [aType, selectType] = useState(initialValues?.addressType);

  /**
   * @function
   * @param {string} fName - Field name.
   * @return {{name: *[], value: *}}
   * @private
   */
  function _setter(fName) {
    return { name: fieldName(ns, fName), value: selected[fName] }
  }

  effectHook(() => {
    onGetAllCountries();
  });

  effectHook(() => {
    if (selected?.id) {
      selectType(selected?.addressType);
      selectCountry(countries.find(country => country?.name === selected.country));

      formRef.setFields([
        _setter('primary'),
        _setter('billing'),
        _setter('addressType'),
        _setter('name'),
        _setter('companyName'),
        _setter('addressLine1'),
        _setter('addressLine2'),
        _setter('poBox'),
        _setter('boxNumber'),
        _setter('zipCode'),
        _setter('country'),
        _setter('state'),
        _setter('city'),
        _setter('ruralRoute'),
        _setter('highwayContractRoute'),
        _setter('generalDelivery'),
        _setter('neighborhoodByRef'),
      ]);

      selectState(countryStates.find(state => state?.name === selected.state));
      selectCity(stateCities.find(city => city?.name === selected.city));
    }
  }, [countryStates, stateCities, selected]);

  effectHook(() => {
    if (country) {
      onGetCountryStates(country);
    } else {
      cleanCountryFields('state');
    }
  }, [country]);

  effectHook(() => {
    if (state) {
      onGetStateCities(country, state);
    } else {
      cleanCountryFields('city');
    }
  }, [state]);

  const cleanCountryFields = (type) => {
    if (type === 'state') {
      selectState(null);
    }

    selectCity(null);
    resetField(type, formRef, ns);
  };

  const rules = addressTypes.find(rule => rule.type === aType);

  const genProps = { ns, disabled, rules, helper };

  const countryProps = {
    ...genProps,
    countries,
    countryStates,
    stateCities,
    country,
    state,
    selectCountry,
    selectState,
    selectCity
  };

  const typeProps = {
    ...genProps,
    addressTypes,
    selectType,
    aType
  };

  const spinEffects = [
    ...spinOn,
    `${MODEL_NAME}/getAllCountries`,
    `${MODEL_NAME}/getCountryStates`,
    `${MODEL_NAME}/getStateCities`
  ];

  const _formSections = (
      <>
        <AddressPrimary {...genProps} />
        <AddressType {...typeProps}/>
        {aType ? (<AddressName {...genProps}/>) : null}
        {aType ? (<AddressCountry {...countryProps}/>) : null}
        {aType ? (<AddressLine {...genProps}/>) : null}
        {aType ? (<AddressRoute {...genProps}/>) : null}
        {aType ? (
            <AddressGeo messageApi={messageApi}
                        geo={geo}
                        {...genProps}/>
        ) : null}
        {aType ? (<AddressBox {...genProps} />) : null}
      </>
  );

  return (
      <div data-testid={testId}>
        <Loader loading={loading} spinOn={spinEffects}>
          {contextHolder}
          <div className={className}>
            <div className={styles.formHelper}>
              <Tooltip title={t(intl,
                  helper ? 'actions.hide' : 'actions.show',
                  { type: t(intl, 'address.formHelper') }
              )}>
                <QuestionCircleTwoTone twoToneColor={helper ? '#52c41a' : null}
                                       onClick={e => {
                                         e.preventDefault();
                                         setHelper(!helper);
                                       }}/>
              </Tooltip>
            </div>
            {nestedForm ? _formSections : (
                <Form {...formProps(onChangeFormProps)}
                      form={formRef}
                      rootClassName={styles.form}
                      initialValues={initialValues}>
                  {_formSections}
                </Form>
            )}
          </div>
        </Loader>
      </div>
  );
};