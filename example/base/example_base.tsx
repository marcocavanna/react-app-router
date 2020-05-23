import React from 'react';
import ReactDOM from 'react-dom';

import { useParams } from 'react-router-dom';

import { AppRouter, AppLink, usePageTitle } from 'MyComponent';

// Define the Home Page Component
const Home = () => (
  <React.Fragment>
    <h1>Welcome to Home Page</h1>
    <h3>This page is visible only to User without Auth</h3>
    <hr />
    <AppLink to={'Articles'}>
      <h3>Read Some Articles</h3>
    </AppLink>
  </React.Fragment>
);

// Define the Article Page Component
const Articles = () => (
  <React.Fragment>
    <h1>Choose an Article to Read</h1>
    <h3>This is an Hybrid page, visible to both authorized and unauthorized Users</h3>
    <hr />
    <div>
      <h4>Here's some Articles</h4>
      {[ 1, 2, 3 ].map(id => (
        <AppLink key={id} to={'ShowArticle'} params={{ id }}>
          <h5>Go to Article number {id}</h5>
        </AppLink>
      ))}
    </div>
    <hr />
    <AppLink to={'Home'}>
      <h3>Return to Home Page</h3>
    </AppLink>
    <AppLink to={'UserProfile'}>
      <h3>Go to your personal Profile Page, link visible to Authenticate User Only</h3>
    </AppLink>
  </React.Fragment>
);

// Define a Page to View a Single Article
const ShowArticle = () => {
  // You could use same react-router-dom hooks
  const { id } = useParams();
  // You could use extra hooks defined in app-router
  const [ , setPageTitle ] = usePageTitle();
  // For example to set the page title
  setPageTitle(`Reading Article ${id}`);

  return (
    <React.Fragment>
      <h1>{id} Article Titles</h1>
      <h3>Articles Subtitles</h3>
      <hr />
      <AppLink to={'Articles'}>
        <h3>Return to Articles List</h3>
      </AppLink>
    </React.Fragment>
  );
};

// Define the Personal Profile Page
const Profile = () => (
  <React.Fragment>
    <h1>Your Profile</h1>
    <h3>This page is visible only to authenticated User</h3>
    <hr />
    <AppLink to={'Articles'}>
      <h3>Return to Articles List</h3>
    </AppLink>
  </React.Fragment>
);

// Define Routes
const routes = [
  {
    name     : 'Home',
    path     : '/',
    component: Home,
    title    : 'Home',
    isPublic : true
  },
  {
    name     : 'Articles',
    path     : '/articles',
    component: Articles,
    title    : 'Articles List',
    isPrivate: true,
    isPublic : true,
    isDefault: 'private' as 'private'
  },
  {
    name     : 'ShowArticle',
    path     : '/articles/:id',
    component: ShowArticle,
    title    : 'Single Articles',
    isPrivate: true,
    isPublic : true
  },
  {
    name     : 'UserProfile',
    path     : '/profile',
    component: Profile,
    title    : 'Profile Settings',
    isPrivate: true
  }
];

// Create the App
const App = () => {

  const [ hasAuth, setHasAuth ] = React.useState(false);

  const handleToggleAuth = () => {
    setHasAuth(!hasAuth);
  };

  return (
    <AppRouter
      defaultAppName={'Routing Example'}
      userHasAuth={hasAuth}
      routes={routes}
      components={{
        Footer: () => (
          <React.Fragment>
            <hr />
            <p>I'm a Static Footer Component, showed on Each Page</p>
            <button onClick={handleToggleAuth}>
              {hasAuth ? 'Remove User Authorization' : 'Authorize User'}
            </button>
          </React.Fragment>
        )
      }}
    />
  );
};

// Render
ReactDOM.render(
  <App />,
  document.getElementById('root-app')
);
