const API_URL = 'https://api.countrystatecity.in';
const API_VERSION = 'v1';

/**
 * @link https://countrystatecity.in/docs/
 * @type {{api: {countries: {all: string, cities: string, details: string, states: string}, states: {all: string, cities: string, details: string}}, key: string}}
 */
export const CountryAPI = {
  key: 'RmF6V2VzT05PbWVucnZVUk40OWNCeENLWHNPSHJZb0kxUU1XY0RCVg==',
  api: {
    countries: {
      all: `${API_URL}/${API_VERSION}/countries`,
      details: `${API_URL}/${API_VERSION}/countries/{0}`,
      states: `${API_URL}/${API_VERSION}/countries/{0}/states`,
      cities: `${API_URL}/${API_VERSION}/countries/[0]/cities`
    },
    states: {
      all: `${API_URL}/${API_VERSION}/states`,
      details: `${API_URL}/${API_VERSION}/countries/{0}/states/{1}`,
      cities: `${API_URL}/${API_VERSION}/countries/{0}/states/{1}/cities`
    }
  }
};