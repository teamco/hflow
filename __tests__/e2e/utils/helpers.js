/**
 * @export
 * @param locator
 * @param testInfo
 * @param name
 * @param type
 * @return {Promise<void>}
 */
export const attachThumb = async ({ locator, testInfo, name, type = 'png' }) => {
  const thumb = await locator.screenshot({ path: `${sPath}/${name}.${type}` });
  await testInfo.attach(name, { body: thumb, contentType: `image/${type}` });
};