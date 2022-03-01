import React from 'react';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { DownOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view';
import { useIntl } from 'umi';

import { Can } from '@/utils/auth/can';
import { handleDownload } from '@/utils/file';

import styles from './button.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const ExportButton = props => {
  const intl = useIntl();
  const {
    component,
    loading = false,
    disabled = false,
    preview = false,
    json = []
  } = props;

  /**
   * @constant
   * @function
   */
  const exportFile = () => {
    handleDownload({
      href: `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(json))}`,
      fileName: `${component}.json`
    });
  };

  /**
   * @constant
   * @function
   */
  const showExport = () => {
    Modal.info({
      title: intl.formatMessage({id: 'actions.export', defaultMessage: 'Export'}),
      icon: (<ExportOutlined/>),
      width: 550,
      centered: true,
      closable: true,
      wrapClassName: 'exportModal',
      content: (<ReactJson src={json} theme={'monokai'}/>),
      onOk: exportFile,
      okButtonProps: {
        size: 'small',
        icon: (<ExportOutlined/>)
      },
      okText: intl.formatMessage({id: 'actions.export', defaultMessage: 'Export'})
    });
  };

  /**
   * @constant
   * @type {JSX.Element}
   */
  const menu = (
      <Menu>
        {preview && (
            <Menu.Item key={'preview'}
                       onClick={showExport}
                       icon={<EyeOutlined/>}>
              {intl.formatMessage({id: 'form.preview', defaultMessage: 'Preview'})}
            </Menu.Item>
        )}
        <Menu.Item key={'download'}
                   onClick={exportFile}
                   icon={<ExportOutlined/>}>
          {intl.formatMessage({id: 'actions.download', defaultMessage: 'Download'})}
        </Menu.Item>
      </Menu>
  );

  return (
      <Can I={'export'} a={component}>
        <Dropdown overlay={menu}
                  data-testid={'export-btn'}>
          <Button size={'small'}
                  loading={loading}
                  disabled={disabled}
                  icon={<ExportOutlined/>}
                  type={'primary'}>
            {intl.formatMessage({id: 'actions.export', defaultMessage: 'Export'})} <DownOutlined className={styles.export}/>
          </Button>
        </Dropdown>
      </Can>
  );
};

export default ExportButton;
