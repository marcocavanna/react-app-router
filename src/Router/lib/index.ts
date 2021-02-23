import { matchPath } from 'react-router-dom';

import type { AppRoute, BaseRoutesDefinition, PageComponent } from '../../interfaces';


export function getRoutesMap<RoutesDefinition extends BaseRoutesDefinition>(
  routes: AppRoute<RoutesDefinition, any>[],
  map?: Map<string, AppRoute<RoutesDefinition, any>>,
  parent?: AppRoute<RoutesDefinition, any>,
) {
  /** Build the set pointer */
  const pointer = map ?? new Map<string, AppRoute<RoutesDefinition, any>>();

  /** Loop each route to add to Route Map */
  routes.forEach((route) => {
    /** Add route to map */
    if (!pointer.has(route.name)) {
      pointer.set(route.name, {
        ...parent,
        ...route,
        parent,
        path: parent ? `${parent.path}${route.path}` : route.path,
      });
    }
    /** Add sub routes */
    if (Array.isArray(route.routes)) {
      getRoutesMap(route.routes, pointer, route);
    }
  });

  /** Return the Pointer */
  return pointer;
}


/**
 * Return a fake placeholder route for NotFound result
 * @param Component
 */
export function getNotFoundPlaceholder<RoutesDefinition extends BaseRoutesDefinition>(
  Component?: PageComponent<RoutesDefinition, keyof RoutesDefinition>,
): AppRoute<any, any> {
  /** If no component exists, throw an error */
  if (!Component) {
    throw new Error(
      'No route has been found for current pathname and no component '
      + 'for not found route has been defined. Routing stopped.',
    );
  }

  /** Return an internal route definition */
  return {
    name     : '__internal__router__not__found__',
    path     : '404',
    component: Component,
  };
}


/**
 * Return the Url using pathName
 *
 * @param routes
 * @param pathName
 * @param NotFoundComponent
 */
export function getRouteByPathName<RoutesDefinition extends BaseRoutesDefinition, Next extends keyof RoutesDefinition>(
  routes: Map<string, AppRoute<RoutesDefinition, any>>,
  pathName: string,
  NotFoundComponent?: PageComponent<RoutesDefinition, keyof RoutesDefinition>,
): AppRoute<RoutesDefinition, Next> {
  /** Get the Entries */
  let found: AppRoute<RoutesDefinition, Next> | undefined;

  routes.forEach((route) => {
    if (matchPath(pathName, { path: route.path, exact: !!route.exact })) {
      found = route;
    }
  });

  return found || getNotFoundPlaceholder(NotFoundComponent);
}


/**
 * Return a Route using its own name
 *
 * @param routes The all routes array
 * @param name The route name to search
 * @param NotFoundComponent
 */
export function getRouteByName<RoutesDefinition extends BaseRoutesDefinition, Next extends keyof RoutesDefinition>(
  routes: Map<string, AppRoute<RoutesDefinition, any>>,
  name: Next,
  NotFoundComponent?: PageComponent<RoutesDefinition, keyof RoutesDefinition>,
): AppRoute<RoutesDefinition, Next> {
  return (
    /** Return the first available route */
    routes.get(name as string)

    /** Or the not found placeholder */
    || getNotFoundPlaceholder(NotFoundComponent)
  );
}


/**
 * Return a Default defined route using its type
 *
 * @param routes
 * @param type
 * @param NotFoundComponent
 */
const defaultRouteCache = {
  private: new WeakMap<Map<string, AppRoute<any, any>>, AppRoute<any, any>>(),
  public : new WeakMap<Map<string, AppRoute<any, any>>, AppRoute<any, any>>(),
};

export function getDefaultDefinedRoute<RoutesDefinition extends BaseRoutesDefinition, Name extends keyof RoutesDefinition>(
  routes: Map<string, AppRoute<RoutesDefinition, any>>,
  type: 'private' | 'public',
  NotFoundComponent?: PageComponent<RoutesDefinition, keyof RoutesDefinition>,
): AppRoute<RoutesDefinition, Name> {

  const cached = defaultRouteCache[type].get(routes);

  if (cached) {
    return cached;
  }

  let definedDefaultRoute: AppRoute<RoutesDefinition, Name> | undefined;
  let definedBooleanRoute: AppRoute<RoutesDefinition, Name> | undefined;
  let firstOfTypeRoute: AppRoute<RoutesDefinition, Name> | undefined;

  routes.forEach(({ isDefault, isPrivate, isPublic }, key) => {
    if (!definedDefaultRoute && ((isPrivate && isPublic) || (!isPrivate && !isPublic)) && isDefault === type) {
      definedDefaultRoute = routes.get(key);
    }

    if (!definedBooleanRoute && ((type === 'private' && isPrivate) || (type === 'public' && isPublic)) && !!isDefault) {
      definedBooleanRoute = routes.get(key);
    }

    if (!firstOfTypeRoute && ((type === 'private' && isPrivate) || (type === 'public' && isPublic))) {
      firstOfTypeRoute = routes.get(key);
    }
  });

  const route = definedDefaultRoute
    || definedBooleanRoute
    || firstOfTypeRoute
    || getNotFoundPlaceholder(NotFoundComponent);

  defaultRouteCache[type].set(routes, route);

  return definedDefaultRoute || definedBooleanRoute || firstOfTypeRoute || getNotFoundPlaceholder(NotFoundComponent);

}
