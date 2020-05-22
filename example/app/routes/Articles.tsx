import * as React from 'react';
import { AppLink } from 'MyComponent';


export default () => (
  <React.Fragment>
    <h1>This is Articles Page</h1>
    <AppLink to={'Home'}><h3>Return to Home, visible only without Auth</h3></AppLink>
    <AppLink to={'Profile'}><h3>Go To Personal Profile, visible only with Auth</h3></AppLink>
  </React.Fragment>
);
