import * as React from 'react';

import { AppState, ExtraComponentProps } from 'MyComponent';

import { AppRouter } from './lib/routing';

export default class App extends React.Component<any, AppState> {

  state = {
    isLoading         : false,
    isInitiallyLoading: true,
    userHasAuth       : false
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
        isInitiallyLoading={isInitiallyLoading}
        userHasAuth={userHasAuth}
        components={{
          Footer,
          Navbar  : () => <h5>You are {!userHasAuth && 'not'} logged in</h5>
        }}
      />
    );
  }
}
