import { Layout, Menu } from 'antd';
import React from 'react';
import { NavLink, useIntl } from 'umi';
import { abilityMenuItem } from '@/utils/abilityComponent/abilityMenuItem';

const { Sider } = Layout;
const { SubMenu } = Menu;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const MainSiderMenu = props => {
  const { collapsed, onCollapse, onRoute, data, model, ability } = props;
  const intl = useIntl();
  /**
   * @constant
   * @param key
   * @param menu
   * @return {JSX.Element}
   * @private
   */
  const _menu = (key, menu) => abilityMenuItem({
    key,
    icon: menu?.icon,
    canI: ability.can('read', menu?.component),
    children: (
        <NavLink to={menu?.url}
                 activeClassName={'selected'}>
          {intl.formatMessage({id: menu?.key, defaultMessage: ''})}
        </NavLink>
    )
  });

  return (
      <Sider collapsible
             collapsed={collapsed}
             onCollapse={onCollapse}
             style={{ position: 'relative' }}>
        <div className={'logo'}/>
        <Menu mode={'inline'}
              selectedKeys={[model?.location?.pathname]}>
          {data?.map((menu, idx_m) =>
              menu?.url ?
                  _menu(`${menu?.key}_${idx_m}`, menu) : (
                      <SubMenu key={idx_m}
                               icon={menu?.icon}
                               title={intl.formatMessage({id: menu?.key, defaultMessage: ''})}>
                        {menu?.items?.map((s_menu, idx_i) => {
                          return s_menu.divider ? (
                                  <Menu.Divider key={`${s_menu?.url}_${idx_m}_${idx_i}`}/>
                              ) :
                              _menu(`${s_menu?.url}_${idx_m}_${idx_i}`, s_menu);
                        })}
                      </SubMenu>
                  )
          )}
        </Menu>
      </Sider>
  );
};

export default MainSiderMenu;
