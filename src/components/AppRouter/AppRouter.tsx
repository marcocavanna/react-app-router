import * as React from 'react';
import clsx from 'clsx';

import {
  BrowserRouter, generatePath,
  matchPath, Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch
} from 'react-router-dom';

import { History } from 'history';

import {
  AppRoute,
  BaseRoutesDefinition,
  SideComponentProps,
} from '../../interfaces';

import {
  AppRouterProps,
  AppRouterInnerProps,
} from './AppRouter.types';

import {
  AppRouterContext,
  AppRouterProvider,
} from './AppRouter.context';

import {
  getDefaultDefinedRoute,
  getRouteByName,
  getRouteByPathName,
} from './lib';

import { RouteWatcher } from '../RouteWatcher';
import { isValidString } from '../../utils';
import { PageWrapper } from '../PageWrapper';


/* --------
 * Main Component Definition
 * -------- */
function AppRouterInner<RoutesDefinition extends BaseRoutesDefinition>(
  props: React.PropsWithChildren<AppRouterInnerProps<RoutesDefinition>>,
) {

  // ----
  // Props Destructuring
  // ----
  const {
    /** State initializer */
    defaultAppName: userDefinedDefaultAppName,
    hasFooter     : userDefinedHasFooter,
    hasHeader     : userDefinedHasHeader,
    hasNavbar     : userDefinedHasNavbar,
    hasSidebar    : userDefinedHasSidebar,

    /** External State */
    isInitiallyLoading,
    isLoading,
    userHasAuth,

    /** Routes and Component Definition */
    Components,
    hidePageWhileInitiallyLoading,
    hidePageWhileLoading,
    innerClassNames,
    isValidRoute,
    onRoutesChange,
    pageTitleSeparator,
    pageTitleWhileInitiallyLoading,
    pageTitleWhileLoading,
    routes,

    /** Route Watcher Props */
    appendRouteClassNameTo: userDefinedAppendRouteClassNameTo,
    fireOnRouteChangeEventOnMount,
    hashClassNamePrefix,
    onHashChange,
    useRouteClassName,
  } = props;


  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const appendRouteClassNameTo = userDefinedAppendRouteClassNameTo || document.body;


  // ----
  // Internal Functions
  // ----

  /**
   * Assert an user could route to a provided
   * route using the current userHasAuth state
   * and isPublic or isPrivate route definition
   */
  const userCouldRouteTo = React.useCallback(
    (route?: AppRoute<RoutesDefinition>) => {
      /** Prevent if no root exists */
      if (!route) {
        return false;
      }

      /** Assert routing using user auth state */
      const { isPrivate, isPublic } = route;

      const isHybrid = (isPrivate && isPublic) || (!isPrivate && !isPublic);

      return (userHasAuth && (isPrivate || isHybrid)) || (!userHasAuth && (isPublic || isHybrid));
    },
    [ userHasAuth ],
  );


  // ----
  // Internal State and Visibility
  // ----

  /** Store the currentRoute */
  const [ currentRoute, setCurrentRoute ] = React.useState(
    getRouteByPathName(routes, location.pathname, Components),
  );

  /** Store the App Name */
  const [ appName, setAppName ] = React.useState(userDefinedDefaultAppName);

  /** Compute Side Component Visibility */
  const isVisible = React.useMemo(
    (): { footer: boolean, header: boolean, navbar: boolean, sidebar: boolean } => {
      /**
       * Check if nextPage has Navbar and Sidebar
       * falling back to default if one of this isn't defined.
       * Default value is true only for private page
       */
      const {
        hasFooter : routeHasFooter,
        hasHeader : routeHasHeader,
        hasNavbar : routeHasNavbar = !!(currentRoute.isPrivate && !currentRoute.isPublic),
        hasSidebar: routeHasSidebar = !!(currentRoute.isPrivate && !currentRoute.isPublic),
      } = currentRoute ?? {};

      /** Compute new value */
      const nextHasFooter = !!(routeHasFooter && userDefinedHasFooter);
      const nextHasHeader = !!(routeHasHeader && userDefinedHasHeader);
      const nextHasNavbar = !!(routeHasNavbar && userDefinedHasNavbar);
      const nextHasSidebar = !!(routeHasSidebar && userDefinedHasSidebar);

      return {
        footer : nextHasFooter,
        header : nextHasHeader,
        navbar : nextHasNavbar,
        sidebar: nextHasSidebar,
      };
    },
    [
      currentRoute,
      userDefinedHasFooter,
      userDefinedHasHeader,
      userDefinedHasNavbar,
      userDefinedHasSidebar,
    ],
  );


  // ----
  // Handlers
  // ----
  const handleRouteChange = React.useCallback(
    (pathName: string) => {
      /** Get routing using pathName */
      const route = getRouteByPathName(routes, pathName, Components);

      /** If route is the same, skip updating */
      if (route.name === currentRoute.name) {
        return;
      }

      /** Update the Route State */
      setCurrentRoute(route);

      /** Call onRouteChange handler */
      if (typeof onRoutesChange === 'function') {
        onRoutesChange(route, location, history);
      }
    },
    [
      routes,
      Components,
      currentRoute.name,
      onRoutesChange,
      location,
      history,
    ],
  );


  const handleRouteTo = React.useCallback(
    <Name extends keyof RoutesDefinition>(
      route: Name, params?: RoutesDefinition[Name], state?: History.LocationState,
    ) => {
      /** Get the next route */
      const nextRoute = getRouteByName<RoutesDefinition>(routes, route as string, Components);

      /** Push the next route */
      history.push(generatePath(nextRoute.path, params), state);
    },
    [
      Components,
      history,
      routes,
    ],
  );


  const handleChangePageTitle = React.useCallback(
    (nextTitle?: string) => {
      /** Safe set untitled document */
      if (!appName && !nextTitle) {
        document.title = 'Untitled';
      }
      else {
        document.title = [
          appName,
          nextTitle,
        ].filter(isValidString).join(pageTitleSeparator ?? ' ');
      }
    },
    [
      appName,
      pageTitleSeparator,
    ],
  );


  // ----
  // Build Side Component Props
  // ----
  const sideComponentProps = React.useMemo(
    (): SideComponentProps<RoutesDefinition> => ({
      appState: {
        isInitiallyLoading: !!isInitiallyLoading,
        isLoading         : !!isLoading,
        userHasAuth       : !!userHasAuth,
      },
      currentRoute,
      history,
      location,
      match,
    }),
    [
      currentRoute,
      history,
      isInitiallyLoading,
      isLoading,
      location,
      match,
      userHasAuth,
    ],
  );


  // ----
  // Memoized Components
  // ----
  const NavBarComponent = Components && Components.Navbar;
  const navBarElement = React.useMemo(
    () => {
      if (!isVisible.navbar || !NavBarComponent) {
        return null;
      }

      return (
        <NavBarComponent
          {...sideComponentProps}
        />
      );
    },
    [
      NavBarComponent,
      isVisible.navbar,
      sideComponentProps,
    ],
  );

  const HeaderComponent = Components && Components.Header;
  const headerElement = React.useMemo(
    () => {
      if (!isVisible.header || !HeaderComponent) {
        return null;
      }

      return (
        <HeaderComponent
          {...sideComponentProps}
        />
      );
    },
    [
      HeaderComponent,
      isVisible.header,
      sideComponentProps,
    ],
  );

  const SidebarElement = Components && Components.Sidebar;
  const sidebarElement = React.useMemo(
    () => {
      if (!isVisible.sidebar || !SidebarElement) {
        return null;
      }

      return (
        <SidebarElement
          {...sideComponentProps}
        />
      );
    },
    [
      SidebarElement,
      isVisible.sidebar,
      sideComponentProps,
    ],
  );

  const FooterElement = Components && Components.Footer;
  const footerElement = React.useMemo(
    () => {
      if (!isVisible.footer || !FooterElement) {
        return null;
      }

      return (
        <FooterElement
          {...sideComponentProps}
        />
      );
    },
    [
      FooterElement,
      isVisible.footer,
      sideComponentProps,
    ],
  );


  // ----
  // Context Value Builder
  // ----
  const appRouterContext = React.useMemo(
    (): AppRouterContext<RoutesDefinition, any> => {

      /** Get Path Matcher */
      const pathMatcher = matchPath(location.pathname, { path: currentRoute.path });

      return {
        couldRouteTo       : userCouldRouteTo,
        currentRoute       : {
          isExact: !!(pathMatcher?.isExact),
          params : (pathMatcher?.params ?? {}) as any,
          route  : currentRoute,
          search : new URLSearchParams(location.search),
          url    : pathMatcher?.url ?? location.pathname,
        },
        defaultPrivateRoute: getDefaultDefinedRoute(routes, 'private'),
        defaultPublicRoute : getDefaultDefinedRoute(routes, 'public'),
        isValidRoute,
        getRouteByName     : (name: string) => getRouteByName(routes, name, Components),
        getRouteByPathName : (path: string) => getRouteByPathName(routes, path, Components),
        layout             : {
          appendRouteClassNameTo,
          hasFooter                    : isVisible.footer,
          hasHeader                    : isVisible.header,
          hasNavbar                    : isVisible.navbar,
          hasSidebar                   : isVisible.sidebar,
          hidePageWhileInitiallyLoading: !!hidePageWhileInitiallyLoading,
          hidePageWhileLoading         : !!hidePageWhileLoading,
          InitialLoader: Components?.InitialLoader,
          Loader: Components?.Loader,
          pageTitleWhileInitiallyLoading,
          pageTitleWhileLoading,
        },
        routeTo            : handleRouteTo,
        setAppName,
        setPageTitle       : handleChangePageTitle,
        sideComponentProps,
        state              : sideComponentProps.appState,
        useRouteClassName  : !!useRouteClassName,
      };
    },
    [
      handleRouteTo,
      location.pathname,
      location.search,
      currentRoute,
      userCouldRouteTo,
      routes,
      isValidRoute,
      appendRouteClassNameTo,
      isVisible.footer,
      isVisible.header,
      isVisible.navbar,
      isVisible.sidebar,
      hidePageWhileInitiallyLoading,
      hidePageWhileLoading,
      pageTitleWhileInitiallyLoading,
      pageTitleWhileLoading,
      handleChangePageTitle,
      sideComponentProps,
      useRouteClassName,
      Components,
    ],
  );


  // ----
  // ClassNames
  // ----
  const viewClasses = clsx('view-content', clsx(innerClassNames?.viewClassNames));
  const pageClasses = clsx('page-content', clsx(innerClassNames?.viewClassNames));


  // ----
  // Router Render
  // ----
  return (
    <AppRouterProvider value={appRouterContext}>

      <RouteWatcher
        appendRouteClassNameTo={appendRouteClassNameTo}
        fireOnRouteChangeEventOnMount={fireOnRouteChangeEventOnMount}
        hashClassNamePrefix={hashClassNamePrefix}
        onHashChange={onHashChange}
        onRouteChange={handleRouteChange}
      />

      {navBarElement}

      {sidebarElement}

      <div className={viewClasses}>

        {headerElement}

        <div className={pageClasses}>
          <Switch>
            {/* Build each single route */}
            {routes.map((route) => (
              <Route
                key={route.name as string}
                path={route.path}
                exact={route.exact}
                sensitive={route.sensitive}
                strict={route.strict}
              >
                {(routeProps) => (
                  <PageWrapper
                    {...routeProps}
                    route={route}
                  />
                )}
              </Route>
            ))}

            {/* Build the Not Found route */}
            {Components?.NotFound && (
              <Route>
                {(routeProps) => (
                  <PageWrapper
                    {...routeProps}
                    route={{
                      name     : '__not_found_internal_component__',
                      path     : '/',
                      exact    : false,
                      component: Components.NotFound!,
                      isPublic : true,
                      isPrivate: true,
                    }}
                  />
                )}
              </Route>
            )}
          </Switch>
        </div>

        {footerElement}

      </div>

    </AppRouterProvider>
  );
}

AppRouterInner.displayName = 'AppRouterInner';

AppRouterInner.defaultProps = {
  hidePageWhileInitiallyLoading : true,
  hidePageWhileLoading          : false,
  routes                        : [],
  pageTitleSeparator            : ' | ',
  pageTitleWhileInitiallyLoading: 'Loading...',
};


/* --------
 * Wrap App Router with Router
 * -------- */
function AppRouter<RoutesDefinition extends BaseRoutesDefinition>(
  props: React.PropsWithChildren<AppRouterProps<RoutesDefinition>>,
) {
  /** Strip Browser Router Props */
  const {
    browserRouterProps,
    ...rest
  } = props;

  return (
    <BrowserRouter {...browserRouterProps}>
      <AppRouterInner<RoutesDefinition>
        {...rest}
      />
    </BrowserRouter>
  );
}

AppRouter.displayName = 'AppRouter';

export default AppRouter;
