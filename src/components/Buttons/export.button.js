import React from 'react';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { DownOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view';
import { withTranslation } from 'react-i18next';

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
  const {
    t,
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
      title: t('actions:export'),
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
      okText: t('actions:export')
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
              {t('form:preview')}
            </Menu.Item>
        )}
        <Menu.Item key={'download'}
                   onClick={exportFile}
                   icon={<ExportOutlined/>}>
          {t('actions:download')}
        </Menu.Item>
      </Menu>
  );

  return (
      <Can I={'export'} a={component}>
        <Dropdown overlay={menu}>
          <Button size={'small'}
                  loading={loading}
                  disabled={disabled}
                  icon={<ExportOutlined/>}
                  type={'primary'}>
            {t('actions:export')} <DownOutlined className={styles.export}/>
          </Button>
        </Dropdown>
      </Can>
  );
};

export default withTranslation()(ExportButton);