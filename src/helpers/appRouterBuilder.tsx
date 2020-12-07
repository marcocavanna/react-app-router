import * as React from 'react';

import {
  AppLink as NativeAppLink,
  AppLinkProps,
} from '../components/AppLink';

import {
  AppRouter as NativeAppRouter,
  AppRouterContext,
  AppRouterProps,
  CurrentRoute,
  useAppRouter as useNativeAppRouter,
} from '../components/AppRouter';

import {
  useAppRouterState as useNativeAppRouterState,
  useCurrentRoute as useNativeCurrentRoute,
} from '../hooks';

import { AppRoute, AppState, BaseRoutesDefinition } from '../interfaces';


/* --------
 * App Router Building Return Type
 * -------- */
export interface BuiltAppRouter<RoutesDefinition extends BaseRoutesDefinition> {
  AppRouter: React.FunctionComponent<Omit<AppRouterProps<RoutesDefinition>, 'routes'>>

  useAppRouter: <RouteName extends keyof RoutesDefinition>() => AppRouterContext<RoutesDefinition, RouteName>;

  AppLink: <RouteName extends keyof RoutesDefinition>(
    appLinkProps: React.PropsWithChildren<AppLinkProps<RoutesDefinition, RouteName>>,
  ) => JSX.Element;

  useAppRouterState: () => Readonly<AppState>;

  useCurrentRoute: <RouteName extends keyof RoutesDefinition>() => Readonly<CurrentRoute<RoutesDefinition, RouteName>>
}


/* --------
 * App Router Building
 * -------- */
export function appRouterBuilder<RoutesDefinition extends BaseRoutesDefinition>(
  routes: AppRoute<RoutesDefinition>[],
  props?: Omit<AppRouterProps<RoutesDefinition>, 'routes'>,
): BuiltAppRouter<RoutesDefinition> {


  // ----
  // AppLink Component
  // ----
  function AppLink<RouteName extends keyof RoutesDefinition>(
    appLinkProps: React.PropsWithChildren<AppLinkProps<RoutesDefinition, RouteName>>,
  ) {
    return (
      <NativeAppLink<RoutesDefinition, RouteName>
        {...appLinkProps}
      />
    );
  }


  // ----
  // AppRouter Component
  // ----
  function AppRouter(
    appRouterProps: React.PropsWithChildren<Omit<AppRouterProps<RoutesDefinition>, 'routes'>>,
  ) {
    return (
      <NativeAppRouter<RoutesDefinition>
        routes={routes}
        {...props}
        {...appRouterProps}
        Components={{
          ...props?.Components,
          ...appRouterProps.Components,
        }}
      />
    );
  }


  // ----
  // Hooks function
  // ----
  function useAppRouter<RouteName extends keyof RoutesDefinition>() {
    return useNativeAppRouter<RoutesDefinition, RouteName>();
  }

  function useAppRouterState() {
    return useNativeAppRouterState<RoutesDefinition>();
  }

  function useCurrentRoute<RouteName extends keyof RoutesDefinition>() {
    return useNativeCurrentRoute<RoutesDefinition, RouteName>();
  }


  // ----
  // Built Router Tools
  // ----
  return {
    AppLink,
    AppRouter,
    useAppRouter,
    useAppRouterState,
    useCurrentRoute,
  };

}
