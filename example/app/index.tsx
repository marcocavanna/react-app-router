import * as React from 'react';

import { AppRouter, AppRoute, AppState, ExtraComponentProps } from 'MyComponent';

import Home from './routes/Home';
import Articles from './routes/Articles';
import Profile from './routes/Profile';

import InitialLoader from './components/InitialLoader';
import Header from './components/Header';


const routes: AppRoute<'Articles' | 'Profile' | 'Home'>[] = [
  { name: 'Home', component: Home, path: '/', title: 'Home Page', isDefault: true, isPublic: true },
  {
    name     : 'Articles',
    component: Articles,
    path     : '/articles',
    title    : 'All Articles',
    isPublic : true,
    isPrivate: true,
    isDefault: 'private'
  },
  { name: 'Profile', component: Profile, path: '/profile', title: 'Private Profile', isPrivate: true }
];

export default class App extends React.Component<any, AppState> {

  state = {
    isLoading         : false,
    isInitiallyLoading: true,
    userHasAuth       : true
  };


  componentDidMount() {
    setTimeout(() => {
      this.setState({ isInitiallyLoading: false });
    }, 1000);
  }


  toggleUserAuth = () => {
    this.setState((curr) => ({ userHasAuth: !curr.userHasAuth }));
  };


  render() {
    const {
      isInitiallyLoading,
      userHasAuth
    } = this.state;

    const Footer = ({ appState }: ExtraComponentProps) => !appState.isInitiallyLoading
      ? (
        <div>
          <button onClick={this.toggleUserAuth}>{userHasAuth ? 'Disable Auth' : 'Enable Auth'}</button>
        </div>
      )
      : null;

    return (
      <AppRouter
        defaultAppName={'ReactApp Router'}
        pageTitleSeparator={' • '}
        pageTitleWhileInitiallyLoading={'Loading...'}
        routes={routes}
        isInitiallyLoading={isInitiallyLoading}
        userHasAuth={userHasAuth}
        components={{
          InitialLoader,
          Header,
          Footer,
          NotFound: () => <h1 style={{ color: 'red' }}>Page not Found!</h1>
        }}
      />
    );
  }
}
