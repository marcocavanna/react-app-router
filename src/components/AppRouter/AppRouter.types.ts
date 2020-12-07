import { History, Location } from 'history';

import { BrowserRouterProps, RouteComponentProps } from 'react-router-dom';
import { ClassValue } from 'clsx';

import { BaseRoutesDefinition } from '../../interfaces/RoutesDefinition';

import { RouteWatcherProps } from '../RouteWatcher';

import {
  AppRoute,
  AppState, MandatoryRedirect,
  SideComponents,
} from '../../interfaces';


/**
 * Props Exposed into the AppRouterWrapped
 * component after composing with withRouter HOC
 */
export type AppRouterInnerProps<RoutesDefinition extends BaseRoutesDefinition = BaseRoutesDefinition> =
  Omit<AppRouterProps<RoutesDefinition>, 'browserRouterProps'>;


/* --------
 * Main App Router Props
 * -------- */
export interface AppRouterProps<RoutesDefinition extends BaseRoutesDefinition = BaseRoutesDefinition>
  extends Partial<AppState>, Omit<RouteWatcherProps, 'onRouteChange'> {

  /** Pass any props to BrowserRouter component */
  browserRouterProps?: BrowserRouterProps;

  /** Side page components */
  Components?: SideComponents<RoutesDefinition>;

  /**
   * Set the current App Name
   * This text will be used to create the App Title
   * on HTML Page and Documents
   */
  defaultAppName?: string;

  /**
   * Set if the Page Component
   * must be hide when appState is initially loading
   * Default is `true`
   */
  hidePageWhileInitiallyLoading?: boolean;

  /**
   * Set the if the Page Component
   * must be hide when appState is loading
   * Default is `true`
   */
  hidePageWhileLoading?: boolean;

  /** Set extra className to use on inners component. */
  innerClassNames?: {
    /** Set page className */
    pageClassNames?: ClassValue | ClassValue[];
    /** Set main view className */
    viewClassNames?: ClassValue | ClassValue[];
  };

  /**
   * Programmatically set the new route.
   * This function, if exists, will be called before routing
   * to a new page. Returning a valid RouteName will
   * override the route to the returned one.
   * Returning null or undefined will let routing
   * continue without any side effects.
   */
  isValidRoute?: IsValidRouteChecker<RoutesDefinition>;

  /**
   * Set if the AppRouter must show the footer component
   * on page where footer has been enabled.
   */
  hasFooter?: boolean;

  /**
   * Set if the AppRouter must show the header component
   * on page where header has been enabled.
   */
  hasHeader?: boolean;

  /**
   * Set if the AppRouter must show the navbar component
   * on page where navbar has been enabled.
   */
  hasNavbar?: boolean;

  /**
   * Set if the AppRouter must show the sidebar component
   * on page where sidebar has been enabled.
   */
  hasSidebar?: boolean;

  /**
   * Handler callback invoked on route changed
   * When a route change event occurred the onHashChange event
   * will not be fired, even if hash has changed.
   * It will only be called internally to remove className if ´useRouteClassName´ is used.
   */
  onRoutesChange?: (current: AppRoute<RoutesDefinition>, location: Location, history: History) => void;

  /** App Routes */
  routes: AppRoute<RoutesDefinition>[];

  /**
   * Set the Page Title to display while App is in Initially Loading State
   */
  pageTitleWhileInitiallyLoading?: string;

  /**
   * Set the Page Title to display while App is in Loading State
   */
  pageTitleWhileLoading?: string;

  /**
   * Set the Page Title separator.
   *
   * When the title inside <head> will change,
   * computing function will use the current appName
   * string and the current page title string: set this
   * props to choose how the two names are joined together.
   *
   * `null` or `undefined` value will fallback to ' ' (space)
   *
   * Default is ` | `
   */
  pageTitleSeparator?: string;

}


export type IsValidRouteChecker<RoutesDefinition extends BaseRoutesDefinition,
  Name extends keyof RoutesDefinition = keyof RoutesDefinition> =
  (
    route: AppRoute<RoutesDefinition, Name>,
    state: AppState,
    props: RouteComponentProps,
  ) => MandatoryRedirect<RoutesDefinition>;
