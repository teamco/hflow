import React from 'react';
import { cleanup } from '@testing-library/react';

import { mocksWorkaround } from '__tests__/helper';

describe('@/pages/landing/profile', () => {

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  mocksWorkaround();

  require('./specs/profile.addresses.test');

});
