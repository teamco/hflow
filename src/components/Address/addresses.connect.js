import { connect } from '@umijs/max';

import { AddressesForm } from '@/components/Address/addresses.form';

const MODEL_NAME = 'addressModel';

export default connect(
    ({ addressModel, loading }) => ({ addressModel, loading }),
    (dispatch) => ({
      dispatch,
      onGetAllCountries() {
        dispatch({ type: `${MODEL_NAME}/getAllCountries` });
      },
      onGetCountryStates(country) {
        dispatch({ type: `${MODEL_NAME}/getCountryStates`, payload: { country } });
      },
      onGetStateCities(country, state) {
        dispatch({ type: `${MODEL_NAME}/getStateCities`, payload: { country, state } });
      }
    })
)(AddressesForm);
