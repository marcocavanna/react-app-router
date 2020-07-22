import * as React from 'react';
import invariant from 'tiny-invariant';

import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
  generatePath
} from 'react-router-dom';

import { useAppState, useLayout, usePageTitle, useRouting } from '../../hooks';
import toggleHTMLNodeClassNames from '../../utils/toggle-html-node-classnames';

import type { PageWrapperProps } from './PageWrapper.interfaces';

import type AppRoute from '../../interfaces/AppRoute';
import type { StrictMandatoryRedirect } from '../AppRouter/AppRouter.interfaces';


function PageWrapper(wrapperProps: PageWrapperProps): React.ReactElement<RouteProps> {

  /** Get Props */
  const {
    // App Router handler
    getNextRoute,
    extraContentProps,
    appendRouteClassNameTo,

    // Core Props
    component: Component,
    isPrivate,
    isPublic,
    title,

    // Route Props
    path,
    exact,
    strict,
    sensitive,

    ...restRouteProps
  } = wrapperProps;

  /** Compute extra props */
  const isHybrid = (isPrivate && isPublic) || (!isPrivate && !isPublic);

  const appState = useAppState();

  const {
    userHasAuth,
    isLoading,
    isInitiallyLoading
  } = appState;

  const {
    hasNavbar,
    hasSidebar,
    hidePageWhileLoading,
    hidePageWhileInitiallyLoading,
    pageTitleWhileLoading,
    pageTitleWhileInitiallyLoading,
    Loader,
    InitialLoader
  } = useLayout();

  const {
    getRoute,
    defaultPublicRoute,
    defaultPrivateRoute
  } = useRouting();

  const [ , setPageTitle ] = usePageTitle();

  /** Render Route */
  const renderRoute = (routeProps: RouteComponentProps<any>) => {
    /**
     * While App is Initially Loading, any mandatory redirect could not be performed.
     * In this case must render the Initial Loader if exists, or null.
     * This effect will be valid until hidePageWhileInitiallyLoading is equal to true
     */
    if (isInitiallyLoading) {
      /** Set page Title if Exists */
      if (typeof pageTitleWhileInitiallyLoading === 'string') {
        setPageTitle(pageTitleWhileInitiallyLoading);
      }

      /** If must Hide Page, do it */
      if (hidePageWhileInitiallyLoading) {
        return (
          InitialLoader && <InitialLoader {...extraContentProps} />
        );
      }
    }

    /**
     * Before render the page component
     * or any loader components check if user
     * could reach this route
     */
    let mandatoryRedirect: StrictMandatoryRedirect | null = null;

    /** Call the getNextRoute function first if exists */
    if (typeof getNextRoute === 'function') {
      const userDefinedMandatoryRedirect = getNextRoute({
        isPrivate,
        isPublic,
        ...restRouteProps as AppRoute,
        path     : path ?? '',
        component: Component
      }, appState, routeProps);

      if (userDefinedMandatoryRedirect) {
        if (typeof (userDefinedMandatoryRedirect as string) === 'string') {
          mandatoryRedirect = {
            route : userDefinedMandatoryRedirect as string,
            params: {},
            state : {
              redirectedBy: 'user'
            }
          };
        }
        else {
          mandatoryRedirect = {
            ...(userDefinedMandatoryRedirect as StrictMandatoryRedirect),
            state: {
              ...(userDefinedMandatoryRedirect as StrictMandatoryRedirect).state,
              redirectedBy: 'user'
            }
          };
        }
      }
    }

    /** If custom assertion doesn't exists, check the auth state and page visibility */
    if (!mandatoryRedirect) {
      let systemDefinedMandatoryRedirect: string | AppRoute | null = null;

      /**
       * If the page is only public and not hybrid,
       * and the current user has got auth,
       * force redirect to the default Private Page
       */
      if (isPublic && !isHybrid && userHasAuth) {
        systemDefinedMandatoryRedirect = defaultPrivateRoute;
      }

      /**
       * Else, check if the page is only private and not hybrid
       * and if the current user hasn't got auth force redirect
       * to the default Public Page
       */
      if (isPrivate && !isHybrid && !userHasAuth) {
        systemDefinedMandatoryRedirect = defaultPublicRoute;
      }

      if (systemDefinedMandatoryRedirect) {
        mandatoryRedirect = {
          route : systemDefinedMandatoryRedirect,
          params: {},
          state : {
            redirectedBy: 'system'
          }
        };
      }
    }

    /**
     * If a mandatory redirect exists, check user
     * is not on the same page to avoid redirect loop
     */
    if (mandatoryRedirect) {
      const routePath = typeof mandatoryRedirect.route === 'string'
        ? getRoute(mandatoryRedirect.route)?.path
        : mandatoryRedirect.route.path;

      invariant(
        typeof routePath === 'string',
        `Route path has not been found for '${typeof mandatoryRedirect.route === 'string'
          ? mandatoryRedirect.route
          : mandatoryRedirect.route.name}'`
      );

      const nextPath = generatePath(routePath, mandatoryRedirect.params);

      if (nextPath !== routeProps.location.pathname) {
        return (
          <Redirect
            to={{
              pathname: nextPath,
              state   : {
                ...mandatoryRedirect.state,
                redirectedFrom: routeProps.location.pathname
              }
            }}
          />
        );
      }
    }

    /** Set the Page Title */
    if (isLoading && pageTitleWhileLoading) {
      setPageTitle(pageTitleWhileLoading);
    }
    else {
      setPageTitle(title);
    }

    /** Render loaders if they are hiding page */
    if (isLoading && hidePageWhileLoading) {
      return (
        Loader && <Loader {...extraContentProps} />
      );
    }

    /** Set the HTML ClassNames on Root Element */
    toggleHTMLNodeClassNames(appendRouteClassNameTo!, {
      'has-auth'    : userHasAuth,
      'with-sidebar': hasSidebar,
      'with-navbar' : hasNavbar
    });

    /** Return the Component */
    return (
      <React.Fragment>
        {isInitiallyLoading && InitialLoader && <InitialLoader {...extraContentProps} />}

        {isLoading && Loader && <Loader {...extraContentProps} />}

        <Component
          {...routeProps}
        />
      </React.Fragment>
    );

  };

  /** Return the route component */
  return (
    <Route
      /** Append Props */
      path={path}
      exact={exact}
      strict={strict}
      sensitive={sensitive}
      /** Render the Component */
      render={renderRoute}
    />
  );

}

PageWrapper.defaultProps = {
  exact: true
};

export default PageWrapper;
