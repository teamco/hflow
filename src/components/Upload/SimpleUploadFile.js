import React, { useRef, useState } from 'react';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import './upload.less';

const SimpleUploadFile = props => {
  const intl = useIntl();

  const {
    formRef,
    buttonType = 'primary',
    buttonSize = 'default',
    disabled = false,
    allowed = ['image/png', 'image/jpeg', 'image/jpg'],
    className,
    onFileChange = stub,
    onFileRemove = stub
  } = props;

  const inputRef = useRef(null);

  /**
   * @constant
   * @param {Event|{target:{files}}} e
   */
  const handleFileChange = (e) => {
    if (e.target.files) {
      const _file = e.target.files[0];
      onFileChange({ file: _file });
    }
  };

  /**
   * @constant
   * @param {Event|{preventDefault, stopPropagation}} e
   */
  const handleUploadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    inputRef?.current?.click?.();
  };

  return (
      <div className={classnames(className, 'site-upload-wrapper')}>
        <div onClick={e => {
          e.stopPropagation();
        }}>
          <input type={'file'}
                 ref={inputRef}
                 accept={allowed.join(', ')}
                 style={{ display: 'none' }}
                 onChange={handleFileChange}/>
          <Button type={buttonType}
                  size={buttonSize}
                  disabled={disabled}
                  icon={<UploadOutlined/>}
                  onClick={handleUploadClick}>
            {t(intl, 'form.selectFile')}
          </Button>
        </div>
      </div>
  );
};

export default SimpleUploadFile;
