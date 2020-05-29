import type { RouteComponentProps } from 'react-router-dom';

import type { AppRouterProps, ExtraComponentProps, MandatoryRedirect } from '../AppRouter/AppRouter.interfaces';

import type AppRoute from '../../interfaces/AppRoute';
import type AppState from '../../interfaces/AppState';


export interface PageWrapperProps<K extends string = string> extends Omit<AppRoute<K>, 'path'>,
  Pick<NonNullable<AppRouterProps<K>>, 'appendRouteClassNameTo'> {

  /** Props passed to extra content */
  extraContentProps: ExtraComponentProps;

  /** Assert Next Route */
  getNextRoute?(
    props: AppRoute<K>,
    appState: AppState,
    routeProps: RouteComponentProps<any, any, any>
  ): string | MandatoryRedirect;

  /** As PageWrapper will wrap not found content, path must be optional */
  path?: string;
}
