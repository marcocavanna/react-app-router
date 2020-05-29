import * as React from 'react';

import type AppRoute from '../interfaces/AppRoute';
import type AppState from '../interfaces/AppState';

import AppLink from '../components/AppLink/AppLink.component';
import type { AppLinkProps } from '../components/AppLink/AppLink.interfaces';

import AppRouter from '../components/AppRouter/AppRouter.component';
import type { AppRouterProps } from '../components/AppRouter/AppRouter.interfaces';

import { useAppRouter, AppRouterConsumer } from '../context/app.router.context';
import type {
  AppRouterLayout,
  AppRouterTools,
  CurrentRoute,
  UseRoutingTools,
} from '../context/app.router.context.interfaces';

import withAppRouter from '../hoc/withAppRouter';
import type { ComponentWithAppRouterProps } from '../hoc/withAppRouter';

import * as hooks from '../hooks';
import type {
  UseAppNameTools,
  UsePageTitleTools
} from '../hooks';


/* --------
 * Builder Interface
 * -------- */
export interface AppRoutingSystem<K extends string = string> {
  AppLink: React.FC<AppLinkProps<K>>;

  AppRouter: React.FC<Partial<Omit<AppRouterProps<K>, 'routes'>>>;

  useAppRouter(): AppRouterTools<K>;

  AppRouterConsumer: React.Consumer<AppRouterTools<K> | undefined>;

  withAppRouter<P extends {} = {}>(ChildComponent: React.ComponentType<P>): ComponentWithAppRouterProps<P, K>;

  useAppState(): Readonly<AppState>;

  useLayout(): Readonly<AppRouterLayout>;

  useAppName(): UseAppNameTools;

  useCurrentRoute(): Readonly<CurrentRoute<K>>;

  useRouting(): UseRoutingTools<K>;

  usePageTitle(): UsePageTitleTools;
}


/* --------
 * Builder Function
 * -------- */
function buildAppRoutingSystem<K extends string>(
  routesRecord: Record<K, Omit<AppRoute, 'name'>>,
  appRouterProps?: Omit<AppRouterProps, 'routes'>
): AppRoutingSystem<K> {

  const routes: AppRoute[] = [];

  Object.keys(routesRecord).forEach((name) => {
    routes.push({
      ...routesRecord[name as K],
      name
    });
  });

  return {
    AppLink,
    AppRouter        : (props) => {
      /** Merge Components Props if Exists */
      const mergedComponents = {
        ...appRouterProps?.components,
        ...props?.components
      };
      /** Merge Props */
      const mergedProps = {
        ...appRouterProps,
        ...props,
        components: mergedComponents,
        routes
      };
      /** Return the Router */
      return (
        <AppRouter {...mergedProps} />
      );
    },
    AppRouterConsumer: AppRouterConsumer as React.Consumer<AppRouterTools<K> | undefined>,
    withAppRouter,
    useAppRouter,
    ...hooks
  };

}

export default buildAppRoutingSystem;
