import React from 'react';
import { Select } from 'antd';
import { getLocale, setLocale, useIntl } from '@umijs/max';

import { CountryFlag } from '@/components/Language/countryFlag';

import styles from './language.module.less';
import { t } from '@/utils/i18n';

const { Option } = Select;

/**
 * @export
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const Language = props => {
  const intl = useIntl();

  const { model, onChangeLang } = props;
  const { locale = { current: getLocale(), list: [getLocale()] } } = model;

  const country = locale.current.split('-')[1];

  /**
   * @constant
   * @function
   */
  const changeLang = () => {

    console.log(locale);
    if (!locale || locale === 'zh-CN') {
      //setLocale('en-US');
    } else {
      //setLocale('zh-CN');
    }
  };

  return (
      <Select value={locale.current}
              onChange={changeLang}
              className={styles.language}
              size={'small'}
              suffixIcon={null}
              bordered={false}>
        {locale.list?.map((lang, idx) => {
          const country = lang.split('-')[1];
          const title = t(intl, `language.${lang}`);

          return (
              <Option value={lang} key={idx}>
                <div className={styles.opt}>
                  <CountryFlag country={country} title={title}/>
                  {title}
                </div>
              </Option>
          );
        })}
      </Select>
  );
};
