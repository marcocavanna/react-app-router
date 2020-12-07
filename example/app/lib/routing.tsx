import * as React from 'react';

import { appRouterBuilder } from 'MyComponent';

import Home from '../routes/Home';
import Articles from '../routes/Articles';
import ShowArticle from '../routes/ShowArticle';
import Profile from '../routes/Profile';

import InitialLoader from '../components/InitialLoader';
import Header from '../components/Header';


const {
  AppRouter,
  AppLink,
} = appRouterBuilder([

  {
    name     : 'Home',
    component: Home,
    path     : '/',
    isPublic : true,
    isDefault: true,
  },

  {
    name     : 'Articles',
    component: Articles,
    path     : '/articles',
    title    : 'All Articles',
    isPublic : true,
    isPrivate: true,
    isDefault: 'private',
  },

  {
    name     : 'ShowArticle',
    component: ShowArticle,
    path     : '/articles/:id',
    title    : 'Read an Article',
    isPublic : true,
    isPrivate: true,
  },

  {
    name     : 'Profile',
    component: Profile,
    path     : '/profile/:optional?/:params?',
    title    : 'Private Profile',
    isPrivate: true,
    isPublic : false,
  },

], {

  defaultAppName: 'ReactApp Router',

  hasNavbar : true,
  hasSidebar: true,

  pageTitleSeparator            : ' • ',
  pageTitleWhileInitiallyLoading: 'Loading...',

  Components: {
    Header,
    InitialLoader,
    NotFound: () => <h1 style={{ color: 'red' }}>Page not Found!</h1>,
  },

  useRouteClassName: true,

});

export {
  AppRouter,
  AppLink,
};
