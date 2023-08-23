import React, { useState } from 'react';
import { Button, message, Tooltip, Upload } from 'antd';
import {
  FileDoneOutlined,
  InboxOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { Link, useIntl } from '@umijs/max';
import ImgCrop from 'antd-img-crop';
import classnames from 'classnames';

import {
  downloadFromUrl,
  getExtension,
  getImageDimensions
} from '@/utils/file';
import { errorDownloadMsg } from '@/utils/message';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { normalize } from '@/utils/string';
import { effectHook } from '@/utils/hooks';

import './upload.less';

const { Dragger } = Upload;

const UploadFile = props => {
  const intl = useIntl();

  const {
    formRef,
    field,
    limit = 1,
    type = 'image',
    buttonType = 'primary',
    buttonSize = 'default',
    preview = true,
    crop = true,
    disabled = false,
    listType = 'text',
    maxCount = 1,
    ui = 'button',
    allowed = ['image/png', 'image/jpeg', 'image/jpg'],
    className,
    uploadedFiles,
    maxDimensions,
    onClick = stub,
    onFileChange = stub,
    onFileRemove = stub
  } = props;

  const [messageApi, contextHolder] = message.useMessage();
  const [ableToDownload, setAbleToDownload] = useState(true);
  const [uploadMsg, setUploadMsg] = useState(null);

  const fileProps = uploadedFiles[field] || {
    fileList: []
  };

  const isFileUploaded = fileProps?.fileList[0] || fileProps?.previewUrl;

  effectHook(async () => {
    if (uploadMsg) {
      setUploadMsg(null);

      if (uploadMsg.type === 'warning' || uploadMsg.type === 'error') {

        console.warn(uploadMsg.error);
        messageApi[uploadMsg.type](uploadMsg.error, 5);
        handleRemove(fileProps);

      } else if (uploadMsg.type === 'success') {
        messageApi.success(`${fileProps.fileName} file uploaded successfully`);
      }
    }
  }, [uploadMsg]);

  const handleRemove = (fileProps) => {
    onFileRemove({ fileProps, field });
    handleClean();
  };

  const handleClean = () => {
    formRef.setFieldsValue({ [field]: null });
  };

  /**
   * @constant
   * @param file
   * @return {*}
   * @private
   */
  const _isImage = file => {
    return file?.type ?
        file.type.match(/image/) :
        file?.match(/data:image/);
  };

  /**
   * @constant
   * @param file
   * @return {Promise<void>}
   */
  const onPreview = async file => {
    let src = file?.url;
    const image = new Image();

    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  let uploadProps = {
    disabled,
    listType,
    maxCount,
    accept: allowed,
    fileList: fileProps.fileList,
    beforeUpload(file) {
      if (allowed.indexOf(file.type) < 0) {
        const error = t(intl, 'form.uploadTypeError', { name: file.name });
        return setUploadMsg({ type: 'error', error });
      }

      handleClean();
      onFileChange({ file, field });
    },
    onRemove(file) {
      handleRemove(file);
    },
    async onChange(info) {
      if (info.file.status !== 'uploading') {
        console.info(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        setUploadMsg({ type: 'success' });
      } else if (info.file.status === 'error') {
        setUploadMsg({
          type: 'error',
          error: `${info.file.name} file upload failed.`
        });
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068'
      },
      strokeWidth: 3,
      format: percent => percent && `${parseFloat(percent.toFixed(2))}%`
    }
  };

  type === 'image' && preview && (
      uploadProps = { ...uploadProps, ...{ onPreview } }
  );

  if (type === 'image' && maxDimensions && fileProps?.previewUrl && !uploadMsg) {
    getImageDimensions({ url: fileProps?.previewUrl }).then(async (dims) => {
      if (dims && (maxDimensions?.width < dims.width ||
          maxDimensions?.height < dims.height)) {

        const error = t(intl, 'form.uploadDimsError', {
          width: maxDimensions?.width,
          height: maxDimensions?.height
        });

        setUploadMsg({ type: 'warning', error });
      }
    });
  }

  const _card = (
      <div>
        <UploadOutlined/>
        {t(intl, 'form.selectFile')}
      </div>
  );

  const _button = (
      <Button type={buttonType}
              size={buttonSize}>
        {_card}
      </Button>
  );

  const _dragger = (
      <Dragger {...uploadProps}
               disabled={disabled}>
        <p className={'ant-upload-drag-icon'}><InboxOutlined/></p>
        <p className={'ant-upload-text'}>
          {t(intl, 'form.uploadText')}
        </p>
        <p className={'ant-upload-hint'}>
          {t(intl, 'form.uploadHint')}
        </p>
      </Dragger>
  );

  const uploadComponent = fileProps.fileList?.length < limit &&
  listType === 'picture-card' ? _card : _button;

  const _upload = ui === 'dragger' ? _dragger : (
      <Upload {...uploadProps}
              disabled={disabled}
              className={'site-upload'}>
        {uploadComponent}
      </Upload>
  );

  let _render = _upload;

  if (type === 'image') {
    _render = crop ? (
        <ImgCrop showGrid zoomSlider rotationSlider aspectSlider>
          {_upload}
        </ImgCrop>
    ) : _upload;
  }

  /**
   * @constant
   * @param {string} fileName
   * @return {string|*}
   */
  const getFileName = fileName => {
    const isBase64 = fileProps?.previewUrl?.match(/base64/);

    if (isBase64) {
      const extension = getExtension(fileProps?.previewUrl);
      const _fileParts = fileName.split('.');
      return _fileParts[_fileParts.length - 1] === extension ?
          fileName :
          `${fileName}.${extension}`;
    }

    return fileName;
  };

  /**
   * @constant
   * @param event
   * @param [url]
   */
  const onDownloadFile = (event, url) => {
    event.preventDefault();
    const _file = getFileName(normalize(fileProps?.fileName));
    const _url = url ?? fileProps?.previewUrl;

    // Prevent multiple clicks.
    ableToDownload && !disabled && downloadFromUrl(_url, _file).then(() => {
      setAbleToDownload(true);
    }).catch(async error => {
      console.warn(error);
      await errorDownloadMsg(intl, _file);
      setAbleToDownload(true);
    });

    setAbleToDownload(false);
  };

  /**
   * @constant
   * @param content
   * @return {JSX.Element}
   */
  const fileInfo = content => (
      <div className={'file-info'}>
        <Link to={`/download/${normalize(fileProps?.fileName)}`}
              onClick={onDownloadFile}>
          <Tooltip title={t(intl, 'actions.download')}>
            {content}
          </Tooltip>
        </Link>
      </div>
  );

  const previewComponent = _isImage(isFileUploaded) ? (
      <div className={'site-upload-preview'}>
        {fileInfo(<img src={fileProps?.previewUrl}
                       alt={fileProps?.fileName}/>)}
      </div>
  ) : (
      <div className={'site-upload-preview file-done'}>
        {fileInfo(<FileDoneOutlined/>)}
      </div>
  );

  return (
      <div className={classnames(className, 'site-upload-wrapper')}>
        {contextHolder}
        {fileProps?.previewUrl ? (<div>{previewComponent}</div>) : null}
        {isFileUploaded && (
            <div>
              <div className={'uploaded-file-name'}>
                <Tooltip title={getFileName(fileProps?.fileName)}>
                  {getFileName(fileProps?.fileName)}
                </Tooltip>
              </div>
            </div>
        )}
        <div onClick={e => {
          e.preventDefault();
          e.stopPropagation();

          onClick();
        }}>
          {_render}
        </div>
      </div>
  );
};

export default UploadFile;
