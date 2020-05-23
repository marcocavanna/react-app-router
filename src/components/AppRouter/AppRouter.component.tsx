import * as React from 'react';

import {
  BrowserRouter,
  Switch,
  matchPath,
  generatePath,
  withRouter
} from 'react-router-dom';

import compose from 'recompose/compose';
import clsx from 'clsx';

import isValidString from '../../utils/is-valid-string';

import { AppRouterProvider } from '../../context/app.router.context';

import RouteWatcher from '../RouteWatcher/RouteWatcher.component';
import PageWrapper from '../PageWrapper/PageWrapper.component';

import type { History, Location } from 'history';

import type AppRoute from '../../interfaces/AppRoute';
import type AppState from '../../interfaces/AppState';

import type { AppRouterTools, RouteParams } from '../../context/app.router.context.interfaces';

import type {
  AppRouterInnerProps,
  AppRouterOuterProps,
  AppRouterProps,
  AppRouterSplittedProps,
  AppRouterState
} from './AppRouter.interfaces';


class AppRouterWrapped extends React.Component<AppRouterInnerProps, AppRouterState> {

  /* --------
   * Static Fields
   * -------- */
  static displayName = 'AppRouter';

  static defaultProps = {
    hidePageWhileInitiallyLoading : true,
    hidePageWhileLoading          : true,
    routes                        : [],
    pageTitleSeparator            : ' | ',
    pageTitleWhileInitiallyLoading: 'Loading...'
  };


  /* --------
   * Static LifeCycle Methods
   * -------- */
  static getDerivedStateFromProps(props: AppRouterInnerProps, state: Partial<AppRouterState>): Partial<AppRouterState> {
    /** Get Props */
    const {
      hasNavbar : routerHasNavbar,
      hasSidebar: routerHasSidebar
    } = props;

    /** Get current route from state */
    const {
      currentRoute
    } = state;

    /**
     * Check if nextPage has Navbar and Sidebar
     * falling back to default if one of this isn't defined.
     * Default value is true only for private page
     */
    const {
      hasNavbar : pageHasNavbar = !!(currentRoute?.isPrivate && !currentRoute?.isPublic),
      hasSidebar: pageHasSidebar = !!(currentRoute?.isPrivate && !currentRoute?.isPublic)
    } = currentRoute ?? {};

    /** Compute new value */
    const nextHasNavbar = !!(pageHasNavbar && routerHasNavbar);
    const nextHasSidebar = !!(pageHasSidebar && routerHasSidebar);

    /** Update state value */
    return {
      ...state,
      currentRoute,
      hasNavbar : nextHasNavbar,
      hasSidebar: nextHasSidebar
    };
  }


  /* --------
   * Static Methods
   * -------- */
  private static getRoute(routes: AppRoute[], routeName: string): AppRoute | undefined {
    return routes.find(({ name }) => name === routeName);
  }


  private static getDefaultDefinedRoute(routes: AppRoute[], type: 'private' | 'public'): AppRoute | undefined {
    return routes.find(({ isDefault, isPrivate, isPublic }) => (
      ((isPrivate && isPublic) || (!isPrivate && !isPublic)) && isDefault === type
    ));
  }


  private static getDefaultPrivateRoute(routes: AppRoute[]): AppRoute {
    /** Get the organic default private route */
    const organicDefaultRoute = routes.find(({ isDefault, isPrivate, isPublic }) => (
      isDefault && isPrivate && !isPublic
    ));

    if (organicDefaultRoute) {
      return organicDefaultRoute;
    }

    /** Fallback to an hybrid page directly defined as default private route */
    const definedDefaultRoute = AppRouterWrapped.getDefaultDefinedRoute(routes, 'private');

    if (definedDefaultRoute) {
      return definedDefaultRoute;
    }

    /** Fallback to the first private route */
    const firstPrivateRoute = routes.find(({ isPrivate }) => isPrivate);

    if (firstPrivateRoute) {
      return firstPrivateRoute;
    }

    /** Fallback to first route */
    return routes[0];
  }


  private static getDefaultPublicRoute(routes: AppRoute[]): AppRoute {
    /** Get the organic default private route */
    const organicDefaultRoute = routes.find(({ isDefault, isPrivate, isPublic }) => (
      isDefault && !isPrivate && isPublic
    ));

    if (organicDefaultRoute) {
      return organicDefaultRoute;
    }

    /** Fallback to an hybrid page directly defined as default private route */
    const definedDefaultRoute = AppRouterWrapped.getDefaultDefinedRoute(routes, 'public');

    if (definedDefaultRoute) {
      return definedDefaultRoute;
    }

    /** Fallback to the first private route */
    const firstPrivateRoute = routes.find(({ isPublic }) => isPublic);

    if (firstPrivateRoute) {
      return firstPrivateRoute;
    }

    /** Fallback to first route */
    return routes[0];
  }


  /* --------
   * Helpers
   * -------- */
  getCurrentRoute = (): AppRoute => {
    const { routes } = this.props;
    return routes.find(({ path }) => (
      matchPath(window.location.pathname, { path, exact: true })
    )) ?? {
      component: () => <h3>Route not Found</h3>,
      name     : '__NotFound',
      path     : 'not-found'
    };
  };

