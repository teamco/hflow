module.exports = {
  // this mock makes sure any components using the translation HoC receive
  // the t function as a prop
  useTranslation: () => ({ t: (key) => key }),
  withTranslation(Component) {
    Component.defaultProps = { ...Component.defaultProps, t: (key) => key };
    return Component;
  },
  useIntl() {
    return {
      formatMessage(key) {
        return key;
      }
    };
  }
};
