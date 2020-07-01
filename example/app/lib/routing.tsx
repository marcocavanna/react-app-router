import * as React from 'react';

import { buildRoutingSystem } from 'MyComponent';

import Home from '../routes/Home';
import Articles from '../routes/Articles';
import ShowArticle from '../routes/ShowArticle';
import Profile from '../routes/Profile';

import InitialLoader from '../components/InitialLoader';
import Header from '../components/Header';

const {
  AppRouter,
  AppLink
} = buildRoutingSystem({

  Home: {
    component: Home,
    path: '/',
    isPublic: true,
    isDefault: true
  },

  Articles: {
    component: Articles,
    path     : '/articles',
    title    : 'All Articles',
    isPublic : true,
    isPrivate: true,
    isDefault: 'private'
  },

  ShowArticle: {
    component: ShowArticle,
    path     : '/articles/:id',
    title    : 'Read an Article',
    isPublic : true,
    isPrivate: true
  },

  Profile: {
    component: Profile,
    path: '/profile/:optional?/:params?',
    title: 'Private Profile',
    isPrivate: true
  }

}, {

  defaultAppName: 'ReactApp Router',

  hasNavbar: true,
  hasSidebar: true,

  pageTitleSeparator: ' • ',
  pageTitleWhileInitiallyLoading: 'Loading...',

  components: {
    Header,
    InitialLoader,
    NotFound: () => <h1 style={{ color: 'red' }}>Page not Found!</h1>
  },

  useRouteClassName: true

});

export {
  AppRouter,
  AppLink
};
