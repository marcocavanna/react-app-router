import * as React from 'react';
import invariant from 'tiny-invariant';

import { History } from 'history';

import { IsValidRouteChecker } from './AppRouter.types';

import {
  AppRoute,
  AppState,
  BaseRoutesDefinition,
  SideComponentProps,
  SideComponents,
} from '../../interfaces';


/* --------
 * Context Definition
 * -------- */

/** All Context */
export interface AppRouterContext<RoutesDefinition extends BaseRoutesDefinition,
  CurrentRouteName extends keyof RoutesDefinition = keyof RoutesDefinition> {
  /** Check if user could route to a page */
  couldRouteTo: (route?: AppRoute<RoutesDefinition>) => boolean;

  /** The current Route */
  currentRoute: CurrentRoute<RoutesDefinition, CurrentRouteName>;

  /** The default private route */
  defaultPrivateRoute: AppRoute<RoutesDefinition>;

  /** The default public route */
  defaultPublicRoute: AppRoute<RoutesDefinition>;

  /** A function to get a Mandatory Redirect */
  isValidRoute?: IsValidRouteChecker<RoutesDefinition>;

  /** A function to retrieve the route by name */
  getRouteByName: (
    name: string,
  ) => AppRoute<RoutesDefinition>;

  /** A function to retrive the route by pathname */
  getRouteByPathName: (pathName: string) => AppRoute<RoutesDefinition>;

  /** Current Page Layout */
  layout: Layout<RoutesDefinition>;

  /** Route to another path */
  routeTo: <Name extends keyof RoutesDefinition>(
    route: Name, params?: RoutesDefinition[Name], state?: History.LocationState,
  ) => void;

  /** Set new AppName */
  setAppName: (nextAppName?: string | ((currentName?: string) => string | undefined)) => void;

  /** Set new Page Title */
  setPageTitle: (nextTitle?: string) => void;

  /** Props passed to side component */
  sideComponentProps: SideComponentProps<RoutesDefinition>;

  /** Router state */
  state: AppState;

  /** Use the className updater */
  useRouteClassName: boolean;
}

/** Context Current Route */
export interface CurrentRoute<RoutesDefinition extends BaseRoutesDefinition,
  Name extends keyof RoutesDefinition> {
  /** Check if Path match exactly */
  isExact: boolean;

  /** Route current params */
  params: Readonly<RoutesDefinition[Name]>;

  /** The Route Object */
  route: Readonly<AppRoute<RoutesDefinition, Name>>;

  /** Search Params */
  search: URLSearchParams;

  /** Current URL */
  url: string;
}

/** Context Layout */
export interface Layout<RoutesDefinition extends BaseRoutesDefinition>
  extends Pick<SideComponents<RoutesDefinition>, 'Loader' | 'InitialLoader'> {
  /** HTML Element to append route classes */
  appendRouteClassNameTo: HTMLElement;

  /** Check if Current Route has footer visible */
  hasFooter: boolean;

  /** Check if Current Route has header visible */
  hasHeader: boolean;

  /** Check if Current Route has navbar visible */
  hasNavbar: boolean;

  /** Check if Current Route has sidebar visible */
  hasSidebar: boolean;

  /** Check if Page is visible while app is initially loading */
  hidePageWhileInitiallyLoading: boolean;

  /** Check if Page is visible while app is loading */
  hidePageWhileLoading: boolean;

  /** Page title to set while app is initially loading */
  pageTitleWhileInitiallyLoading?: string;

  /** Page title to set while app is loading */
  pageTitleWhileLoading?: string;
}


/* --------
 * Context Builder
 * -------- */
const appRouterContext = React.createContext<AppRouterContext<any> | undefined>(undefined);

const {
  Provider: AppRouterProvider,
  Consumer: AppRouterConsumer,
} = appRouterContext;

export {
  AppRouterProvider,
  AppRouterConsumer,
};


/* --------
 * Hook Function
 * -------- */
export function useAppRouter<RoutesDefinition extends BaseRoutesDefinition, RouteName extends keyof RoutesDefinition>() {

  /** Assert valid react version */
  invariant(
    typeof React.useContext === 'function',
    'You must use React >= 16.8 in order to use useAppRouter',
  );

  /** Get the context value */
  const value = React.useContext<AppRouterContext<RoutesDefinition, RouteName>>(
    appRouterContext as unknown as React.Context<AppRouterContext<RoutesDefinition, RouteName>>,
  );

  /** Assert value exists */
  invariant(
    value !== undefined,
    'useAppRouter hook must be invoked inside the AppRouter Component',
  );

  return value;
}
