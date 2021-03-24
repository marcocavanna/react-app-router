import * as React from 'react';
import invariant from 'tiny-invariant';

import {
  RouteComponentProps,
  generatePath,
  Redirect
} from 'react-router-dom';

import {
  useAppRouter
} from '../Router/AppRouter.context';

import SideComponent from './SideComponent';

import { AppRoute, StrictMandatoryRedirect } from '../interfaces';
import { toggleHTMLNodeClassNames } from '../helpers';


/* --------
 * Component Definition
 * -------- */
const PageWrapper: React.FunctionComponent<RouteComponentProps<any>> = (props) => {

  const {
    history,
    match,
    location
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
    getRouteByName,
    useRouteClassName,
    currentRoute
  } = useAppRouter();

  const {
    isPrivate,
    isPublic,
    component: Component
  } = currentRoute.route;

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
        <SideComponent isVisible={true} Component={InitialLoader} />
      );
    },
    [
      InitialLoader,
      state.isInitiallyLoading
    ]
  );

  const loaderElement = React.useMemo(
    () => {
      if (!Loader || !state.isLoading) {
        return null;
      }

      return (
        <SideComponent isVisible={true} Component={Loader} />
      );
    },
    [
      Loader,
      state.isLoading
    ]
  );


  /**
   * While App is Initially Loading, any mandatory redirect could not be performed.
   * In this case must render the Initial Loader if exists, or null.
   * This effect will be valid until hidePageWhileInitiallyLoading is equal to true
   */
  if (state.isInitiallyLoading) {
    /** Set page Title if Exists */
    if (layout.pageTitleWhileInitiallyLoading) {
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
  let mandatoryRedirect: StrictMandatoryRedirect<any, any> | null = null;

  /** Call the getNextRoute function first if exists */
  if (typeof isValidRoute === 'function') {
    const userDefinedMandatoryRedirect = isValidRoute(currentRoute.route, state);

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
          ...(userDefinedMandatoryRedirect as StrictMandatoryRedirect<any, any>),
          state: {
            redirectedBy: 'user'
          }
        };
      }
    }
  }

  /** If custom assertion doesn't exists, check the auth state and page visibility */
  if (!mandatoryRedirect) {
    let systemDefinedMandatoryRedirect: string | AppRoute<any, any> | null = null;

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
      ? getRouteByName(mandatoryRedirect.route)?.path
      : mandatoryRedirect.route.path;

    invariant(
      typeof routePath === 'string',
      `Route path has not been found for '${typeof mandatoryRedirect.route === 'string'
        ? mandatoryRedirect.route
        : mandatoryRedirect.route.name}'`
    );

    const nextPath = generatePath(routePath, mandatoryRedirect.params);

    return (
      <Redirect
        to={{
          pathname: nextPath,
          state   : {
            ...(mandatoryRedirect.state as object),
            redirectedFrom: location.pathname
          }
        }}
      />
    );
  }

  /** Set the Page Title */
  if (state.isLoading && layout.pageTitleWhileLoading) {
    setPageTitle(layout.pageTitleWhileLoading);
  }
  else {
    setPageTitle(currentRoute.route.title);
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
      'with-navbar' : layout.hasNavbar
    });
  }

  /** Return the wrapped page */
  return (
    <React.Suspense fallback={null}>
      {initialLoaderElement}
      {loaderElement}
      <Component
        history={history}
        location={location}
        match={match}
        appState={state}
        currentRoute={currentRoute}
      />
    </React.Suspense>
  );
};

PageWrapper.displayName = 'PageWrapper';

export default PageWrapper;
