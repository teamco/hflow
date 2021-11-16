import { Layout, Menu } from 'antd';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'umi';

const { Sider } = Layout;
const { SubMenu } = Menu;

class MainSiderMenu extends React.Component {
  render() {
    const { t, collapsed, onCollapse, onRoute, data, model } = this.props;

    return (
        <Sider collapsible
               collapsed={collapsed}
               onCollapse={onCollapse}
               style={{ position: 'relative' }}>
          <div className={'logo'}/>
          <Menu mode={'inline'}
                selectedKeys={[model.location.pathname]}>
            {data.map((menu, idx_m) =>
                menu.url ? (
                    <Menu.Item key={menu.url}
                               icon={menu.icon}>
                      <NavLink to={menu.url}
                               activeClassName={'selected'}>
                        {t(menu.key)}
                      </NavLink>
                    </Menu.Item>
                ) : (
                    <SubMenu key={idx_m}
                             icon={menu.icon}
                             title={t(menu.key)}>
                      {(menu.items || []).map((s_menu, idx_i) => (
                          <Menu.Item key={s_menu.url}
                                     icon={s_menu.icon}>
                            <NavLink to={s_menu.url}
                                     activeClassName={'selected'}>
                              {t(s_menu.key)}
                            </NavLink>
                          </Menu.Item>
                      ))}
                    </SubMenu>
                )
            )}
          </Menu>
        </Sider>
    );
  }
}

export default withTranslation()(MainSiderMenu);
