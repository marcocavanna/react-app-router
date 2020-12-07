import * as React from 'react';

import { AppState, SideComponentProps } from 'MyComponent';

import { AppRouter } from './lib/routing';


export default class App extends React.Component<any, AppState> {

  state = {
    isLoading         : false,
    isInitiallyLoading: true,
    userHasAuth       : false,
  };


  componentDidMount() {
    setTimeout(() => {
      this.setState({ isInitiallyLoading: false, userHasAuth: true });
    }, 1000);
  }


  toggleUserAuth = () => {
    this.setState((curr) => ({ userHasAuth: !curr.userHasAuth }));
  };


  render() {
    const {
      isLoading,
      isInitiallyLoading,
      userHasAuth,
    } = this.state;

    const Footer = ({ appState }: SideComponentProps) => (!appState.isInitiallyLoading
      ? (
        <div>
          <button onClick={this.toggleUserAuth}>{userHasAuth ? 'Disable Auth' : 'Enable Auth'}</button>
        </div>
      )
      : null);

    return (
      <AppRouter
        isLoading={isLoading}
        isInitiallyLoading={isInitiallyLoading}
        userHasAuth={userHasAuth}
        Components={{
          Footer,
          Navbar: () => <h5>You are {!userHasAuth && 'not'} logged in</h5>,
        }}
      />
    );
  }
}
