import React from 'react';
import { FormattedMessage, IntlProvider } from '@umijs/max';

import { locales } from '@/locales';
import { logger } from '@/utils/console';

/**
 * @export
 * @async
 * @param {string} id
 * @param {string} defaultMessage
 * @param {string} [className]
 * @param {object} [instance]
 * @returns {Promise<JSX.Element>}
 */
export const intl = async ({ id, defaultMessage, instance = '', className }) => {
  const umi = await import('@umijs/max');
  const { getLocale } = umi;

  const language = getLocale();
  const messages = locales[`${language}`] || {};

  return (
      <IntlProvider locale={language}
                    messages={messages}>
        <div className={className}>
          <FormattedMessage id={id} defaultMessage={defaultMessage} values={{ instance }}/>
        </div>
      </IntlProvider>
  );
};

/**
 * @export
 * @param {{formatMessage, messages}} intl
 * @param {string} id
 * @param [params]
 * @return {string}
 */
export const t = (intl, id, params = {}) => {
  if (intl?.messages[id]) {
    return intl?.formatMessage({ id, defaultMessage: id }, { ...params });
  }

  logger({ type: 'error', msg: `Unable to find translation for [${id}], used default message.` });
  return id;
};
