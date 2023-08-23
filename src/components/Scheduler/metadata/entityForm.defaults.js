/**
 * @export
 * @param form
 * @param {string} prefix
 * @param scheduler
 * @param [defaults]
 */
export const setDefaultRepeats = (form, prefix, scheduler, defaults={}) => {
  form.setFieldsValue({
    [prefix]: {
      ...scheduler,
      repeat: {
        ...scheduler.repeat,
        ...defaults
      }
    }
  });
};