import * as React from 'react';
import invariant from 'tiny-invariant';

import { useAppRouter, AppRouterContext, CurrentRoute } from '../components/AppRouter';

import { AppState, BaseRoutesDefinition } from '../interfaces';


/* --------
 * Hook Functions
 * -------- */

function useAppRouterTools<RoutesDefinition extends BaseRoutesDefinition,
  CurrentRoute extends keyof RoutesDefinition = keyof RoutesDefinition>(
  hook: string,
): AppRouterContext<RoutesDefinition, CurrentRoute> {

  if (process.env.NODE_ENV === 'development') {
    invariant(
      typeof React.useContext === 'function',
      `You must use React >= 16.8 in order to use '${hook}'()`,
    );
  }

  return useAppRouter() as unknown as AppRouterContext<RoutesDefinition, CurrentRoute>;
}


export function useAppRouterState<RoutesDefinition extends BaseRoutesDefinition>(): Readonly<AppState> {
  return useAppRouterTools<RoutesDefinition>('useAppRouterState').state;
}


// eslint-disable-next-line
export function useCurrentRoute<RoutesDefinition extends BaseRoutesDefinition, RouteName extends keyof RoutesDefinition>(): Readonly<CurrentRoute<RoutesDefinition, RouteName>> {
  return useAppRouterTools<RoutesDefinition, RouteName>('useCurrentRoute').currentRoute;
}


export function usePageTitle(): readonly [ string, (newTitle?: string) => void ] {
  const {
    setPageTitle
  } = useAppRouterTools('usePageTitle');

  return [
    document.title,
    setPageTitle
  ] as const;
}
