import * as React from 'react';
import invariant from 'tiny-invariant';

import { useAppRouter } from '../context/app.router.context';

import type {
  AppRouterTools,
  AppRouterLayout,
  CurrentRoute
} from '../context/app.router.context.interfaces';

import type AppState from '../interfaces/AppState';


/* --------
 * Hooks Type & Interfaces
 * -------- */
export type UseAppNameTools = readonly [
  /** The current app name */
  (string | undefined),
  /** Set a new app name */
  ((nextAppName?: (string | ((currentAppName: string) => string) | undefined)) => void),
  /** Restore default app name */
  (() => void)
];

export type UseRoutingTools = Pick<AppRouterTools, 'defaultPrivateRoute' | 'defaultPublicRoute' | 'couldRouteTo' | 'getRoute' | 'routeTo' | 'routeToDefaultPrivate' | 'routeToDefaultPublic'>;

export type UsePageTitleTools = readonly [
  /** Current page title */
  string,
  /** Set a new page title, will be appended to current app title */
  ((newTitle?: string) => void)
];


/* --------
 * Hook Functions
 * -------- */

function getAppRouterTools(hook: string): AppRouterTools {
  if (process.env.NODE_ENV === 'development') {
    invariant(
      typeof React.useContext === 'function',
      `You must use React >= 16.8 in order to use '${hook}'()`
    );
  }

  return useAppRouter();
}


export function useAppState(): Readonly<AppState> {
  return getAppRouterTools('useAppState').appState;
}


export function useLayout(): Readonly<AppRouterLayout> {
  return getAppRouterTools('useLayoutState').layout;
}


export function useAppName(): UseAppNameTools {
  const appRouterTools = getAppRouterTools('useAppName');

  return [
    appRouterTools.appName,
    appRouterTools.setAppName,
    appRouterTools.restoreAppName
  ];
}


export function useCurrentRoute(): Readonly<CurrentRoute> {
  return getAppRouterTools('useCurrentRoute').currentRoute;
}


export function useRouting(): UseRoutingTools {
  const {
    routeTo,
    couldRouteTo,
    getRoute,
    routeToDefaultPrivate,
    routeToDefaultPublic,
    defaultPrivateRoute,
    defaultPublicRoute
  } = getAppRouterTools('useRouting');

  return {
    routeTo,
    couldRouteTo,
    getRoute,
    routeToDefaultPrivate,
    routeToDefaultPublic,
    defaultPrivateRoute,
    defaultPublicRoute
  };
}


export function usePageTitle(): UsePageTitleTools {
  const appRouterTools = getAppRouterTools('usePageTitle');

  return [
    document.title,
    appRouterTools.setPageTitle
  ] as const;
}
