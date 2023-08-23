import React, { useState } from 'react';
import { Button, Spin } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import {
  cloudinaryAPI,
  cloudinaryConfig
} from '@/services/config/cloudinary.config';

import { useExternalScript } from '@/utils/dom';
import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';

const CloudinaryUploadWidget = props => {
  const intl = useIntl();

  const {
    signData,
    folder,
    unsignedUpload = false
  } = props;

  const [visible, setVisible] = useState(false);
  const [uploadWidget, setUploadWidget] = useState(null);

  const _statusApi = useExternalScript(cloudinaryAPI.Widget_API);

  effectHook(() => {
    if (_statusApi === 'ready') setVisible(true);
  }, [_statusApi]);

  let config = {
    folder,
    cloudName: cloudinaryConfig.cloudName
  };

  if (unsignedUpload) {
    config.upload_preset = cloudinaryConfig.uploadPreset;
  } else {
    config.api_key = signData?.apiKey;
    config.signature = signData?.signature;
    config.timestamp = signData?.timeStamp;
  }

  const handleUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (uploadWidget) {
      uploadWidget.show();
    } else {

      // TODO (teamco): Fix code.
      const _widget = window.cloudinary.createUploadWidget(
          { ...config },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              console.log('Done! Here is the image info: ', result.info);
              // document.getElementById('uploadedimage').setAttribute('src', result.info.secure_url);
            }
          }
      );

      _widget.open();

      setUploadWidget(_widget);
    }
  };

  return visible ? (
      <Button size={'small'}
              type={'primary'}
              icon={<CloudUploadOutlined/>}
              onClick={handleUpload}>
        {t(intl, 'form.upload')}
      </Button>
  ) : (
      <Spin spinning={true}/>
  );
};

export default CloudinaryUploadWidget;