import React from 'react';
import { Tag } from 'antd';
import { useIntl } from '@umijs/max';

import classnames from 'classnames';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { isSpinning } from '@/utils/state';

import styles from './form.module.less';

/**
 * @export
 * @param props
 * @return {{layout: string, onFieldsChange, scrollToFirstError: boolean, className: string, onFinish: stub, fields}}
 */
export const formProps = props => {
  const {
    className,
    touched,
    entityForm,
    layout = 'vertical',
    scrollToFirstError = true,
    spinOn = [],
    loading,
    onFinish = stub,
    onFieldsChange = stub
  } = props;

  let isLoaded = false;

  /**
   * @constant
   * @param changedFields
   * @param allFields
   */
  const handleOnFieldsChange = (changedFields, allFields) => {
    if (isSpinning(loading, spinOn)) return false;

    onFieldsChange(changedFields, allFields);
    // new Promise((resolve) => {
    //   if (touched) {
    //     // TODO (teamco): Avoid re-rendering.
    //     isLoaded = false;
    //     resolve();
    //   } else {
    //     resolve(isLoaded && onFieldsChange(changedFields, allFields));
    //     isLoaded = true;
    //   }
    // }).catch(error => {
    //   console.error(error);
    // });
  };

  return ({
    layout,
    onFinish,
    scrollToFirstError,
    fields: entityForm,
    className: classnames(className, styles.form),
    onFieldsChange: handleOnFieldsChange
  });
};

/**
 * @export
 * @param {string|null} ns
 * @param {string} name
 * @return {*[]}
 */
export const fieldName = (ns, name) => ns ? [ns, name] : [name];

/**
 * @constant
 * @param {string} [ns]
 * @param {string} name
 * @param formRef
 * @return {*}
 */
export const resetField = (name, formRef, ns = '') =>
    formRef?.setFields([
      {
        name: fieldName(ns, name),
        value: null
      }
    ]);

/**
 * @export
 * @param props
 * @return {JSX.Element|null}
 * @constructor
 */
export const PrivateTag = props => {
  const intl = useIntl();

  const { entity, privateColor = 'magenta', publicColor = 'cyan' } = props;

  const _private = t(intl, 'profile.type.private');
  const _public = t(intl, 'profile.type.public');

  return (
      <Tag color={entity?.private ? privateColor : publicColor} className={styles.tagType}>
        {entity.private ? _private : _public}
      </Tag>
  );
};

/**
 * @export
 * @param props
 * @return {JSX.Element|null}
 * @constructor
 */
export const AccountTag = props => {
  const intl = useIntl();

  const { entity, color = 'blue' } = props;

  const _account = t(intl, 'profile.type.account');

  return entity?.account ? (
      <Tag color={color} className={styles.tagType}>{_account}</Tag>
  ) : null;
};

/**
 * @export
 * @param props
 * @return {JSX.Element|null}
 * @constructor
 */
export const PrimaryTag = props => {
  const intl = useIntl();

  const { entity, color = 'green' } = props;

  const _primary = t(intl, 'profile.type.primary');

  return entity?.primary ? (
      <Tag color={color} className={styles.tagType}>{_primary}</Tag>
  ) : null;
};

/**
 * @export
 * @param props
 * @return {JSX.Element|null}
 * @constructor
 */
export const BillingTag = props => {
  const intl = useIntl();

  const { entity, color = 'orange' } = props;

  const _primary = t(intl, 'profile.type.billing');

  return entity?.billing ? (
      <Tag color={color} className={styles.tagType}>{_primary}</Tag>
  ) : null;
};