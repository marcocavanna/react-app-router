import * as React from 'react';

import { generatePath, Link, NavLink, NavLinkProps } from 'react-router-dom';

import { AppRoute, BaseRoutesDefinition } from '../../interfaces';
import { useAppRouter } from '../AppRouter';


/* --------
 * Component Interfaces
 * -------- */
export interface AppLinkProps<RoutesDefinition extends BaseRoutesDefinition, Route extends keyof RoutesDefinition>
  extends Omit<NavLinkProps, 'to'> {
  /** Render the link as NavLink */
  asNavLink?: boolean;

  /** User defined Classes */
  className?: string;

  /** Route Params */
  params?: RoutesDefinition[Route];

  /**
   * By default, a AppLink will be rendered
   * only if current user could reach the
   * requested route.
   * If a user has no auth, a link to a private
   * route will not be rendered.
   *
   * Set this props to `true` if link must be
   * rendered anyway
   */
  renderAnyway?: boolean;

  /** Route name. Must be one of the defined route of AppRouter component */
  to: Route;

  /** Any Other Props */
  [other: string]: any;
}


type NextRoute<RoutesDefinition extends BaseRoutesDefinition> = {
  couldRoute: boolean;
  route: AppRoute<RoutesDefinition>;
  path: string;
};


/* --------
 * Component Definition
 * -------- */
function AppLink<RoutesDefinition extends BaseRoutesDefinition, RouteName extends keyof RoutesDefinition>(
  props: React.PropsWithChildren<AppLinkProps<RoutesDefinition, RouteName>>,
) {

  const {
    asNavLink,
    to,
    params,
    renderAnyway,
    ...rest
  } = props;

  const {
    getRouteByName,
    couldRouteTo,
  } = useAppRouter<RoutesDefinition, RouteName>();

  const next = React.useMemo(
    (): NextRoute<RoutesDefinition> => {
      /** Get the route using name */
      const route = getRouteByName(to as string);

      return {
        route,
        couldRoute: couldRouteTo(route),
        path      : generatePath(route.path, params),
      };
    },
    [
      to,
      getRouteByName,
      couldRouteTo,
      params,
    ],
  );

  /** Check if component could be rendered */
  if (!next.couldRoute && !renderAnyway) {
    return null;
  }

  const ElementType = asNavLink ? NavLink : Link;

  return (
    <ElementType
      {...rest}
      to={next.path}
    />
  );

}

AppLink.displayName = 'AppLink';

export { AppLink };
