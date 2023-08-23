const original = jest.requireActual('@/utils/request');

module.exports = {
  default: {
    ...original.default,
    xhr: {
      notification: {
        messageApi: {
          success: jest.fn(),
          info: jest.fn(),
          warning: jest.fn(),
          error: jest.fn()
        }
      }
    }
  }
};