import React from 'react';
import { Col, Row, Select, Tag } from 'antd';
import { useIntl } from 'umi';
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
import EmailVerified from '@/components/Profile/email.verified';

import { isAdmin, isBusiness, isDeveloper, isTest } from 'services/userRoles.service';

import styles from 'pages/users/users.module.less';

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
 * @param t
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
              <strong>{`${intl.formatMessage({id: 'actions.assign', defaultMessage: 'Assign'})} ${t('auth:roles')}`}</strong>
            </div>
            <Select value={intl.formatMessage({id: 'actions.select', defaultMessage: 'Select'})}
                    onSelect={handleRoleTags}
                    size={'small'}
                    style={{ width: 200 }}>
              <OptGroup label={intl.formatMessage({id: 'panel.userRoles', defaultMessage: 'User Roles'})}>
                {filterRoles(currentRoles, userRoles?.roles).map((role, idx) => (
                    <Option key={`ur.${idx}`} value={role}>{role}</Option>
                ))}
              </OptGroup>
              <OptGroup label={intl.formatMessage({id: 'panel.businessRoles', defaultMessage: 'Business Roles'})}>
                {filterRoles(currentRoles, businessRoles?.roles).map((role, idx) => (
                    <Option key={`br.${idx}`} value={role}>{role}</Option>
                ))}
              </OptGroup>
            </Select>
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
                  <strong>{intl.formatMessage({id: 'auth.email', defaultMessage: 'Email'})}</strong>
                </div>
                <div>{record.email || intl.formatMessage({id: 'error.na', defaultMessage: 'None'})}</div>
              </Col>
              <Col {...colProps}>
                <div>
                  <CalendarTwoTone/>
                  <strong>{intl.formatMessage({id: 'form.createdAt', defaultMessage: 'Created at'})}</strong>
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
                  <strong>{intl.formatMessage({id: 'auth.roles', defaultMessage: 'Roles'})}</strong>
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
