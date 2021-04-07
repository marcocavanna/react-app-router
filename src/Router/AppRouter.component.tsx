import * as React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  generatePath,
  matchPath,
  useHistory,
  useLocation
} from 'react-router-dom';

import clsx from 'clsx';

import type {
  History
} from 'history';

import {
  getDefaultDefinedRoute,
  getRouteByPathName,
  getRouteByName,
  getRoutesMap
} from './lib';

import { isValidString } from '../helpers';

import MemoizedNotFoundPage from '../components/404Page';
import PageWrapper from '../components/PageWrapper';
import RouteWatcher from '../components/RouteWatcher';
import SideComponent from '../components/SideComponent';

import { AppRouterProvider } from './AppRouter.context';

import type {
  AppRoute,
  AppRouterProps,
  BaseRoutesDefinition
} from '../interfaces';

import type { AppRouterContext } from './AppRouter.context';


/* --------
 * Inner AppRouter Component Props
 * -------- */
type AppRouterInnerProps<RoutesDefinition extends BaseRoutesDefinition> = Omit<AppRouterProps<RoutesDefinition>, 'browserRouterProps'>;


/* --------
 * Inner AppRouter Component Definition
 * -------- */
function AppRouterInner<RoutesDefinition extends BaseRoutesDefinition>(
  props: React.PropsWithChildren<AppRouterInnerProps<RoutesDefinition>>
): React.ReactElement<AppRouterInnerProps<RoutesDefinition>> | null {


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
    routes: _routes,

    /** Route Watcher Props */
    appendRouteClassNameTo: userDefinedAppendRouteClassNameTo,
    fireOnRouteChangeEventOnMount,
    hashClassNamePrefix,
    onHashChange,
    useRouteClassName
  } = props;


  const location = useLocation<any>();
  const history = useHistory();

  const appendRouteClassNameTo = userDefinedAppendRouteClassNameTo || document.body;


  // ----
  // Mapped Routes and Memoized Components
  // ----
  /** Map all Routes */
  const routesMap = React.useMemo(
    () => getRoutesMap(_routes),
    [ _routes ]
  );

  /** Set the Not Found Component */
  const NotFoundComponent = Components?.NotFound || MemoizedNotFoundPage;

  /** Store the currentRoute */
  const currentRoute = React.useMemo(
    () => (
      getRouteByPathName<RoutesDefinition, any>(routesMap, location.pathname, NotFoundComponent)
    ),
    [ routesMap, location.pathname, NotFoundComponent ]
  );


  // ----
  // Internal Functions
  // ----

  /**
   * Assert an user could route to a provided
   * route using the current userHasAuth state
   * and isPublic or isPrivate route definition
   */
  const userCouldRouteTo = React.useCallback(
    (route?: AppRoute<RoutesDefinition, keyof RoutesDefinition>) => {
      /** Prevent if no root exists */
      if (!route) {
        return false;
      }

      /** Assert routing using user auth state */
      const { isPrivate, isPublic } = route;

      const isHybrid = (isPrivate && isPublic) || (!isPrivate && !isPublic);

      return (userHasAuth && (isPrivate || isHybrid)) || (!userHasAuth && (isPublic || isHybrid));
    },
    [ userHasAuth ]
  );


  // ----
  // Internal State and Visibility
  // ----

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
        hasSidebar: routeHasSidebar = !!(currentRoute.isPrivate && !currentRoute.isPublic)
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
        sidebar: nextHasSidebar
      };
    },
    [
      currentRoute,
      userDefinedHasFooter,
      userDefinedHasHeader,
      userDefinedHasNavbar,
      userDefinedHasSidebar
    ]
  );


  // ----
  // Handlers
  // ----
  const handleRouteChange = React.useCallback(
    (pathName: string) => {
      /** Get routing using pathName */
      const route = getRouteByPathName<RoutesDefinition, any>(routesMap, pathName, NotFoundComponent);

      /** If route is the same, skip updating */
      if (route.name === currentRoute.name) {
        return;
      }

      /** Call onRouteChange handler */
      if (typeof onRoutesChange === 'function') {
        onRoutesChange(route, location, history);
      }
    },
    [
      routesMap,
      NotFoundComponent,
      currentRoute.name,
      onRoutesChange,
      location,
      history
    ]
  );


  const handleRouteTo = React.useCallback(
    <Name extends keyof RoutesDefinition>(
      route: Name, params?: RoutesDefinition[Name], state?: History.LocationState
    ) => {
      /** Get the next route */
      const nextRoute = getRouteByName<RoutesDefinition, any>(routesMap, route as string, NotFoundComponent);

      /** Push the next route */
      history.push(generatePath(nextRoute.path, params), state);
    },
    [
      NotFoundComponent,
      history,
      routesMap
    ]
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
          nextTitle
        ].filter(isValidString).join(pageTitleSeparator ?? ' ');
      }
    },
    [
      appName,
      pageTitleSeparator
    ]
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
          url    : pathMatcher?.url ?? location.pathname
        },
        defaultPrivateRoute: getDefaultDefinedRoute(routesMap, 'private', NotFoundComponent),
        defaultPublicRoute : getDefaultDefinedRoute(routesMap, 'public', NotFoundComponent),
        isValidRoute,
        getRouteByName     : <Route extends keyof RoutesDefinition>(name: Route) => (
          getRouteByName<RoutesDefinition, any>(routesMap, name, NotFoundComponent)
        ),
        getRouteByPathName : (path: string) => (
          getRouteByPathName<RoutesDefinition, any>(routesMap, path, NotFoundComponent)
        ),
        layout             : {
          appendRouteClassNameTo,
          hasFooter                    : isVisible.footer,
          hasHeader                    : isVisible.header,
          hasNavbar                    : isVisible.navbar,
          hasSidebar                   : isVisible.sidebar,
          hidePageWhileInitiallyLoading: !!hidePageWhileInitiallyLoading,
          hidePageWhileLoading         : !!hidePageWhileLoading,
          InitialLoader                : Components?.InitialLoader,
          Loader                       : Components?.Loader,
          pageTitleWhileInitiallyLoading,
          pageTitleWhileLoading
        },
        routes             : routesMap,
        routeTo            : handleRouteTo,
        setAppName,
        setPageTitle       : handleChangePageTitle,
        state              : {
          isInitiallyLoading: !!isInitiallyLoading,
          isLoading         : !!isLoading,
          userHasAuth       : !!userHasAuth,
          usersPermissions  : undefined
        },
        useRouteClassName  : !!useRouteClassName
      };
    },
    [
      currentRoute,
      NotFoundComponent,
      routesMap,
      isInitiallyLoading,
      isLoading,
      userHasAuth,
      handleRouteTo,
      location.pathname,
      location.search,
      userCouldRouteTo,
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
      useRouteClassName,
      Components
    ]
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

      <SideComponent isVisible={isVisible.navbar} Component={Components?.Navbar} />

      <SideComponent isVisible={isVisible.sidebar} Component={Components?.Sidebar} />

      <div className={viewClasses}>

        <SideComponent isVisible={isVisible.header} Component={Components?.Header} />

        <div className={pageClasses}>
          <Switch>
            {Array.from(routesMap.values()).map((route) => (
              <Route
                key={route.name as React.ReactText}
                path={route.path}
                exact={route.exact}
                sensitive={route.sensitive}
                strict={route.strict}
                component={PageWrapper}
              />
            ))}

            <Route
              render={(routeProps) => (
                <NotFoundComponent
                  {...routeProps}
                  appState={appRouterContext.state}
                  currentRoute={appRouterContext.currentRoute}
                />
              )}
            />
          </Switch>
        </div>

        <SideComponent isVisible={isVisible.footer} Component={Components?.Footer} />

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
  pageTitleWhileInitiallyLoading: 'Loading...'
};


/* --------
 * Wrap App Router with Router
 * -------- */
function AppRouter<RoutesDefinition extends BaseRoutesDefinition>(
  props: React.PropsWithChildren<AppRouterProps<RoutesDefinition>>
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
