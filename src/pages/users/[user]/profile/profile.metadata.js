import React from 'react';
import { Col, Row, Select, Tag } from 'antd';
import { useIntl } from '@umijs/max';
import {
  AndroidOutlined,
  BoldOutlined,
  CalendarTwoTone,
  ControlTwoTone,
  MailTwoTone,
  TeamOutlined,
  ToolOutlined,
  UserOutlined
} from '@ant-design/icons';

import { tsToLocaleDateTime } from '@/utils/timestamp';
import { t } from '@/utils/i18n';

import EmailVerified from '@/components/Profile/email.verified';

import { isAdmin, isBusiness, isDeveloper, isTest } from '@/services/userRoles.service';

import styles from '@/pages/users/users.module.less';

const { Option, OptGroup } = Select;

/**
 * @constant
 * @param role
 * @return {JSX.Element}
 */
export const getRoleIcon = role => {
  return isAdmin([role]) ? (<TeamOutlined/>) :
      isBusiness(role) ? (<BoldOutlined/>) :
          isTest(role) ? (<ToolOutlined/>) :
              isDeveloper(role) ? (<AndroidOutlined/>) :
                  (<UserOutlined/>);
};

/**
 * @export
 * @param currentUserRoles
 * @param component
 * @param verificationSent
 * @param onSendVerification
 * @param selectedUser
 * @param userRoles
 * @param businessRoles
 * @param currentRoles
 * @param setCurrentRoles
 * @param setTouched
 * @return {JSX.Element}
 */
export const expendableProfile = (
    currentUserRoles,
    component,
    verificationSent,
    onSendVerification,
    selectedUser,
    userRoles,
    businessRoles,
    currentRoles = [],
    setCurrentRoles,
    setTouched
) => {

  /**
   * @constant
   * @param value
   */
  const handleRoleTags = (value) => {
    setCurrentRoles([...currentRoles, value]);
    setTouched(true);
  };

  const intl = useIntl();

  /**
   * @constant
   * @param {array} current
   * @param {array} [roles]
   * @return {*[]}
   */
  const filterRoles = (current, roles = []) => {
    return [...roles].sort().filter(role => !current.includes(role));
  };

  const handleOptions = (label, roles) => {
    return {
      label,
      options: filterRoles(currentRoles, roles).map((role) => ({
        label: role,
        value: role
      }))
    };
  };

  /**
   * @constant
   * @param e
   */
  const onRemoveRole = e => {
    e.preventDefault();
    const _role = e.currentTarget.parentNode.innerText;
    const _currentRoles = [...currentRoles].filter(role => role.toLowerCase() !== _role.toLowerCase());
    if (_currentRoles.length) {
      setCurrentRoles(_currentRoles);
      setTouched(true);
    }
  };

  /**
   * @constant
   * @param record
   * @return {*}
   */
  const handleRoles = (record) => {
    if (isAdmin(currentUserRoles)) {
      return (
          <>
            <div>
              <ControlTwoTone/>
              <strong>{`${t(intl, 'actions.assign')} ${t(intl, 'auth.roles')}`}</strong>
            </div>
            <Select value={t(intl, 'actions.select')}
                    onSelect={handleRoleTags}
                    style={{ width: 200 }}
                    size={'small'}
                    optionFilterProp="children"
                    options={[
                      handleOptions(t(intl, 'panel.userRoles'), userRoles?.roles),
                      handleOptions(t(intl, 'panel.businessRoles'), businessRoles?.roles)
                    ]}/>
          </>
      );
    }
    return null;
  };

  return {
    expandedRowRender(record) {
      const rowProps = { gutter: { xs: 8, sm: 16, md: 24, lg: 32 } };
      const colProps = { sm: 12, md: 8, style: { marginTop: 10 } };

      return (
          <div className={styles.profileExpand}>
            <Row {...rowProps}>
              <Col {...colProps}>
                <div>
                  <MailTwoTone/>
                  <strong>{t(intl, 'auth.email')}</strong>
                </div>
                <div>{record.email || t(intl, 'error.na')}</div>
              </Col>
              <Col {...colProps}>
                <div>
                  <CalendarTwoTone/>
                  <strong>{t(intl, 'form.createdAt')}</strong>
                </div>
                <div>{tsToLocaleDateTime(+(new Date(record.metadata.creationTime)))}</div>
              </Col>
            </Row>
            <Row {...rowProps}>
              <Col {...colProps}>
                <EmailVerified data={record}
                               verification={{
                                 component,
                                 verificationSent,
                                 onSendVerification
                               }}/>
              </Col>
              <Col {...colProps}>
                <div>
                  <ControlTwoTone/>
                  <strong>{t(intl, 'auth.roles')}</strong>
                </div>
                <div>
                  {currentRoles.map((role, idx) => (
                      <Tag className={styles.rules}
                           style={{ marginBottom: 3 }}
                           key={`cr.${idx}`}
                           closable={currentRoles.length > 1}
                           onClose={onRemoveRole}
                           icon={getRoleIcon(role)}>
                        {role}
                      </Tag>
                  ))}
                </div>
              </Col>
              <Col {...colProps}>
                {handleRoles(record)}
              </Col>
            </Row>
          </div>
      );
    },
    rowExpandable: record => true
  };
};
