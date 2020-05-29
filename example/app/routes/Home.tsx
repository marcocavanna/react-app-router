import * as React from 'react';

import { AppLink } from '../lib/routing';

export default () => (
  <React.Fragment>
    <h1>Hello to Home Page</h1>
    <AppLink to={'Articles'}><h3>Go to Articles</h3></AppLink>
  </React.Fragment>
);
