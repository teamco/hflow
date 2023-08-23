import React from 'react';
import { Select, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import GenericPanel from '@/components/Form/GenericPanel';

import styles from './translate.module.less';

const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const CommonTranslate = (props) => {
  const intl = useIntl();

  const {
    formRef,
    disabled,
    prefix = ['translateKeys'],
    translateMessages = {}
  } = props;

  const {
    header = t(intl, 'form.translate'),
    title = t(intl, 'form.title'),
    description = t(intl, 'form.description')
  } = props;

  return (
      <GenericPanel header={header}
                    name={'translate'}
                    defaultActiveKey={['translate']}>
        <div>
          <Select name={[...prefix, 'title']}
                  label={title}
                  placeholder={t(intl, 'form.placeholder', { field: title })}
                  form={formRef}
                  disabled={disabled}
                  allowClear={true}
                  config={{ rules: [{ required: true }] }}>
            {Object.keys(translateMessages).map(msg => (
                <Option key={msg} value={msg}>
                  <div className={styles.translate}>
                    <Tooltip title={translateMessages[msg]}>
                      <QuestionCircleOutlined/>
                    </Tooltip>
                    <span>{msg}</span>
                  </div>
                </Option>
            ))}
          </Select>
          <Select name={[...prefix, 'description']}
                  label={description}
                  placeholder={t(intl, 'form.placeholder', { field: description })}
                  form={formRef}
                  allowClear={true}
                  disabled={disabled}>
            {Object.keys(translateMessages).map(msg => (
                <Option key={msg} value={msg}>
                  {msg}
                </Option>
            ))}
          </Select>
        </div>
      </GenericPanel>
  );
};

export default CommonTranslate;
