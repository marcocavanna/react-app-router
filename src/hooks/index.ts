import * as React from 'react';
import invariant from 'tiny-invariant';

import { useAppRouter } from '../context/app.router.context';

import type {
  AppRouterTools,
  AppRouterLayout,
  CurrentRoute, UseRoutingTools,
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

export type UsePageTitleTools = readonly [
  /** Current page title */
  string,
  /** Set a new page title, will be appended to current app title */
  ((newTitle?: string) => void)
];


/* --------
 * Hook Functions
 * -------- */

function getAppRouterTools<K extends string = string>(hook: string): AppRouterTools<K> {
  if (process.env.NODE_ENV === 'development') {
    invariant(
      typeof React.useContext === 'function',
      `You must use React >= 16.8 in order to use '${hook}'()`
    );
  }

  return useAppRouter() as AppRouterTools<K>;
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


export function useCurrentRoute<K extends string = string>(): Readonly<CurrentRoute<K>> {
  return getAppRouterTools<K>('useCurrentRoute').currentRoute;
}


export function useRouting<K extends string = string>(): UseRoutingTools<K> {
  const {
    allRoutes,
    routeTo,
    couldRouteTo,
    getRoute,
    routeToDefaultPrivate,
    routeToDefaultPublic,
    defaultPrivateRoute,
    defaultPublicRoute
  } = getAppRouterTools<K>('useRouting');

  return {
    allRoutes,
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
