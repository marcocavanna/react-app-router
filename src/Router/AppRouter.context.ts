import * as React from 'react';
import invariant from 'tiny-invariant';

import type { History } from 'history';
import type {
  AppRoute,
  AppState,
  BaseRoutesDefinition,
  CurrentRoute,
  CurrentRouteLayout,
  IsValidRouteChecker
} from '../interfaces';


/* --------
 * Context Definition
 * -------- */
export interface AppRouterContext<RoutesDefinition extends BaseRoutesDefinition, Name extends keyof RoutesDefinition> {
  /** Check if user could route to a page */
  couldRouteTo: <Next extends keyof RoutesDefinition = keyof RoutesDefinition>(
    route?: AppRoute<RoutesDefinition, Next>
  ) => boolean;

  /** The current Route */
  currentRoute: CurrentRoute<RoutesDefinition, Name>;

  /** The default private route */
  defaultPrivateRoute: AppRoute<RoutesDefinition, keyof RoutesDefinition>;

  /** The default public route */
  defaultPublicRoute: AppRoute<RoutesDefinition, keyof RoutesDefinition>;

  /** A function to get a Mandatory Redirect */
  isValidRoute?: IsValidRouteChecker<RoutesDefinition, keyof RoutesDefinition>;

  /** A function to retrieve the route by name */
  getRouteByName: <Route extends keyof RoutesDefinition = keyof RoutesDefinition>(
    name: Route
  ) => AppRoute<RoutesDefinition, Route>;

  /** A function to retrive the route by pathname */
  getRouteByPathName: <Route extends keyof RoutesDefinition = keyof RoutesDefinition>(
    pathName: string
  ) => AppRoute<RoutesDefinition, Route>;

  /** Current Page Layout */
  layout: CurrentRouteLayout<RoutesDefinition, Name>;

  /** All defined routes */
  routes: Map<string, AppRoute<RoutesDefinition, keyof RoutesDefinition>>;

  /** Route to another path */
  routeTo: <Next extends keyof RoutesDefinition>(
    route: Next, params?: RoutesDefinition[Next], state?: History.LocationState
  ) => void;

  /** Set new AppName */
  setAppName: (nextAppName?: string | ((currentName?: string) => string | undefined)) => void;

  /** Set new Page Title */
  setPageTitle: (nextTitle?: string) => void;

  /** Router state */
  state: AppState;

  /** Use the className updater */
  useRouteClassName: boolean;
}


/* --------
 * Context Builder
 * -------- */
const appRouterContext = React.createContext<AppRouterContext<any, any> | undefined>(undefined);

const {
  Provider: AppRouterProvider,
  Consumer: AppRouterConsumer
} = appRouterContext;

export {
  AppRouterProvider,
  AppRouterConsumer
};


/* --------
 * Hook Function
 * -------- */
export function useAppRouter<RoutesDefinition extends BaseRoutesDefinition, Name extends keyof RoutesDefinition>() {

  /** Assert valid react version */
  invariant(
    typeof React.useContext === 'function',
    'You must use React >= 16.8 in order to use useAppRouter'
  );

  /** Get the context value */
  const value = React.useContext<AppRouterContext<RoutesDefinition, Name>>(
    appRouterContext as unknown as React.Context<AppRouterContext<RoutesDefinition, Name>>
  );

  /** Assert value exists */
  invariant(
    value !== undefined,
    'useAppRouter hook must be invoked inside the AppRouter Component'
  );

  return value;
}
