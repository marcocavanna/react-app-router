export { default as AppRouter } from './Router/AppRouter.component';

export { useAppRouter } from './Router/AppRouter.context';

export { default as AppLink } from './components/AppLink';

export {
  useCurrentRoute,
  useAppRouterState,
  usePageTitle,
} from './hooks';

export type { AppLinkProps } from './components/AppLink';

export type {
  AppRoute,
  PageComponent,
  IsValidRouteChecker,
  AppState,
  MandatoryRedirect
} from './interfaces';
