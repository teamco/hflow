import React, { useCallback } from 'react';
import { Button } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { toPng, toBlob, toCanvas, toJpeg, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';

import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';
import { logger } from '@/utils/console';
import { t } from '@/utils/i18n';

/**
 * @export
 * @default
 * @constant
 * @param {{spinOn}} props
 * @return {JSX.Element}
 */
const screenshotButton = props => {
  const intl = useIntl();

  const {
    loading,
    className,
    disabled,
    icon = <CameraOutlined/>,
    onClick = stub,
    size = 'small',
    type = 'primary',
    modelName,
    spinOn = [],
    refTarget = null,
    fileName = 'screenshot',
    format = 'png',
    quality = 0.95,
    cacheBust = true,
    filterOuts = ['i']
  } = props;

  const _spinOn = [
    ...spinOn,
    ...[
      `${modelName}/handleUpdate`,
      `${modelName}/handleSave`,
      `${modelName}/prepareToSave`
    ]];

  /**
   * @handleClick
   * @param {Event} e
   */
  const handleClick = useCallback(() => {
    if (refTarget?.current === null) {
      return false;
    }

    let result;
    switch (format) {
      case 'canvas':
        result = handleCanvas();
        break;
      case 'blob':
        result = handleBlob();
        break;
      case 'png':
        result = handlePng();
        break;
      case 'jpeg':
        result = handleJpeg();
        break;
      case 'svg':
        result = handleSvg();
        break;
    }

    result.catch(err => {
      logger({ type: 'warn', log: err });
    });

    onClick();

  }, [refTarget]);

  /**
   * @constant
   * @param {string} dataUrl
   * @private
   */
  const _download = (dataUrl) => {
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  };

  /**
   * @constant
   * @async
   * @return {Promise<void>}
   */
  const handleCanvas = async () => toCanvas(refTarget?.current);

  /**
   * @constant
   * @return {Promise<void>}
   */
  const handlePng = () => toPng(refTarget?.current, { cacheBust }).then(_download);

  /**
   * @constant
   * @return {Promise<void>}
   */
  const handleJpeg = () => toJpeg(refTarget?.current, { quality }).then(_download);

  /**
   * @constant
   * @return {Promise<Blob | null>}
   */
  const handleBlob = () => {
    return toBlob(refTarget?.current).then((blob) => {
      saveAs(blob, `${fileName}.png`);
    });
  };

  /**
   * @constant
   * @return {Promise<Blob | null>}
   */
  const handleSvg = () => {

    // E.g. Get an SVG data URL, but filter out all the <i> elements
    function _filter(node) {
      return !filterOuts.includes(node.tagName.toLowerCase());
    }

    return toSvg(refTarget?.current, { filter: _filter });
  };

  return (
      <Button key={'close'}
              size={size}
              className={className}
              disabled={disabled}
              icon={icon}
              type={type}
              loading={isSpinning(loading, _spinOn)}
              onClick={handleClick}>
        {t(intl, 'actions.screenshot')}
      </Button>
  );
};

export default screenshotButton;
