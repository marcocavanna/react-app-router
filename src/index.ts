/* --------
 * Main App Router Module
 * -------- */
export { default as AppRouter } from './components/AppRouter/AppRouter.component';

export type {
  AppRouterProps,
  StrictMandatoryRedirect,
  MandatoryRedirect,
  ExtraComponentProps,
  AppRouterComponents
} from './components/AppRouter/AppRouter.interfaces';


/* --------
 * Route Watcher Component
 * -------- */
export { default as RouteWatcher } from './components/RouteWatcher/RouteWatcher.component';

export type {
  RouteWatcherProps
} from './components/RouteWatcher/RouteWatcher.interfaces';


/* --------
 * App Router Context
 * -------- */
export {
  useAppRouter,
  AppRouterConsumer
} from './context/app.router.context';

export type {
  CurrentRoute,
  RouteParams,
  AppRouterLayout,
  AppRouterTools
} from './context/app.router.context.interfaces';


/* --------
 * App Router HOC
 * -------- */
export { default as withAppRouter } from './hoc/withAppRouter';

export type {
  ComponentWithAppRouterProps,
  WithAppRouterProps
} from './hoc/withAppRouter';


/* --------
 * Hooks
 * -------- */
export * from './hooks';


/* --------
 * Interfaces
 * -------- */
export type { default as AppRoute } from './interfaces/AppRoute';

export type { default as AppState } from './interfaces/AppState';


/* --------
 * AppRouter Internal Props
 * -------- */
export { default as AppLink } from './components/AppLink/AppLink.component';

export type { AppLinkProps } from './components/AppLink/AppLink.interfaces';
