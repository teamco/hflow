import React from 'react';
import { Layout, Tooltip } from 'antd';
import { useIntl } from '@umijs/max';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

import ReloadButton from '@/components/Buttons/reload.button';
import CloseButton from '@/components/Buttons/close.button';

import styles from '@/components/Main/Sider/sider.module.less';

const { Header, Footer, Content } = Layout;

/**
 * @constant
 * @returns {false|JSX.Element}
 * @constructor
 */
export const SiderLayout = (props) => {
  const intl = useIntl();

  const {
    header,
    name,
    loading,
    footer = false,
    onClose = stub(),
    onReload = stub()
  } = props;

  return (
      <Layout className={styles.siderLayout}>
        <Header>
          {header}
          <div className={styles.actions}>
            {onReload && (
                <Tooltip title={t(intl, 'actions.reload')}>
                  <ReloadButton className={styles.reload}
                                loading={loading}
                                onClick={onReload}/>
                </Tooltip>
            )}
            <CloseButton className={styles.close}
                         loading={loading}
                         onClick={() => onClose(name)}/>
          </div>
        </Header>
        <Content>{props.children}</Content>
        {footer && (<Footer>{footer}</Footer>)}
      </Layout>
  );
};