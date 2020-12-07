import { matchPath } from 'react-router-dom';

import { AppRoute, BaseRoutesDefinition, SideComponents } from '../../../interfaces';


/**
 * Return a fake placeholder route for NotFound result
 * @param Components
 */
export function getNotFoundPlaceholder<RoutesDefinition extends BaseRoutesDefinition>(
  Components?: SideComponents<RoutesDefinition>,
) {
  if (Components && Components.NotFound !== undefined) {
    return {
      name     : '__internal__router__not__found__',
      path     : '404',
      component: Components.NotFound,
    };
  }
  throw new Error(
    'No route has been found for current pathname and no component '
    + 'for not found route has been defined. Routing stopped.',
  );
}


/**
 * Return the Url using pathName
 *
 * @param routes
 * @param pathName
 * @param Components
 */
export function getRouteByPathName<RoutesDefinition extends BaseRoutesDefinition>(
  routes: AppRoute<RoutesDefinition>[],
  pathName: string,
  Components?: SideComponents<RoutesDefinition>,
): AppRoute<RoutesDefinition> {
  return (
    /** Return the first available route */
    routes.find(({ path, exact }) => (
      matchPath(pathName, { path, exact: !!exact })
    ))

    /** Or the NotFound Placeholder */
    || getNotFoundPlaceholder(Components)
  );
}


/**
 * Return a Route using its own name
 *
 * @param Components
 * @param routes The all routes array
 * @param name The route name to search
 */
export function getRouteByName<RoutesDefinition extends BaseRoutesDefinition>(
  routes: AppRoute<RoutesDefinition>[],
  name: string,
  Components?: SideComponents<RoutesDefinition>,
): AppRoute<RoutesDefinition> {
  return routes.find(({ name: routeName }) => name === routeName)
    || getNotFoundPlaceholder(Components);
}


/**
 * Return a Default defined route using its type
 *
 * @param Components
 * @param routes
 * @param type
 */
export function getDefaultDefinedRoute<RoutesDefinition extends BaseRoutesDefinition>(
  routes: AppRoute<RoutesDefinition>[],
  type: 'private' | 'public',
  Components?: SideComponents,
): AppRoute<RoutesDefinition> {
  return (
    /** Defined as Default */
    routes.find(({ isDefault, isPrivate, isPublic }) => (
      ((isPrivate && isPublic) || (!isPrivate && !isPublic)) && isDefault === type
    ))

    /** Default defined as Boolean */
    || routes.find(({ isPrivate, isPublic, isDefault }) => (
      ((type === 'private' && isPrivate) || (type === 'public' && isPublic)) && !!isDefault
    ))

    /** First of Type */
    || routes.find(({ isPrivate, isPublic }) => (
      (type === 'private' && isPrivate) || (type === 'public' && isPublic)
    ))

    /** Not found Placeholder */
    || getNotFoundPlaceholder(Components)
  );
}
