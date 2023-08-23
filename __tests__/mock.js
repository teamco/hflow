import * as i18n from '@/utils/i18n';

import { stub } from '@/utils/function';

const request = require('@/utils/request');

/**
 * @export
 * @function
 */
export function locationMock() {
  let assignMock = jest.fn();

  afterEach(() => {
    assignMock.mockClear();
  });

  delete window.location;
  window.location = {
    assign: assignMock,
    reload: assignMock,
    replace: assignMock
  };
}

export const tMock = () => {
  jest.spyOn(i18n, 't').mockImplementation((intl, id, params = {}) => id);
};

export const requestMock = () => {
  const xhr = jest.fn();
  xhr.notification = {
    messageApi: {
      success: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      error: jest.fn()
    }
  };

  request.default.xhr = xhr;
};

export const connectMock = () => {
  const umi = require('@umijs/max');
  umi.connect = jest.fn();
};

export const tModule = (moduleName) => {
  const original = jest.requireActual(moduleName);

  return original.mockImplementation(stub);
};