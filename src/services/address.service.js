import request from '@/utils/request';

import { CountryAPI } from '@/services/config/country.config';
import { xhrRequest } from '@/services/authentication.service';
import { API } from '@/services/config/api.config';

const headers = new Headers();
headers.append('X-CSCAPI-KEY', CountryAPI.key);

const requestOptions = {
  headers,
  method: request.METHOD.get,
  redirect: 'follow'
};

const handleResponse = (url) => {
  return fetch(url, requestOptions).
      then(response => response.text()).
      then(result => JSON.parse(result)).
      catch(error => console.log('error', error));
};

/**
 * @export
 * @return {Promise<void>}
 */
export const getAllCountries = async () =>
    handleResponse(CountryAPI.api.countries.all);

/**
 * @export
 * @param country
 * @return {Promise<void>}
 */
export const getCountryStates = async ({ country }) =>
    handleResponse(CountryAPI.api.countries.states.replace(/\{0}/, country.iso2));

/**
 * @export
 * @param {{iso2}} country
 * @param {{iso2}} state
 * @return {Promise<void>}
 */
export const getStateCities = async ({ country, state }) =>
    handleResponse(CountryAPI.api.states.cities.
        replace(/\{0}/, country?.iso2).
        replace(/\{1}/, state?.iso2));

/**
 * @export
 * @param token
 * @return {Promise<GlobalConfig.Promise<*>|undefined>}
 */
export const getAddressRules = async ({ token }) => {
  return xhrRequest({
    url: API.addresses.rules,
    method: request.METHOD.get,
    token
  });
};