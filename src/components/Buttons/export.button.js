import React from 'react';
import { Button, Modal } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view';
import { withTranslation } from 'react-i18next';

import { Can } from '@/utils/auth/can';
import { handleDownload } from '@/utils/file';

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
    json = []
  } = props;

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
      onOk() {
        handleDownload({
          href: `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(json))}`,
          fileName: `${component}.json`
        });
      },
      okButtonProps: {
        size: 'small',
        icon: (<ExportOutlined/>)
      },
      okText: t('actions:export')
    });
  };

  return (
      <Can I={'export'} a={component}>
        <Button size={'small'}
                loading={loading}
                disabled={disabled}
                icon={<ExportOutlined/>}
                onClick={showExport}
                type={'primary'}>
          {t('actions:export')}
        </Button>
      </Can>
  );
};

export default withTranslation()(ExportButton);
