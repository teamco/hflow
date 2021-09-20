import React from 'react';
import {withTranslation} from 'react-i18next';
import {Button, message, Tooltip, Upload} from 'antd';
import {
  UploadOutlined,
  InboxOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import {Link} from 'umi';
import ImgCrop from 'antd-img-crop';
import classnames from 'classnames';

import {download} from 'utils/file';
import {errorDownloadMsg} from 'utils/message';

import './upload.less';

const {Dragger} = Upload;

class UploadFile extends React.Component {
  state = {
    ableToDownload: true
  };

  render() {
    const {
      t,
      field,
      limit = 1,
      type = 'image',
      preview = true,
      crop = true,
      listType = 'text',
      ui = 'button',
      allowed = ['image/png', 'image/jpeg'],
      onFileChange,
      onFileRemove,
      className = '',
      uploadedFiles
    } = this.props;

    const fileProps = uploadedFiles[field] || {
      fileList: []
    };

    /**
     * @constant
     * @param file
     * @return {*}
     * @private
     */
    const _isImage = file => {
      return file.type ?
          file.type.match(/image/) :
          file.match(/data:image/);
    };

    /**
     * @constant
     * @param file
     * @return {Promise<void>}
     */
    const onPreview = async file => {
      let src = file.url;
      if (!src) {
        src = await new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow.document.write(image.outerHTML);
    };

    let uploadProps = {
      accept: allowed,
      fileList: fileProps.fileList,
      listType,
      beforeUpload(file) {
        if (allowed.indexOf(file.type) < 0) {
          return message.error(t('form:uploadTypeError', {name: file.name}));
        }
        onFileRemove({file, field});
        onFileChange({file, field});
        return false;
      },
      onRemove(file) {
        onFileRemove({file, field});
      },
      progress: {
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068'
        },
        strokeWidth: 3,
        format: percent => `${parseFloat(percent.toFixed(2))}%`
      }
    };

    type === 'image' && preview && (uploadProps = {...uploadProps, ...{onPreview}});

    const _card = (<div><UploadOutlined/> {t('form:selectFile')}</div>);
    const _button = (
        <Button type={'primary'}>
          {_card}
        </Button>
    );

    const _dragger = (
        <Dragger {...uploadProps}>
          <p className={'ant-upload-drag-icon'}><InboxOutlined/></p>
          <p className={'ant-upload-text'}>{t('form:uploadText')}</p>
          <p className={'ant-upload-hint'}>{t('form:uploadHint')}</p>
        </Dragger>
    );

    const _upload = ui === 'dragger' ? _dragger : (
        <Upload {...uploadProps}
                className={classnames(className, 'site-upload')}>
          {fileProps.fileList?.length < limit && listType === 'picture-card' ? _card : _button}
        </Upload>
    );

    let _render = _upload;

    if (type === 'image') {
      _render = crop ? (
          <ImgCrop rotate>
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
      const isBase64 = fileProps?.previewUrl.match(/base64/);

      if (isBase64) {
        const extension = fileProps?.previewUrl.split(';')[0].split('/')[1];
        return `${fileName}.${extension}`;
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
      const _file = getFileName(fileProps?.fileName);
      url = url || fileProps?.previewUrl;

      // Prevent multiple clicks.
      this.state.ableToDownload &&
      download(url, _file).then(() => {
        this.setState({ableToDownload: true});
      }).catch(error => {
        errorDownloadMsg(_file);
        this.setState({ableToDownload: true});
      });

      this.setState({ableToDownload: false});
    };

    /**
     * @constant
     * @param content
     * @return {JSX.Element}
     */
    const fileInfo = content => (
        <div className={'file-info'}>
          <Link to={'/downloadFile'}
                onClick={onDownloadFile}>
            <Tooltip title={t('actions:download')}>
              {content}
            </Tooltip>
          </Link>
        </div>
    );

    return (
        <div className={'site-upload-wrapper'}>
          {fileProps?.previewUrl ? _isImage(fileProps?.fileList[0] || fileProps?.previewUrl) ? (
              <div className={'site-upload-preview'}>
                {fileInfo(<img src={fileProps?.previewUrl}
                               alt={fileProps?.previewUrl}/>)}
              </div>
          ) : (
              <div className={'site-upload-preview file-done'}>
                {fileInfo(<FileDoneOutlined/>)}
              </div>
          ) : null}
          {_render}
        </div>
    );
  }
}

export default withTranslation()(UploadFile);
