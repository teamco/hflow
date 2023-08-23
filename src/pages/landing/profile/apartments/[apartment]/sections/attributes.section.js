import React, { useState } from 'react';
import { Col, Form, Row, Input, Divider, Select } from 'antd';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import { requiredField } from '@/components/Form';

import {
  BathIcon,
  BedIcon,
  FloorIcon,
  ParkingIcon,
  RulerIcon,
  WaterHeaterTypeIcon,
  WindowIcon
} from '@/components/Icons';

import styles from '../profile.apartmentEdit.module.less';

export const AttributesSection = props => {
  const intl = useIntl();
  const [features, setFeatures] = useState([]);

  const {
    enums = {},
    disabled
  } = props;

  const col2Props = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };

  const _attrs = t(intl, 'apartment.form.attributes');
  const _props = t(intl, 'apartment.propertyFeatures');

  const handleProps = value => {
    const _prop = (enums?.properties ?? []).find(p => p.name === value);
    const _features = [...features];

    _features.push(_prop);
    setFeatures(_features);
  };

  return (
      <div className={styles.attributes}>
        <Row gutter={[24, 24]}>
          <Col {...col2Props}>
            <Form.Item label={_attrs}
                       name={'attributes'}
                       rules={[
                         requiredField(intl, _attrs, true)
                       ]}
                       tooltip={requiredField(intl, _attrs).message}
                       disabled={disabled}>
              <Select mode={'multiple'}
                      allowClear
                      style={{ width: '100%' }}
                      placeholder={t(intl, 'form.placeholder', { field: _attrs })}
                      options={[
                        ...(enums?.attributes ?? []).map((attr, idx) => ({
                          label: t(intl, `apartment.${attr}`),
                          value: attr,
                          key: idx
                        }))]}/>
            </Form.Item>
          </Col>
          <Col {...col2Props}>
            <Form.Item label={_props}
                       name={'properties'}
                       rules={[
                         requiredField(intl, _props, true)
                       ]}
                       tooltip={requiredField(intl, _props).message}
                       disabled={disabled}>
              <Select style={{ width: '100%' }}
                      onChange={handleProps}
                      placeholder={t(intl, 'form.placeholder', { field: _props })}
                      options={[
                        ...(enums?.properties ?? []).map((prop, idx) => ({
                          label: t(intl, `apartment.${prop.name}`),
                          value: prop.name,
                          key: idx
                        }))]}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            {features.map((f, idx) => {
              const _label = t(intl, `apartment.${f.name}`);
              const Component = f.Component;
              const _args = {
                min: f?.range?.[0],
                max: f?.range?.[1],
                picker: f?.picker,
                addonBefore: f?.addonBefore
              };

              return (
                  <Form.Item label={_label}
                             name={f.name}
                             rules={[
                               requiredField(intl, _label, true)
                             ]}
                             tooltip={requiredField(intl, _label).message}
                             disabled={disabled}>
                    <Component {..._args}/>
                  </Form.Item>
              );
            })}
          </Col>
        </Row>
      </div>
  );
};