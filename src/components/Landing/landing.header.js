import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { history, NavLink } from 'umi';
import { Col, Dropdown, Menu, Row } from 'antd';
import classnames from 'classnames';

import { BellTwoTone, CommentOutlined, HeartTwoTone, PlusOutlined } from '@ant-design/icons';

import SignIn from 'components/Authentication/signIn.connect';

import styles from 'components/Landing/landing.module.less';

/**
 * @export
 * @default
 * @param props
 * @return {JSX.Element}
 */
const landingHeader = props => {

  const {
    t,
    icon,
    title,
    topUnder,
    user,
    onSignOut,
    position = 'absolute',
    country = 'CA'
  } = props;

  const [transform, setTransform] = useState(false);
  const [forceSignInVisible, setForceSignInVisible] = useState(false);

  /**
   * @constant
   * @param event
   */
  const handleScroll = event => {
    event.preventDefault();
    let scrollTop = window.scrollY;
    setTransform(scrollTop > topUnder);
  };

  useEffect(() => {
    if (position === 'fixed') {
      window.addEventListener('scroll', handleScroll);

      // Returned function will be called on component unmount
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  /**
   * @constant
   * @param {Event} e
   */
  const handleHomeNavigation = e => {
    e.preventDefault();
    history.push('/');
  };

  /**
   * @constant
   * @param {Event} e
   */
  const handleSignIn = e => {
    e.preventDefault();
    setForceSignInVisible(true);
  };

  /**
   * @constant
   * @param {Event} e
   */
  const handleSignOut = e => {
    e.preventDefault();
    onSignOut();
  };

  const menu = (
      <Menu>
        <Menu.Item key={'signOut'}>
          <div onClick={handleSignOut}>
            {t('auth:signOut')}
          </div>
        </Menu.Item>
      </Menu>
  );

  return (
      <header className={classnames(styles.header, transform ? styles.transform : '')}
              style={{ position }}>
        <Row>
          <Col span={6}>
            <img src={icon}
                 className={styles.icon}
                 alt={t(title)}/>
          </Col>
          <Col span={18}>
            <Row justify={'end'}
                 gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              <Col className={styles.headerText}>
                <CommentOutlined/>
                <span>{t('landing:help')}</span>
              </Col>
              <Col className={styles.headerText}>
                <SignIn forceLogin={true}
                        closable={true}
                        signInVisible={forceSignInVisible}
                        setForceSignInVisible={setForceSignInVisible}
                        className={styles.headerAuth}/>
                {user ? (
                    <div style={{ display: 'flex' }}>
                      <div className={styles.actions}>
                        <HeartTwoTone twoToneColor={'#ccc'}/>
                        <NavLink to={`/admin/users/${user.id}/notifications`}>
                          <BellTwoTone twoToneColor={'#ccc'}/>
                        </NavLink>
                        <NavLink to={`/admin/users/${user.id}/notifications`}
                                 className={styles.ads}>
                          <PlusOutlined/>
                          {t('landing:ads')}
                        </NavLink>
                      </div>
                      <Dropdown overlay={menu}
                                trigger={['click']}
                                placement={'bottomRight'}>
                        <span>
                          {t(user.displayName)}
                        </span>
                      </Dropdown>
                    </div>
                ) : (
                    <>
                      <span onClick={handleSignIn}>{t('auth:signIn')}</span>
                    </>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </header>
  );
};

export default withTranslation()(landingHeader);
