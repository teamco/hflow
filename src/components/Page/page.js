import React from 'react';
import { Prompt, connect } from 'umi';
import { Layout, Row, Spin } from 'antd';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';

import { Can } from 'utils/auth/can';
import Page403 from 'pages/403';

import styles from 'components/Page/page.module.less';

const { Content } = Layout;

/**
 * @function
 * @param t
 * @param pageModel
 * @param loading
 * @param spinEffects
 * @param children
 * @param className
 * @param component
 * @param touched
 * @return {JSX.Element}
 * @constructor
 */
function Page({
  t,
  pageModel,
  loading,
  spinEffects = [],
  children,
  className,
  component,
  touched
}) {

  const spinning = Object.keys(loading.effects).
      filter(effect =>
          spinEffects.indexOf(effect) > -1 &&
          loading.effects[effect]
      );

  return (
      <Layout className={classnames(styles.layout)}>
        <Layout className={'site-layout'}>
          <Content className={classnames(styles.page, className)}>
            <Row style={{ height: '100%' }}>
              <Spin spinning={spinning.length > 0}>
                <Can I={'read'} a={component}>
                  {touched && (
                      <Prompt when={true}
                              message={location => {
                                // TODO (teamco): Do something with location.
                                return t('msg:unsaved');
                              }}/>
                  )}
                  <div component={component}>
                    {children}
                  </div>
                </Can>
                <Page403 component={component}/>
              </Spin>
            </Row>
          </Content>
        </Layout>
      </Layout>
  );
}

export default connect(
    ({ pageModel, loading }) => ({ pageModel, loading }),
    (dispatch) => ({ dispatch })
)(withTranslation()(Page));
