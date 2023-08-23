import React from 'react';
import { cleanup } from '@testing-library/react';

import { mocksWorkaround } from '__tests__/helper';

describe('@/components/Buttons', () => {

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  mocksWorkaround();

  require('./specs/assign.button.test');
  require('./specs/auth.button.test');

});
