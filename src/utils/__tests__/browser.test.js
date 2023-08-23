import { isDesktop } from '@/utils/browser';

describe('@/utils/browser.js', () => {

  test('test_desktopUserAgent', () => {
    const desktopUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36';
    expect(isDesktop(desktopUserAgent)).toBe(true);
  });

  test('test_differentBrowsers', () => {
    const chromeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36';
    const firefoxUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0';
    expect(isDesktop(chromeUserAgent)).toBe(true);
    expect(isDesktop(firefoxUserAgent)).toBe(true);
  });
});