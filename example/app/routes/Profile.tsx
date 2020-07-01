import * as React from 'react';

import { AppLink } from 'MyComponent';


export default () => (
  <React.Fragment>
    <h1>Welcome to Private Page</h1>
    <AppLink to={'Home'} renderAnyway><h3>Return to Home, always visible. With auth will fallback to Articles</h3>
    </AppLink>
    <AppLink to={'Articles'}><h3>Return to Articles</h3></AppLink>
  </React.Fragment>
);
