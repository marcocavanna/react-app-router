import * as React from 'react';

import type { ClassValue } from 'clsx';
import type { History, Location } from 'history';
import type { RouteChildrenProps, BrowserRouterProps } from 'react-router-dom';

import type { RouteWatcherProps } from './components/RouteWatcher';


/* --------
 * Types and Interfaces Used Internally
 * -------- */

/**
 * Routes Definition is an internal Object useful while working
 * with typescript. It could help devs to know and have a correct
 * typings for route params.
 */
export type ParamsDefinition = {
  /** Params always exists into object, but they could be undefined */
  [param: string]: string | undefined
};

export type BaseRoutesDefinition = {
  /** Each route must exists in Routes definition */
  [route: string]: ParamsDefinition
};


/* --------
 * Main Component Props
 * -------- */
export interface AppRouterProps<RoutesDefinition extends BaseRoutesDefinition>
  extends Partial<AppState>, Omit<RouteWatcherProps, 'onRouteChange'> {
  /** Pass any props to BrowserRouter component */
  browserRouterProps?: BrowserRouterProps;

  /** Side page components */
  Components?: SideComponents<RoutesDefinition, keyof RoutesDefinition>;

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
  isValidRoute?: IsValidRouteChecker<RoutesDefinition, keyof RoutesDefinition>;

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
  onRoutesChange?: (
    current: AppRoute<RoutesDefinition, keyof RoutesDefinition>,
    location: Location,
    history: History,
  ) => void;

  /** App Routes */
  routes: AppRoute<RoutesDefinition, keyof RoutesDefinition>[];

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


/* --------
 * The AppRouter App State
 * -------- */

/**
 * AppState indicate the current Router State.
 * An App with authenticated users could render
 * private/hybrid routes but not public only.
 */
export interface AppState {
  /**
   * Get or Set if App is initially loading.
   * This state will be set to true on AppRouter Bootstrap
   * and is useful to show an initial App Loader.
   */
  isInitiallyLoading: boolean;

  /**
   * Get or Set if App is loading.
   * This state could be set any time as true
   * to show an AppLoader while some long time
   * processes occurred.
   */
  isLoading: boolean;

  /**
   * Get or Set if current user viewing the App
   * has authorization. When the Auth State has been set to true
   * the user could view `private` pages and `hybrid` pages.
   */
  userHasAuth: boolean;

  /**
   * Indicates current users permissions.
   * If this props is undefined, no permissions roles
   * routing is applied
   */
  usersPermissions: string[] | undefined;
}


/* --------
 * Route Component and Additional Side Components
 * -------- */

/** Props passed down to each page component */
export interface PageComponentProps<RoutesDefinition extends BaseRoutesDefinition, Name extends keyof RoutesDefinition>
  extends RouteChildrenProps {
  /** The current AppState */
  appState: AppState;

  /** The current route */
  currentRoute: CurrentRoute<RoutesDefinition, Name>;
}

/** Each page component or a part of it */
export type PageComponent<RoutesDefinition extends BaseRoutesDefinition,
  Name extends keyof RoutesDefinition> = React.ComponentType<PageComponentProps<RoutesDefinition, Name>>;

/** The list of the App Side Component */
export interface SideComponents<RoutesDefinition extends BaseRoutesDefinition,
  Name extends keyof RoutesDefinition> {

  /**
   * Set the content to be displayed
   * under the router.
   */
  Footer?: PageComponent<RoutesDefinition, Name>;

  /**
   * Set the content to be displayed
   * above the router.
   */
  Header?: PageComponent<RoutesDefinition, Name>;

  /**
   * The Initial Loader Component,
   * showed only when `isInitialLoading` state
   * has been set.
   */
  InitialLoader?: PageComponent<RoutesDefinition, Name>;

  /**
   * The Loader Component,
   * showed when `isLoading` has been set
   */
  Loader?: PageComponent<RoutesDefinition, Name>;

  /**
   * Set the Navbar component.
   * This one is visible only if `hasNavbar` prop
   * on AppRouter has been set to `true`
   */
  Navbar?: PageComponent<RoutesDefinition, Name>;

  /**
   * Set a custom NotFound element
   * that will be displayed when not
   * page could be correctly reached
   */
  NotFound?: PageComponent<RoutesDefinition, Name>;

  /**
   * Set the Sidebar component.
   * This one is visible only if `hasSidebar` prop
   * on AppRouter has been set to `true`
   */
  Sidebar?: PageComponent<RoutesDefinition, Name>;
}


/* --------
 * AppRouter Route
 * -------- */

/** A single AppRouter Route definition */
export interface AppRoute<RoutesDefinition extends BaseRoutesDefinition, Name extends keyof RoutesDefinition> {
  /** The page component to render */
  component: PageComponent<RoutesDefinition, any>;

  /**
   * Set if this route must be reached
   * only if exact path has been typed by user
   * Default is `true`
   */
  exact?: boolean;

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
   * Set if the page has navbar visible.
   * Default is `true` for `private` page only.
   */
  hasNavbar?: boolean;

  /**
   * Set if the page has sidebar visible.
   * Default is `true` for `private` page only.
   */
  hasSidebar?: boolean;

  /**
   * Set if this page is the default
   * reached page on App Bootstrap.
   * Consider that could exist only
   * a default page for `private` and `public` routing.
   */
  isDefault?: boolean | 'private' | 'public';

  /**
   * Set if the page is private.
   * A private page could be viewed only with auth.
   * You could declare a page both private and
   * public: the result is a Hybrid page, visible
   * by user with and without auth
   * Default is `false`.
   */
  isPrivate?: boolean;

  /**
   * Set if the page is public.
   * A public page could be viewed without auth.
   * You could declare a page both private and
   * public: the result is a Hybrid page, visible
   * by user with and without auth
   * Default is `true`.
   */
  isPublic?: boolean;

  /** Page unique name, used to refer to it */
  name: Name;

  /** Parent Route, used internally */
  parent?: AppRoute<RoutesDefinition, keyof RoutesDefinition>;

  /** The complete page path, including all params */
  path: string;

  /** Necessary permission to render the page */
  permissions?: string[];

  /** Nested Routes */
  routes?: AppRoute<RoutesDefinition, keyof RoutesDefinition>[];

  /** When true, will match if the path is case sensitive. */
  sensitive?: boolean;

  /**
   * When true, a path that has a trailing slash will
   * only match a location.pathname with a trailing slash.
   * This has no effect when there are additional
   * URL segments in the location.pathname
   */
  strict?: boolean;

  /**
   * Set the Page title,
   * appended to App title on HTML Page
   */
  title?: string;

  /** Any other Key */
  [other: string]: any;
}

/**
 * The current route object describe the current rendered path.
 * It will be used and passed down to main route component
 * or get from AppRouter hooks
 */
export interface CurrentRoute<RoutesDefinition extends BaseRoutesDefinition, Name extends keyof RoutesDefinition> {
  /** This path has been rendered using an exact match of location */
  isExact: boolean;

  /** Current Route Params object and their values */
  params: Readonly<RoutesDefinition[Name]>;

  /** The current route object */
  route: Readonly<AppRoute<RoutesDefinition, Name>>;

  /** Url search params */
  search: URLSearchParams;

  /** Current url */
  url: string;
}

/** Each route has a current page layout */
export interface CurrentRouteLayout<RoutesDefinition extends BaseRoutesDefinition, Name extends keyof RoutesDefinition>
  extends Pick<SideComponents<RoutesDefinition, Name>, 'Loader' | 'InitialLoader'> {
  /** HTML Element to append route classes */
  appendRouteClassNameTo: HTMLElement;

  /** Check if Current Route has footer visible */
  hasFooter: boolean;

  /** Check if Current Route has header visible */
  hasHeader: boolean;

  /** Check if Current Route has navbar visible */
  hasNavbar: boolean;

  /** Check if Current Route has sidebar visible */
  hasSidebar: boolean;

  /** Check if Page is visible while app is initially loading */
  hidePageWhileInitiallyLoading: boolean;

  /** Check if Page is visible while app is loading */
  hidePageWhileLoading: boolean;

  /** Page title to set while app is initially loading */
  pageTitleWhileInitiallyLoading?: string;

  /** Page title to set while app is loading */
  pageTitleWhileLoading?: string;
}


/* --------
 * Mandatory Redirect
 * -------- */

/**
 * A mandatory redirect could be a string or
 * an object containing the RouteName and it's params.
 * Passing a nil value will prevent the redirect
 */
export interface StrictMandatoryRedirect<RoutesDefinition extends BaseRoutesDefinition,
  RouteName extends keyof RoutesDefinition> {
  route: RouteName;

  params?: RoutesDefinition[RouteName];

  state?: History.LocationState;
}

export type MandatoryRedirect<RoutesDefinition extends BaseRoutesDefinition,
  Name extends keyof RoutesDefinition> =
  | Name
  | StrictMandatoryRedirect<RoutesDefinition, Name>
  | null
  | undefined;

export type IsValidRouteChecker<RoutesDefinition extends BaseRoutesDefinition,
  Name extends keyof RoutesDefinition> =
  (
    route: AppRoute<RoutesDefinition, Name>,
    state: AppState,
  ) => MandatoryRedirect<RoutesDefinition, Name>;
