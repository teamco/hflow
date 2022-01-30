/**
 * @export
 * @constant
 */
export const i18nMock = () => {
  jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key }),
    // this mock makes sure any components using the translate HoC receive the t function as a prop
    withTranslation: () => Component => {
      Component.defaultProps = { ...Component.defaultProps, t: () => '' };
      return Component;
    }
  }));
};
