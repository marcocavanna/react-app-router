export { default as AppRouter } from './Router/AppRouter.component';

export { useAppRouter } from './Router/AppRouter.context';

export { default as AppLink } from './components/AppLink';

export { default as RouteWatcher } from './components/RouteWatcher';

export {
  useAppRouterState,
  useCurrentRoute,
  usePageTitle,
} from './hooks';

export type { AppLinkProps } from './components/AppLink';

export type { AppRouterContext } from './Router/AppRouter.context';

export type {
  AppRoute,
  AppRouterProps,
  AppState,
  BaseRoutesDefinition,
  CurrentRoute,
  IsValidRouteChecker,
  MandatoryRedirect,
  PageComponent,
  PageComponentProps,
} from './interfaces';
