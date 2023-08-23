import React, { useState } from 'react';
import {
  ApiOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { Affix } from 'antd';

import { Can } from '@/utils/auth/can';
import { effectHook } from '@/utils/hooks';
import { stub } from '@/utils/function';

import {
  apartmentMenu,
  historyMenu,
  profileMenu,
  subscriptionMenu
} from '@/services/profile.menu.service';
import { handleDisabledMenus } from '@/services/menu.service';

import Main from '@/components/Main';

import profileStyles from '@/layouts/profile/profile.module.less';

const MODEL_NAME = 'profileModel';

const ProfileMenu = props => {
  const {
    authModel,
    profileModel,
    loading,
    offsetTop = 48,
    fixed = true,
    onToggleMenu = stub
  } = props;

  const {
    trialedFeatures = [],
    collapsibleMenu,
    collapsedMenu,
    sUser
  } = profileModel;

  const menuProps = {
    loading,
    authModel,
    isSider: true,
    defaultDims: {
      min: 80,
      max: 250
    }
  };

  let trialedFeaturesMenu = collapsibleMenu ?
      trialedFeatures?.map(m => ({ ...m, icon: <ApiOutlined/> })) :
      trialedFeatures;

  const trialMenu = {
    disabled: !trialedFeatures?.length,
    key: 'profile.trialed',
    icon: <ExperimentOutlined/>,
    items: [...trialedFeaturesMenu]
  };

  const menuData = [
    profileMenu,
    apartmentMenu,
    subscriptionMenu,
    historyMenu,
    trialMenu
  ];

  const [menuItems, setMenuItems] = useState([...menuData]);

  effectHook(() => {
    if (sUser?.profileByRef) {

      // TODO (teamco): Handle disabled menu items.
      setMenuItems(handleDisabledMenus(menuData));
    }
  }, [sUser]);

  const _menu = (
      <Main.Menu data={menuItems}
                 spinOn={[
                   `${MODEL_NAME}/updateMenu`
                 ]}
                 {...menuProps}
                 collapsible={collapsibleMenu}
                 model={profileModel}
                 className={profileStyles.profileMenu}
                 selectedClassName={profileStyles.selected}
                 collapsed={collapsedMenu}
                 onCollapse={onToggleMenu}/>
  );

  return (
      <Can I={'manage'} a={'profile'}>
        {fixed ? (<Affix offsetTop={offsetTop}>{_menu}</Affix>) : _menu}
      </Can>
  );
};

export default ProfileMenu;
