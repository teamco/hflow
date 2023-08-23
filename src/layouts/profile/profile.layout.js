import React from 'react';
import { Outlet } from '@umijs/max';
import { Layout } from 'antd';

import LandingPage from '@/layouts/landing/page';

import { Can } from '@/utils/auth/can';
import { componentAbilities } from '@/utils/auth/component.setting';
import { isTouched } from '@/utils/state';

import ProfileSubheader from '@/layouts/profile/profile.subheader';
import ProfileMenu from '@/layouts/profile/profile.menu';

import PagePrompt from '@/components/Page/Prompt';

import Page403 from '@/pages/403';

import landingStyles from '@/pages/landing/landing.module.less';
import { effectHook } from '@/utils/hooks';
import Loader from '@/components/Loader';

const { Content, Footer } = Layout;

const MODEL_NAME = 'profileModel';

const ProfileLayout = props => {
  const {
    authModel,
    landingModel,
    profileModel,
    profileAddressModel,
    profileEmailModel,
    profileLinkModel,
    profileLogoModel,
    loading,
    onToggleMenu,
    onQuery
  } = props;

  const {
    header: { position }
  } = landingModel;

  const contentProps = {
    className: position === 'fixed' ? landingStyles.contentFixed : null
  };

  const profileMenuProps = {
    authModel,
    profileModel,
    loading,
    onToggleMenu
  };

  const { isEdit, isNew } = profileModel;
  const { user } = authModel;

  const touched = isTouched([
    profileModel,
    profileAddressModel,
    profileEmailModel,
    profileLinkModel,
    profileLogoModel
  ]);

  const component = 'profile';
  const {
    ability,
    ableFor,
    disabled,
    canUpdate
  } = componentAbilities(authModel, component, isEdit);

  effectHook(() => {
    user && onQuery();
  }, [user]);

  return (
      <LandingPage spinEffects={[`${MODEL_NAME}/getProfileData`]}>
        <Layout style={{ minHeight: '100vh' }} {...contentProps}>
          <ProfileMenu {...profileMenuProps}/>
          <Layout>
            <ProfileSubheader model={profileModel}
                              ableFor={ableFor}
                              loading={loading}
                              disabled={disabled}
                              isNew={isNew}/>
            <Content>
              <Can I={'manage'} a={'profile'}>
                <PagePrompt touched={touched}/>
                <Loader spinning={!user}
                        loading={loading}
                        spinOn={[`${MODEL_NAME}/query`]}>
                  <Outlet/>
                </Loader>
              </Can>
              <Page403 component={'profile'} ableFor={'manage'}/>
            </Content>
            <Footer>TODO: Welcome Home</Footer>
          </Layout>
        </Layout>
      </LandingPage>
  );
};

export default ProfileLayout;
