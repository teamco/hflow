import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { Button, Modal, Transfer } from 'antd';
import { AppstoreAddOutlined, ApiOutlined, SubnodeOutlined } from '@ant-design/icons';

import { effectHook } from '@/utils/hooks';
import { rolesToTransfer } from '@/utils/roles';
import { t } from '@/utils/i18n';
import { Can } from '@/utils/auth/can';
import { isSpinning } from '@/utils/state';

import ReloadButton from '@/components/Buttons/reload.button';

import styles from '@/pages/roles/rolesManager/manager.module.less';

export const TransferRoles = props => {
  const intl = useIntl();

  const {
    disabled,
    loading,
    title,
    roleFor,
    component,
    handleOk,
    handleCancel,
    isModalOpen,
    roles = [],
    spinOn = [],
    pagination = {},
    width = 650
  } = props;

  const [data, setData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  const filterOption = (inputValue, option) => option?.title?.indexOf(inputValue) > -1;

  const handleChange = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  const resetData = () => {
    setData([]);
    setTargetKeys([]);
  };

  const handleSearch = (dir, value) => {
    // TODO (teamco): Do something.
  };

  effectHook(() => {
    isModalOpen && handleData();
  }, [isModalOpen]);

  const handleData = () => {
    const { data, keys } = rolesToTransfer(roleFor, roles);

    setData(data);
    setTargetKeys(keys);
  };

  const renderFooter = (_, { direction }) => {
    return (
        <ReloadButton className={styles.reload}
                      disabled={disabled}
                      loading={loading}
                      spinOn={spinOn}
                      onClick={handleData}/>
    );
  };

  const renderTitle = (label, src = true) => (
      <span className={styles.transferTitle}>
        {src ? (<AppstoreAddOutlined/>) : (<ApiOutlined/>)}
        {t(intl, label)}
      </span>
  );

  return (
      <div>
        <Modal title={(
            <>
              {roleFor?.role?._roleFor}
              <SubnodeOutlined/>
              {title}
            </>
        )}
               width={width}
               className={styles.transferWrapper}
               open={isModalOpen}
               footer={[
                 <Button key={'cancel'}
                         loading={isSpinning(loading, spinOn)}
                         onClick={() => {
                           resetData();
                           handleCancel();
                         }}>
                   {t(intl, 'actions.cancel')}
                 </Button>,
                 <Can I={'update'} a={component} key={'ok'}>
                   <Button type={'primary'}
                           htmlType={'button'}
                           loading={isSpinning(loading, spinOn)}
                           disabled={disabled}
                           onClick={() => {
                             resetData();
                             handleOk(title, data, targetKeys, roleFor);
                           }}>
                     {t(intl, 'actions.ok')}
                   </Button>
                 </Can>
               ]}>
          <Transfer dataSource={data}
                    showSearch
                    disabled={disabled}
                    pagination={{ pageSize: 20, ...pagination }}
                    titles={[
                      renderTitle('status.source', true),
                      renderTitle('status.assigned', false)
                    ]}
                    className={styles.transfer}
                    targetKeys={targetKeys}
                    filterOption={filterOption}
                    onChange={handleChange}
                    onSearch={handleSearch}
                    footer={renderFooter}
                    render={(item) => item.title}/>
        </Modal>
      </div>
  );
};