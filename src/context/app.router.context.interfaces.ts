import type { History } from 'history';

import type AppState from '../interfaces/AppState';

import type AppRoute from '../interfaces/AppRoute';

import type { AppRouterComponents } from '../components/AppRouter/AppRouter.interfaces';


export type RouteParams = { [key: string]: string | number | boolean | undefined };

export type CurrentRoute<K extends string = string> = { route: Readonly<AppRoute<K>>, params: RouteParams, search: URLSearchParams };

export interface AppRouterLayout extends Pick<AppRouterComponents, 'Loader' | 'InitialLoader'> {
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

export interface UseRoutingTools<K extends string = string> {
  /** All App Routes */
  allRoutes: ReadonlyArray<AppRoute<K>>;

  /** The default private route */
  defaultPrivateRoute: Readonly<AppRoute<K>>;

  /** The default public route */
  defaultPublicRoute: Readonly<AppRoute<K>>;

  /** Route to a Page using its name */
  routeTo(route: K | AppRoute<K>, params?: RouteParams, state?: History.LocationState): void;

  /** Check if with current auth, a user could reach a route */
  couldRouteTo(route?: AppRoute<K>): boolean;

  /** Get the Route object by name */
  getRoute(pageName: K): Readonly<AppRoute<K>> | undefined;

  /** Route to default Private Page */
  routeToDefaultPrivate(params?: RouteParams, state?: History.LocationState): void;

  /** Route to default Public Page */
  routeToDefaultPublic(params?: RouteParams, state?: History.LocationState): void;
}

export interface AppRouterTools<K extends string = string> extends UseRoutingTools<K> {
  /** Get current App Name */
  appName?: string;

  /** Get current AppState */
  appState: Readonly<AppState>;

  /** Get the current Route */
  currentRoute: CurrentRoute<K>;

  /** Get current state of App Layout */
  layout: Readonly<AppRouterLayout>;

  /** Restore the Default App Name */
  restoreAppName: () => void;

  /** Set the new App Name */
  setAppName(nextAppName?: string | ((currentAppName: string) => string)): void;

  /** Set Page Title */
  setPageTitle(pageTitle?: string): void;
}
