import React from 'react';
import { Layout, Spin } from 'antd';
import classnames from 'classnames';

import Page403 from '@/pages/403';

import PagePrompt from '@/components/Page/Prompt';
import Loader from '@/components/Loader';

import { isSpinning } from '@/utils/state';
import { effectHook } from '@/utils/hooks';
import { Can } from '@/utils/auth/can';

import styles from '@/components/Page/page.module.less';

const { Content } = Layout;

/**
 * @function
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export function Page(props) {
  const {
    authModel,
    pageModel,
    loading,
    spinEffects = [],
    ableFor = 'read',
    className,
    component,
    touched,
    onQuery
  } = props;

  const { gridLayout } = pageModel;
  const { serverUserId } = authModel;

  effectHook(() => {
    onQuery();
  });

  const spinning = isSpinning(loading, spinEffects, false, true);

  return (
      <Layout className={classnames(styles.layout)}>
        <Layout className={'site-layout'}>
          <Content className={classnames(
              styles.page,
              className,
              styles[gridLayout ? 'grid' : 'card']
          )}>
            <Loader spinning={!!spinning}
                    loading={loading}
                    spinOn={spinEffects}>
              {serverUserId ? (
                  <Can I={ableFor} a={component}>
                    <PagePrompt touched={touched}/>
                    <div component={component} className={styles.pageContent}>
                      {props.children}
                    </div>
                  </Can>
              ) : null}
              <Page403 component={component}
                       ableFor={ableFor}/>
            </Loader>
          </Content>
        </Layout>
      </Layout>
  );
}