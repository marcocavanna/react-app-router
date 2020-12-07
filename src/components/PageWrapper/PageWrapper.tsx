import * as React from 'react';
import invariant from 'tiny-invariant';

import { RouteComponentProps, generatePath, Redirect, Route } from 'react-router-dom';

import {
  useAppRouter,
} from '../AppRouter/AppRouter.context';

import { AppRoute, StrictMandatoryRedirect } from '../../interfaces';
import { toggleHTMLNodeClassNames } from '../../utils';


/* --------
 * Component Declare
 * -------- */
type PageWrapperComponent = React.FunctionComponent<{
  route: AppRoute<any>
}>;


/* --------
 * Component Definition
 * -------- */
const PageWrapper: PageWrapperComponent = (props) => {

  const {
    route,
  } = props;

  // ----
  // Hooks and Variables Init
  // ----
  const {
    layout: {
      InitialLoader,
      Loader,
      ...layout
    },
    isValidRoute,
    state,
    defaultPrivateRoute,
    defaultPublicRoute,
    setPageTitle,
    sideComponentProps,
    getRouteByName,
    useRouteClassName,
  } = useAppRouter();

  const {
    isPrivate,
    isPublic,
    component: Component,
  } = route;

  const isHybrid = (isPrivate && isPublic) || (!isPrivate && !isPublic);


  // ----
  // Memoized Components
  // ----
  const initialLoaderElement = React.useMemo(
    () => {
      if (!InitialLoader || !state.isInitiallyLoading) {
        return null;
      }

      return (
        <InitialLoader {...sideComponentProps} />
      );
    },
    [
      sideComponentProps,
      InitialLoader,
      state.isInitiallyLoading,
    ],
  );

  const loaderElement = React.useMemo(
    () => {
      if (!Loader || !state.isLoading) {
        return null;
      }

      return (
        <Loader {...sideComponentProps} />
      );
    },
    [
      sideComponentProps,
      Loader,
      state.isLoading,
    ],
  );


  // ----
  // Route Renderer
  // ----
  const renderRoute = React.useCallback(
    (routeProps: RouteComponentProps<any>) => {
      /**
       * While App is Initially Loading, any mandatory redirect could not be performed.
       * In this case must render the Initial Loader if exists, or null.
       * This effect will be valid until hidePageWhileInitiallyLoading is equal to true
       */
      if (state.isInitiallyLoading) {
        /** Set page Title if Exists */
        if (typeof layout.pageTitleWhileInitiallyLoading === 'string') {
          setPageTitle(layout.pageTitleWhileInitiallyLoading);
        }

        /** If must Hide Page, do it */
        if (layout.hidePageWhileInitiallyLoading) {
          return initialLoaderElement;
        }
      }

      /**
       * Before render the page component
       * or any loader components check if user
       * could reach this route
       */
      let mandatoryRedirect: StrictMandatoryRedirect<any> | null = null;

      /** Call the getNextRoute function first if exists */
      if (typeof isValidRoute === 'function') {
        const userDefinedMandatoryRedirect = isValidRoute(
          route as any,
          state,
          routeProps,
        );

        if (userDefinedMandatoryRedirect) {
          if (typeof (userDefinedMandatoryRedirect as string) === 'string') {
            mandatoryRedirect = {
              route : userDefinedMandatoryRedirect as string,
              params: {},
              state : {
                redirectedBy: 'user',
              },
            };
          }
          else {
            mandatoryRedirect = {
              ...(userDefinedMandatoryRedirect as StrictMandatoryRedirect<any>),
              state: {
                ...(userDefinedMandatoryRedirect as StrictMandatoryRedirect<any>).state,
                redirectedBy: 'user',
              },
            };
          }
        }
      }

      /** If custom assertion doesn't exists, check the auth state and page visibility */
      if (!mandatoryRedirect) {
        let systemDefinedMandatoryRedirect: string | AppRoute<any> | null = null;

        /**
         * If the page is only public and not hybrid,
         * and the current user has got auth,
         * force redirect to the default Private Page
         */
        if (isPublic && !isHybrid && state.userHasAuth) {
          systemDefinedMandatoryRedirect = defaultPrivateRoute;
        }

        /**
         * Else, check if the page is only private and not hybrid
         * and if the current user hasn't got auth force redirect
         * to the default Public Page
         */
        if (isPrivate && !isHybrid && !state.userHasAuth) {
          systemDefinedMandatoryRedirect = defaultPublicRoute;
        }

        if (systemDefinedMandatoryRedirect) {
          mandatoryRedirect = {
            route : systemDefinedMandatoryRedirect,
            params: {},
            state : {
              redirectedBy: 'system',
            },
          };
        }
      }

      /**
       * If a mandatory redirect exists, check user
       * is not on the same page to avoid redirect loop
       */
      if (mandatoryRedirect) {
        const routePath = typeof mandatoryRedirect.route === 'string'
          ? getRouteByName(mandatoryRedirect.route)?.path
          : mandatoryRedirect.route.path;

        invariant(
          typeof routePath === 'string',
          `Route path has not been found for '${typeof mandatoryRedirect.route === 'string'
            ? mandatoryRedirect.route
            : mandatoryRedirect.route.name}'`,
        );

        const nextPath = generatePath(routePath, mandatoryRedirect.params);

        if (nextPath !== routeProps.location.pathname) {
          return (
            <Redirect
              to={{
                pathname: nextPath,
                state   : {
                  ...mandatoryRedirect.state,
                  redirectedFrom: routeProps.location.pathname,
                },
              }}
            />
          );
        }
      }

      /** Set the Page Title */
      if (state.isLoading && layout.pageTitleWhileLoading) {
        setPageTitle(layout.pageTitleWhileLoading);
      }
      else {
        setPageTitle(route.title);
      }

      /** Render loaders if they are hiding page */
      if (state.isLoading && layout.hidePageWhileLoading) {
        return loaderElement;
      }

      /** Set the HTML ClassNames on Root Element */
      if (useRouteClassName) {
        toggleHTMLNodeClassNames(layout.appendRouteClassNameTo!, {
          'has-auth'    : state.userHasAuth,
          'with-sidebar': layout.hasSidebar,
          'with-navbar' : layout.hasNavbar,
        });
      }

      /** Return the wrapped page */
      return (
        <React.Fragment>
          {initialLoaderElement}
          {loaderElement}
          <Component
            {...routeProps}
          />
        </React.Fragment>
      );
    },
    [
      Component,
      route,
      defaultPrivateRoute,
      defaultPublicRoute,
      getRouteByName,
      initialLoaderElement,
      isHybrid,
      isPrivate,
      isPublic,
      isValidRoute,
      layout.appendRouteClassNameTo,
      layout.hasNavbar,
      layout.hasSidebar,
      layout.hidePageWhileInitiallyLoading,
      layout.hidePageWhileLoading,
      layout.pageTitleWhileInitiallyLoading,
      layout.pageTitleWhileLoading,
      loaderElement,
      setPageTitle,
      state, useRouteClassName,
    ],
  );


  // ----
  // Return the Route
  // ----
  return (
    <Route
      path={route.path}
      exact={route.exact}
      sensitive={route.sensitive}
      strict={route.strict}
      render={renderRoute}
    />
  );
};

PageWrapper.displayName = 'PageWrapper';

export default PageWrapper;
