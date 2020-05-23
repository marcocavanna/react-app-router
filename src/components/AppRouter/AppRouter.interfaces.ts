import * as React from 'react';

import type { History, Location } from 'history';

import type { BrowserRouterProps, RouteComponentProps } from 'react-router-dom';
import type { ClassValue } from 'clsx';

import type { RouteParams } from '../../context/app.router.context.interfaces';

import type { RouteWatcherProps } from '../RouteWatcher/RouteWatcher.interfaces';

import type AppRoute from '../../interfaces/AppRoute';
import type AppState from '../../interfaces/AppState';


/**
 * Props Exposed into the AppRouterWrapped
 * component after composing with withRouter HOC
 */
export type AppRouterInnerProps = AppRouterOuterProps & RouteComponentProps;

/**
 * Props Exposed by the AppRouterWrapper
 * component after composing with withRouter HOX
 */
export type AppRouterOuterProps = Omit<AppRouterProps, 'browserRouterProps'>;

/**
 * Main AppRouter Component Props definition
 */
export interface AppRouterProps extends Partial<AppState>, Omit<RouteWatcherProps, 'onRouteChange'> {

  /** Pass any props to BrowserRouter component */
  browserRouterProps?: BrowserRouterProps;

  /** Set the component to use in UI */
  components?: AppRouterComponents;

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
  getNextRoute?(
    props: AppRoute,
    appState: AppState,
    routeProps: RouteComponentProps<any, any, any>
  ): MandatoryRedirect;

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
  onRouteChange?(current: AppRoute, location: Location, history: History): void;

  /** The AppRouter Pages Components */
  routes: AppRoute[];

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

/**
 * A mandatory redirect could be a string or
 * an object containing the RouteName and it's params.
 * Passing a nil value will prevent the redirect
 */
export interface StrictMandatoryRedirect {
  route: string | AppRoute;

  params?: RouteParams;

  state?: History.LocationState;
}

export type MandatoryRedirect =
  | string
  | StrictMandatoryRedirect
  | null
  | undefined;

/**
 * Props passed to extra page component
 * like Header / Footer / Navbar / Sidebar
 */
export interface ExtraComponentProps {
  /** Current AppState */
  appState: AppState;
}

export type SideRouteComponent<P extends {} = {}> = React.ComponentType<P & ExtraComponentProps>;

export interface AppRouterComponents {
  /**
   * Set the content to be displayed
   * under the router.
   */
  Footer?: SideRouteComponent;

  /**
   * Set the content to be displayed
   * above the router.
   */
  Header?: SideRouteComponent;

  /**
   * The Initial Loader Component,
   * showed only when `isInitialLoading` state
   * has been set.
   */
  InitialLoader?: SideRouteComponent;

  /**
   * The Loader Component,
   * showed when `isLoading` has been set
   */
  Loader?: SideRouteComponent;

  /**
   * Set the Navbar component.
   * This one is visible only if `hasNavbar` prop
   * on AppRouter has been set to `true`
   */
  Navbar?: SideRouteComponent;

  /**
   * Set a custom NotFound element
   * that will be displayed when not
   * page could be correctly reached
   */
  NotFound?: React.ComponentType<any>;

  /**
   * Set the Sidebar component.
   * This one is visible only if `hasSidebar` prop
   * on AppRouter has been set to `true`
   */
  Sidebar?: SideRouteComponent;
}

export interface AppRouterState {
  /** The App Name */
  appName?: string;

  /** The Current Page */
  currentRoute: AppRoute;

  /** Current Render has Navbar visible */
  hasNavbar: boolean;

  /** Current Render has Sidebar visible */
  hasSidebar: boolean;
}

export interface AppRouterSplittedProps {
  Components: AppRouterComponents;

  appState: AppState;

  extraContentProps: { appState: AppState, [key: string]: any };

  innerClassNames: {
    pageClassNames: ClassValue | ClassValue[];
    viewClassNames: ClassValue | ClassValue[];
  };

  routes: AppRoute[];

  routeWatcherProps: RouteWatcherProps;
}
