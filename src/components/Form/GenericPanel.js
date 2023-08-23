import React from 'react';
import { Collapse, Form, Spin } from 'antd';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import { getSuffix, requiredField } from '@/components/Form';
import Grid from '@/components/Grid';
import Loader from '@/components/Loader';

import { logger } from '@/utils/console';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import { generateKey } from '@/services/common.service';

import styles from '@/components/Form/form.module.less';

const { AntHillRow } = Grid;

/**
 * @constant
 * @param _child
 * @param props
 * @return {*}
 * @private
 */
const _cleanProps = (_child, props = []) => {
  const _props = { ..._child.props };
  props.forEach(prop => {
    delete _props[prop];
  });
  return _props;
};

/**
 * @export
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const GenericPanel = props => {
  const {
    children,
    defaultActiveKey,
    header,
    name,
    extra,
    collapsible = 'header',
    forceRender = false,
    className = '',
    style,
    onPanelChange = stub
  } = props;

  const intl = useIntl();

  /**
   * @constant
   * @param children
   * @return {*[]}
   * @private
   */
  const _getChildren = children => {
    let _children;
    if (Array.isArray(children)) {
      _children = children.filter(child => child);
    } else {
      _children = [children];
    }

    return _children;
  };

  /**
   * @constant
   * @param prop
   * @param defaultValue
   * @private
   * @return {*|null}
   */
  const _handleProps = (prop, defaultValue) => {
    if (typeof prop === 'undefined') {
      return defaultValue;
    }

    return prop ? prop : null;
  };

  /**
   * @function
   * @param {JSX.Element} Component
   * @param extraProps
   * @return {JSX.Element}
   */
  const proppedComponent = (Component, extraProps) => {
    return <Component.type {...extraProps} key={generateKey()}/>;
  };

  /**
   * @constant
   * @param Component
   * @param extraProps,
   * @param [formProps]
   * @return {JSX.Element}
   */
  const clonedComponent = (Component, extraProps, formProps) => {
    if (React.isValidElement(Component)) {
      const _cloned = proppedComponent(Component, { ...extraProps });

      if (Component.type.name === 'GenericPanel') {
        // TODO (teamco): Handle clone only.
      } else if (formProps) {
        return (
            <Form.Item shouldUpdate {...formProps}>{_cloned}</Form.Item>
        );
      }

      return _cloned;
    }

    return null;
  };

  /**
   * @param rules
   * @param {string} label
   * @param intl
   * @param form
   * @param {JSX.Element} Component
   * @param {string} key
   * @param configProps
   * @param suffix
   * @param suffixIcon
   * @return {JSX.Element|*}
   */
  const handleRequiredProps = (
      rules, label, {
        intl,
        form,
        Component,
        key,
        configProps,
        suffix,
        suffixIcon
      }) => {
    const _isRequired = rules.find(rule => rule.required);

    if (_isRequired) {
      if (!_isRequired.message) {
        _isRequired.message = requiredField(intl, label).message;
      }

      const _suffix = getSuffix(form, label, Component.props.name);

      if (Component.type.name === 'MandatoryTextarea') {
        configProps.key = key;

        return clonedComponent(Component, configProps, false);
      }

      /**
       * Handle Select component
       * @link https://ant.design/components/select/
       */
      if (Component.type.Option) {
        if (!suffixIcon) {
          configProps.suffixIcon = _handleProps(suffix, _suffix);
        }
      } else if (!suffix) {
        configProps.suffix = _handleProps(suffix, _suffix);
      }
    }

    return configProps;
  };

  /**
   * @constant
   * @param {string} placeholder
   * @param {string} label
   * @param intl
   * @return {*|null}
   */
  const handlePlaceholder = (placeholder, label, { intl }) => {
    return label ?
        _handleProps(placeholder,
            t(intl, 'form.placeholder', { field: label })) :
        null;
  };

  /**
   * @constant
   * @param {JSX.Element} Component
   * @return {boolean}
   */
  const isMissingComponentProps = (Component) => {
    if (!Component.props) {
      logger({ type: 'warn', msg: 'Missing Form.Item Component' });
      return true;
    }
  };

  /**
   * @constant
   * @param _rowChild
   * @param idx
   * @param spinOn
   * @return {unknown[]}
   * @private
   */
  const _formItem = (_rowChild, idx, spinOn) => {
    return _getChildren(_rowChild.props.children || []).map((_child, _key) => {
      if (isMissingComponentProps(_child)) return null;

      const {
        form,
        label,
        name,
        placeholder,
        suffix,
        suffixIcon,
        disabled,
        dependencies,
        tooltip,
        config = {}
      } = _child?.props;

      let { rules = [], valuePropName } = config;

      const _placeholder = handlePlaceholder(placeholder, label, { intl });
      const _props = _cleanProps(_child,
          ['config', 'hasFeedback', 'suffix', 'placeholder']);

      /**
       * @description Additional props for Form.Item
       * @type {{valuePropName}}
       */
      let rest = {};
      valuePropName && (rest.valuePropName = valuePropName);

      let configProps = {
        placeholder: disabled ? null : _placeholder,
        ..._props
      };

      // Warning: Invalid prop `placeholder` supplied to `React.Fragment`.
      if (_child?.type?.toString() === 'Symbol(react.fragment)') {
        delete configProps.placeholder;
      }

      const key = `${idx}-${_key}`;

      configProps = handleRequiredProps(rules, label, {
        intl, form, key,
        Component: _child,
        configProps,
        suffix,
        suffixIcon
      });

      const isHidden = _child?.type?.name === 'HiddenField';

      const formItem = clonedComponent(_child, configProps, {
        label,
        name,
        tooltip,
        dependencies,
        key,
        rules,
        style,
        className: isHidden && styles.hidden,
        ...rest
      });

      if (typeof spinOn === 'function' && formItem) {
        return (
            <Loader spinning={spinOn()}
                    key={`${idx}-${_key}-spinning`}>
              {formItem}
            </Loader>
        );
      }

      return formItem;
    });
  };

  /**
   * @constant
   * @return {JSX.Element[]}
   */
  const renderPanelContent = () => (
      _getChildren(children).map((_rowChild, idx) => {
        if (!_rowChild?.props) {
          throw new Error(`Add Panel content`);
        }

        const {
          inRow = true,
          gutter,
          colProps,
          spinOn,
          style,
          className
        } = _rowChild?.props;

        return inRow ? (
            <AntHillRow key={idx}
                        style={style}
                        className={className}
                        gutter={gutter}
                        colProps={colProps}>
              {_formItem(_rowChild, idx, spinOn)}
            </AntHillRow>
        ) : (
            <div key={idx}
                 style={style}
                 className={className}>
              {_formItem(_rowChild, idx, spinOn)}
            </div>
        );
      })
  );

  const panelContent = collapsible === 'disabled' ? (
      <div className={styles.disabledPanel}>
        <Spin spinning={true}/>
      </div>
  ) : renderPanelContent();

  return (
      <div data-testid={props['data-testid']}
           className={styles.collapsePanelWrapper}>
        <Collapse collapsible={collapsible}
                  onChange={onPanelChange}
                  className={classnames(styles.collapsePanel, className)}
                  defaultActiveKey={defaultActiveKey}
                  items={[
                    {
                      key: name,
                      label: header,
                      collapsible,
                      forceRender,
                      extra,
                      children: (<div>{panelContent}</div>)
                    }
                  ]}/>
      </div>
  );
};

export default GenericPanel;
