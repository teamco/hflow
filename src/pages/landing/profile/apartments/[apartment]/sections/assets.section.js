import React from 'react';
import { useIntl } from '@umijs/max';
import { Button, Col, Collapse, Form, Input, Row } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// import {
//   AdvancedImage,
//   lazyload,
//   placeholder,
//   responsive
// } from '@cloudinary/react';

import Loader from '@/components/Loader';
import EmptyData from '@/components/EmptyData';
import SimpleUploadFile from '@/components/Upload/SimpleUploadFile';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import { getImage } from '@/services/cloudinary.service';

import styles from '@/pages/landing/profile/apartments/[apartment]/profile.apartmentEdit.module.less';

export const AssetsSection = props => {
  const intl = useIntl();

  const {
    loading,
    formRef,
    disabled,
    assets,
    assetsFolder,
    signData,
    spinning,
    MODEL_NAME,
    maxImageDimensions = {},
    onFileRemove = stub,
    onFileChange = stub
    // ,plugins = [
    //   lazyload,
    //   responsive,
    //   placeholder
    // ]
  } = props;

  const uploadProps = {
    onFileRemove,
    onFileChange,
    // crop: false,
    formRef,
    maxDimensions: { ...maxImageDimensions }
  };

  const _title = t(intl, 'form.title');
  const _descLong = t(intl, 'form.description');

  const colProps = { xs: 12, sm: 12, md: 8, lg: 8, xl: 6, xxl: 6 };

  const _assets = Object.keys(assets?.[assetsFolder] ?? {});

  const assetItems = [
    {
      key: 'assets',
      label: 'This is panel header 3',
      extra: signData && !spinning ? (
          <SimpleUploadFile disabled={disabled}
                            buttonSize={'small'}
                            className={styles.uploadLogo}
                            {...uploadProps}/>
      ) : (
          <Button type={'primary'}
                  icon={<LoadingOutlined/>}
                  loading={true}/>
      ),
      children: (
          <Row gutter={[24, 24]}>
            {_assets.length ? _assets.map((asset, idx) => {
              const { public_id, secure_url } = assets?.[assetsFolder]?.[asset];

              return (
                  <Col {...colProps}
                       key={idx}
                       className={styles.uploaded}>
                    <Loader loading={loading}
                            spinning={spinning}
                            spinOn={[
                              `cloudinaryModel/cloudinarySignature`,
                              `cloudinaryModel/cloudinaryAddFile`,
                              `${MODEL_NAME}/handleUploadFile`,
                              `${MODEL_NAME}/handleRemoveFile`
                            ]}>
                      <div>
                        {/*<AdvancedImage cldImg={getImage({ public_id })}*/}
                        {/*               plugins={plugins.map(plugin => plugin())}/>*/}
                        <img src={secure_url} alt={public_id}/>
                        <div>
                          <Form.Item name={'assetTitle'}
                                     style={{ marginBottom: 12 }}>
                            <Input disabled={disabled}
                                   placeholder={t(intl, 'form.placeholder', { field: _title })}/>
                          </Form.Item>
                          <Form.Item name={'assetDescription'}
                                     style={{ marginBottom: 0 }}>
                            <Input.TextArea type={'text'}
                                            disabled={disabled}
                                            rows={4}
                                            placeholder={t(intl, 'form.placeholder', { field: _descLong })}
                                            maxLength={200}/>
                          </Form.Item>
                        </div>
                      </div>
                    </Loader>
                  </Col>
              );
            }) : (
                <Col span={24}>
                  <EmptyData/>
                </Col>
            )}
          </Row>
      )
    }
  ];

  return (
      <Collapse items={assetItems}
                defaultActiveKey={['assets']}/>
  );
};