  couldRouteTo = (route?: AppRoute): boolean => {
    /** Prevent if no route */
    if (!route) {
      return false;
    }

    /** Check using userHasAuth props */
    const { userHasAuth } = this.props;

    const { isPrivate, isPublic } = route;

    const isHybrid = (isPrivate && isPublic) || (!isPrivate && !isPublic);

    return (userHasAuth && (isPrivate || isHybrid)) || (!userHasAuth && (isPublic || isHybrid));
  };


  /* --------
   * State Initialization
   * -------- */
  state: AppRouterState = {
    appName     : this.props.defaultAppName,
    currentRoute: this.getCurrentRoute(),
    hasNavbar   : !!this.props.hasNavbar,
    hasSidebar  : !!this.props.hasSidebar
  };

  private appendRouteClassNameTo: HTMLElement = this.props.appendRouteClassNameTo ?? document.body;


  /* --------
   * State Managers
   * -------- */
  handleChangeAppName = (nextAppName?: string | ((currentAppName?: string) => string)) => {
    /** Change State only if appName is changed */
    const { appName: currAppName } = this.state;

    const appName = typeof nextAppName === 'function'
      ? nextAppName(currAppName)
      : nextAppName;

    if (nextAppName !== currAppName) {
      this.setState({
        appName
      });
    }
  };

  handleSetPageTitle = (pageTitle?: string) => {
    /** Get Current AppName */
    const { appName } = this.state;

    /** Get the Page Title separator */
    const { pageTitleSeparator } = this.props;

    if (!appName && !pageTitle) {
      document.title = 'No Title';
    }
    else {
      document.title = [ appName, pageTitle ].filter(isValidString).join(pageTitleSeparator ?? '');
    }
  };

  handleGetRouteByName = (name: string) => (
    AppRouterWrapped.getRoute(this.props.routes, name)
  );

  handleRouteTo = (route: string | AppRoute, params?: RouteParams, state?: History.LocationState) => {
    /** Get the Router from Props */
    const {
      history,
      routes
    } = this.props;

    /** Get the next Route */
    const nextPath = typeof route === 'string'
      ? AppRouterWrapped.getRoute(routes, route)?.path
      : route.path;

    /** If no route has been found, return to 404 url */
    if (!nextPath) {
      history.push('/404', state);
      return;
    }

    /** If no params are passed, go to next path */
    if (typeof params !== 'object') {
      history.push(nextPath, state);
    }
    /** Else compile path with params */
    else {
      history.push(generatePath(nextPath, params), state);
    }
  };


  /* --------
   * Context Builder
   * This object and set of utility
   * are passed down to Context Provider
   * to be used with hook or HOC
   * -------- */
  private buildContextTools(splittedProps: AppRouterSplittedProps): AppRouterTools {
    /** Get Current State */
    const {
      appName,
      hasNavbar,
      hasSidebar,
      currentRoute
    } = this.state;

    /** Get Splitted Props */
    const {
      appState,
      Components
    } = splittedProps;

    /** Get Location Params */
    const {
      match,
      location,
      routes,
      hidePageWhileInitiallyLoading,
      hidePageWhileLoading,
      pageTitleWhileInitiallyLoading,
      pageTitleWhileLoading
    } = this.props;

    /** Get default Route */
    const defaultPrivateRoute = AppRouterWrapped.getDefaultPrivateRoute(routes);
    const defaultPublicRoute = AppRouterWrapped.getDefaultPublicRoute(routes);

    return {

      // Current AppName
      appName,

      // Current AppState
      appState,

      // Current Rendered Route and Routing func
      currentRoute         : {
        route : currentRoute,
        params: match.params,
        search: new URLSearchParams(location.search)
      },
      getRoute             : this.handleGetRouteByName,
      routeTo              : this.handleRouteTo,
      couldRouteTo         : this.couldRouteTo,
      routeToDefaultPrivate: (params?: RouteParams, state?: History.LocationState) => (
        this.handleRouteTo(defaultPrivateRoute.name, params, state)
      ),
      routeToDefaultPublic : (params?: RouteParams, state?: History.LocationState) => (
        this.handleRouteTo(defaultPublicRoute.name, params, state)
      ),
      defaultPrivateRoute,
      defaultPublicRoute,

      // Current Layout State
      layout: {
        hasNavbar,
        hasSidebar,
        pageTitleWhileInitiallyLoading,
        pageTitleWhileLoading,
        hidePageWhileInitiallyLoading: !!hidePageWhileInitiallyLoading,
        hidePageWhileLoading         : !!hidePageWhileLoading,
        Loader                       : Components.Loader,
        InitialLoader                : Components.InitialLoader
      },

      // Set new AppName or restore default
      setAppName    : this.handleChangeAppName,
      restoreAppName: () => this.handleChangeAppName(this.props.defaultAppName),

      // Set Document Title
      setPageTitle: this.handleSetPageTitle

    };
  }


