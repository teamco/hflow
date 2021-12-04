import React, { Component } from 'react';
import { Collapse, Form, Spin } from 'antd';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import { getSuffix } from 'components/Form';
import styles from 'components/Form/form.module.less';

import Grid from 'components/Grid';
import MandatoryTextarea from './MandatoryTextarea';

const { AntHillRow } = Grid;
const { Panel } = Collapse;

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

class GenericPanel extends Component {
  state = {};

  render() {
    const {
      t,
      children,
      defaultActiveKey,
      header,
      name,
      inRow = true,
      collapsible = 'header',
      className = ''
    } = this.props;

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
     * @constant
     * @param _rowChild
     * @param idx
     * @return {unknown[]}
     * @private
     */
    const _formItem = (_rowChild, idx) => {
      return _getChildren(_rowChild.props.children || []).map((_child, _key) => {
        const {
          form,
          label,
          name,
          span,
          placeholder,
          suffix,
          suffixIcon,
          disabled,
          dependencies,
          tooltip,
          config = {}
        } = _child.props;

        let { rules = [], valuePropName } = config;

        const _isRequired = rules.find(rule => rule.required);
        if (_isRequired && !_isRequired.message) {
          _isRequired.message = t('form:required', { field: label });
        }
        const _placeholder = label ?
            _handleProps(placeholder, t('form:placeholder', { field: label })) :
            null;

        const _props = _cleanProps(_child, ['config', 'hasFeedback', 'form']);
        let rest = {};
        valuePropName && (rest.valuePropName = valuePropName);

        let configProps = {
          placeholder: disabled ? null : _placeholder,
          ..._props
        };

        if (_isRequired) {
          const _suffix = getSuffix(t, form, name, label);

          if (_child.type === MandatoryTextarea) {
            // TODO (teamco): Do something
            configProps.key = `${idx}-${_key}`;

            return React.isValidElement(_child) ?
                React.cloneElement(_child, { ...configProps }) : null;
          }

          /**
           * Handle Select component
           * @link https://ant.design/components/select/
           */
          if (_child.type.Option) {
            if (!suffixIcon) {
              configProps.suffixIcon = _handleProps(suffix, _suffix);
            }
          } else if (!suffix) {
            configProps.suffix = _handleProps(suffix, _suffix);
          }
        }

        return React.isValidElement(_child) ? (
            <Form.Item label={label}
                       name={name}
                       span={span}
                       tooltip={tooltip}
                       shouldUpdate
                       dependencies={dependencies}
                       key={`${idx}-${_key}`}
                       rules={rules}
                       {...rest}>
              {React.cloneElement(_child, { ...configProps })}
            </Form.Item>
        ) : null;
      });
    };

    return (
        <Collapse collapsible={collapsible}
                  className={classnames(styles.collapsePanel, className)}
                  defaultActiveKey={defaultActiveKey}>
          <Panel header={header}
                 key={name}>
            {collapsible === 'disabled' ? (
                    <div className={styles.disabledPanel}>
                      <Spin spinning={true}/>
                    </div>
                ) :
                _getChildren(children).map((_rowChild, idx) => {
                  return _rowChild ? inRow ? (
                      <AntHillRow key={idx}>
                        {_formItem(_rowChild, idx)}
                      </AntHillRow>
                  ) : (
                      <div key={idx}
                           style={{
                             display: 'flex',
                             padding: '8px 0',
                             flexFlow: 'wrap'
                       }}>
                    {_formItem(_rowChild, idx)}
                  </div>
              ) : null;
            })}
          </Panel>
        </Collapse>
    );
  }
}

export default withTranslation()(GenericPanel);
