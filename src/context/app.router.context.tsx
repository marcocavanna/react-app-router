import * as React from 'react';
import invariant from 'tiny-invariant';

import type { AppRouterTools } from './app.router.context.interfaces';


/* --------
 * Create Context
 * -------- */
function createAppRouterContext() {
  /** Create the Context */
  const appRouterContext = React.createContext<AppRouterTools | undefined>(undefined);

  /** Create the Hook to get the Context */
  function useAppRouterHook(): AppRouterTools {
    /** Assert valid react version */
    invariant(
      typeof React.useContext === 'function',
      'You must use React >= 16.8 in order to use useAppRouter'
    );
    /** Get the context value */
    const value = React.useContext(appRouterContext);
    /** Assert value exists */
    invariant(
      value !== undefined,
      'useAppRouter hook must be invoked inside the AppRouter Component'
    );
    /** Return the Value */
    return value;
  }

  return [ useAppRouterHook, appRouterContext.Provider, appRouterContext.Consumer ] as const;
}

const [
  useAppRouter,
  AppRouterProvider,
  AppRouterConsumer
] = createAppRouterContext();

export {
  useAppRouter,
  AppRouterProvider,
  AppRouterConsumer
};