  /* --------
   * Helpers
   * -------- */
  private splitProps(): AppRouterSplittedProps {
    /** Destructure all Props */
    const {
      // Get Route Watcher Props
      fireOnRouteChangeEventOnMount,
      hashClassNamePrefix,
      useRouteClassName,
      onHashChange,

      // Get App State
      isInitiallyLoading,
      isLoading,
      userHasAuth,

      // Get Extra Components
      components: Components = {},

      // Get content class
      innerClassNames: {
        pageClassNames = null,
        viewClassNames = null
      } = {},

      // Transfer Props
      routes,
      getNextRoute,

      // Strip unused props from rest
      defaultAppName,
      children,
      onRouteChange,
      hasSidebar: hasSidebarProps,
      hasNavbar: hasNavbarProps,

      // Get any other props
      ...rest
    } = this.props;

    /** Build the AppState Props */
    const appState: AppState = {
      isInitiallyLoading: !!isInitiallyLoading,
      isLoading         : !!isLoading,
      userHasAuth       : !!userHasAuth
    };

    /** Build Props to pass to extra content */
    const extraContentProps = { appState, ...rest };

    /** Return Props */
    return {
      // Extra Components
      Components,
      // Pass the appState
      appState,
      // Props to pass to Extra Content
      extraContentProps,
      // Pass extra class names
      innerClassNames  : { pageClassNames, viewClassNames },
      // Insert routes array
      routes,
      // Route Watcher Strict Props
      routeWatcherProps: {
        fireOnRouteChangeEventOnMount,
        hashClassNamePrefix,
        useRouteClassName,
        onHashChange
      }
    };

  }


  private handleRouteChange = (currentPathName: string, location: Location, history: History): void => {
    const current = this.getCurrentRoute();

    /** Update the State based on Current Route only if Changed */
    if (current.name === this.state.currentRoute.name) {
      return;
    }

    this.forceUpdate(() => {
      /** Call external onRouteChange handler if exists */
      const { onRouteChange } = this.props;

      if (typeof onRouteChange === 'function') {
        onRouteChange(current, location, history);
      }
    });
  };


  /* --------
   * Main Render
   * -------- */
  render() {
    /** Get Current State */
    const {
      hasNavbar,
      hasSidebar
    } = this.state;

    /** Split components props */
    const splittedProps = this.splitProps();

    /** Get the getNextRoute function from props */
    const {
      getNextRoute
    } = this.props;

    const {
      Components,
      extraContentProps,
      innerClassNames,
      routes,
      routeWatcherProps
    } = splittedProps;

    /** Build the Context */
    const ctxValue = this.buildContextTools(splittedProps);

    /** Build view classes */
    const viewClasses = clsx('view-content', clsx(innerClassNames.viewClassNames));
    const pageClasses = clsx('page-content', clsx(innerClassNames.viewClassNames));

    /** Render the Component */
    return (
      <AppRouterProvider value={ctxValue}>
        {/* Use Route Watcher */}
        <RouteWatcher
          {...routeWatcherProps}
          appendRouteClassNameTo={this.appendRouteClassNameTo}
          onRouteChange={this.handleRouteChange}
        />

        {/* Insert the Navbar */}
        {hasNavbar && Components.Navbar && (
          <Components.Navbar {...extraContentProps} />
        )}

        {/* Insert the Sidebar */}
        {hasSidebar && Components.Sidebar && (
          <Components.Sidebar {...extraContentProps} />
        )}

        {/* Build the main View Wrapper */}
        <div className={viewClasses}>

          {/* Prepend Top Content if Exists */}
          {Components.Header && (
            <Components.Header {...extraContentProps} />
          )}

          {/* Insert the Page Wrapper */}
          <div className={pageClasses}>
            <Switch>

              {/* Loop each route to build the page wrapper */}
              {routes.map(page => (
                <PageWrapper
                  key={page.name}
                  appendRouteClassNameTo={this.appendRouteClassNameTo}
                  getNextRoute={getNextRoute}
                  extraContentProps={extraContentProps}
                  {...page}
                />
              ))}

              {/* Add the not found fallback */}
              {Components.NotFound && (
                <PageWrapper
                  isPrivate
                  isPublic
                  appendRouteClassNameTo={this.appendRouteClassNameTo}
                  extraContentProps={extraContentProps}
                  name={'__NotFound'}
                  component={Components.NotFound}
                />
              )}

            </Switch>
          </div>

          {/* Append Footer Content if Exists */}
          {Components.Footer && (
            <Components.Footer {...extraContentProps} />
          )}

        </div>

      </AppRouterProvider>
    );
  }

}


const AppRouterWrappedWithRouter = compose<AppRouterInnerProps, AppRouterOuterProps>(withRouter)(AppRouterWrapped);


const AppRouter: React.FC<AppRouterProps> = (props) => {
  /** Strip Browser Router Props */
  const {
    browserRouterProps,
    ...rest
  } = props;

  return (
    <BrowserRouter {...browserRouterProps}>
      <AppRouterWrappedWithRouter {...rest} />
    </BrowserRouter>
  );
};

export default AppRouter;
