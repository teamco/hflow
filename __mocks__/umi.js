import React from 'react';
const original = jest.requireActual('@umijs/max');

module.exports = {
  ...original,
  Helmet({...props}) {
    return (<div {...props}/>);
  },
  Outlet({...props}) {
    return (<div {...props}/>);
  },
  useParams() {
    return {};
  },
  withRouter() {
    return jest.fn().mockImplementation((Component) => (props) => <Component {...props}/>);
  },
  connect() {
    return jest.fn().mockImplementation((Component) => (props) => <Component {...props}/>);
  },
  getLocale: jest.fn().mockImplementation(() => 'en-US'),
  history: {
    push: jest.fn()
  },
  useIntl() {
    return {
      formatMessage({id = 'test.id', defaultMessage = 'Test'}) {
        return defaultMessage;
      }
    };
  }
};