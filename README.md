# React AppRouter
The React AppRouter module is a series of components built on top of react-router-dom [react-router-dom] library.

I've written this library to easy manage routing for auth based app, enforcing route by checking the user auth state and easily manage loading state while performing actions (like loading the client, the initial user data before app start, and so on).

Components are written in TypeScript and strongly typed.


### Installing
You can install React AppRouter using Yarn:

```
yarn add @appbuckets/app-router
```

or using npm

```
npm install --save @appbuckets/app-router
```

### Core Concept
React AppRouter is based on an array of `AppRoute` object elements, injected by the `routes` props that is mandatory. Each route must contain:

- a unique `name` string key
- the `path` string (same as `<Route />` element in react-router-dom, except as an array of string, because it is not supported yet)
- the `component` key, that is the page component used to render the page

Using the `AppRoute` array, the AppRouter component will create each single `<Route />` and some other useful utilities.


### Base Examples
```typescript jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { AppRouter, AppLink } from '@appbuckets/app-router';

// Define the Home Page Component
const Home = () => (
  <React.Fragment>
    <h1>Welcome to Home Page</h1>
    <AppLink to='Articles'>
      <h3>Read Some Articles</h3>
    </AppLink>
  </React.Fragment>
);

// Define the Article Page Component
const Articles = () => (
  <React.Fragment>
    <h1>Sorry, Articles list is Empty</h1>
    <AppLink to='Home'>
      <h3>Return to Home Page</h3>
    </AppLink>
  </React.Fragment>
);

// Define Routes
const routes = [
  { name: 'Home', path: '/', component: Home },
  { name: 'Home', path: '/articles', component: Articles }
];

// Create the App
const App = () => (
  <AppRouter routes={routes} />
);

// Render
ReactDOM.render(
  <App />,
  document.getElementById('root-app')
)
```


[react-router-dom]: https://github.com/ReactTraining/react-router
