import React from 'react';
import { Button, Modal } from 'antd';
import { ExportOutlined, EyeOutlined, CameraOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view';
import CsvDownload from 'react-json-to-csv';
import { useIntl } from '@umijs/max';

import { Can } from '@/utils/auth/can';
import { handleDownload } from '@/utils/file';

import ScreenshotButton from '@/components/Buttons/screenshot.button';
import DropdownButton from '@/components/Buttons/dropdown.button';

import { t } from '@/utils/i18n';

import styles from '@/components/Buttons/button.module.less';
import classnames from 'classnames';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const ExportButton = props => {
  const intl = useIntl();

  const {
    className,
    component,
    loading,
    disabled = false,
    preview = false,
    modelName,
    refTarget = null,
    json = [],
    spinOn = [],
    placement = 'bottomRight',
    button = {
      type: 'link',
      size: 'small'
    }
  } = props;

  const _spinOn = [
    ...spinOn,
    ...[
      `${modelName}/handleUpdate`,
      `${modelName}/handleSave`,
      `${modelName}/prepareToSave`
    ]];

  /**
   * @constant
   * @function
   * @param {string} [type]
   */
  const exportJson = (type = 'json') => {
    handleDownload({
      href: `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(json))}`,
      fileName: `${component}.${type}`
    });
  };

  /**
   * @constant
   * @function
   */
  const showExport = () => {
    Modal.info({
      title: t(intl, 'actions.export'),
      icon: (<ExportOutlined/>),
      width: 550,
      centered: true,
      closable: true,
      wrapClassName: 'exportModal',
      content: (<ReactJson src={json} theme={'monokai'}/>),
      onOk: () => exportJson(),
      okButtonProps: {
        size: 'small',
        icon: (<ExportOutlined/>)
      },
      okText: t(intl, 'actions.export')
    });
  };

  const previewItems = preview ? [
    {
      label: (
          <div onClick={showExport}>
            {t(intl, 'form.preview')}
          </div>
      ),
      key: 'preview',
      icon: <EyeOutlined/>
    },
    { type: 'divider' }
  ] : [];

  const menuItems = [
    ...previewItems,
    {
      label: (
          <Button size={button?.size}
                  type={button?.type}
                  onClick={() => exportJson()}>
            {t(intl, 'actions.exportAs', { type: 'JSON' })}
          </Button>
      ),
      key: 'exportJson',
      icon: <ExportOutlined/>
    },
    {
      label: (
          <CsvDownload data={json}
                       filename={`${component}.csv`}
                       className={classnames(styles.csv, 'ant-btn ant-btn-link', 'ant-btn-sm')}>
            <span>{t(intl, 'actions.exportAs', { type: 'CSV' })}</span>
          </CsvDownload>
      ),
      key: 'exportCsv',
      icon: <ExportOutlined/>
    },
    { type: 'divider' },
    {
      key: 'screenshot',
      icon: <CameraOutlined/>,
      label: (
          <ScreenshotButton loading={loading}
                            className={styles.screenshot}
                            type={button?.type}
                            size={button?.size}
                            icon={null}
                            component={component}
                            modelName={modelName}
                            refTarget={refTarget}/>
      )
    }
  ];

  return (
      <Can I={`${component}.export`} a={component}>
        <DropdownButton key={`export-${component}`}
                        placement={placement}
                        overlay={menuItems}
                        data-testid={'export-btn'}
                        disabled={disabled}
                        spinOn={_spinOn}
                        loading={loading}
                        icon={<ExportOutlined/>}
                        label={t(intl, 'actions.export')}
                        className={className}/>
      </Can>
  );
};

export default ExportButton;
