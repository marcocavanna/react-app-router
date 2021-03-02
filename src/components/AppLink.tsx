import * as React from 'react';
import { generatePath, Link, NavLink, NavLinkProps } from 'react-router-dom';
import * as qs from 'qs';

import { useAppRouter } from '../Router/AppRouter.context';

import type { AppRoute, BaseRoutesDefinition } from '../interfaces';


/* --------
 * Component Interfaces
 * -------- */
export interface AppLinkProps<RoutesDefinition extends BaseRoutesDefinition, Name extends keyof RoutesDefinition>
  extends Omit<NavLinkProps, 'to'> {
  /** Render the link as NavLink */
  asNavLink?: boolean;

  /** User defined Classes */
  className?: string;

  /** Route Params */
  params?: RoutesDefinition[Name];

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

  /** Add query string to url */
  query?: Record<string, string | number | boolean | (string | number | boolean)[]>

  /** Route name. Must be one of the defined route of AppRouter component */
  to: Name;

  /** Any Other Props */
  [other: string]: any;
}


type NextRoute<RoutesDefinition extends BaseRoutesDefinition, Name extends keyof RoutesDefinition> = {
  couldRoute: boolean;
  route: AppRoute<RoutesDefinition, Name>;
  path: string;
};


/* --------
 * Component Definition
 * -------- */
function AppLink<RoutesDefinition extends BaseRoutesDefinition, Name extends keyof RoutesDefinition>(
  props: React.PropsWithChildren<AppLinkProps<RoutesDefinition, Name>>,
): React.ReactElement<AppLinkProps<RoutesDefinition, Name>> | null {

  const {
    asNavLink,
    to,
    query,
    params,
    renderAnyway,
    ...rest
  } = props;

  const {
    getRouteByName,
    couldRouteTo,
  } = useAppRouter<RoutesDefinition, Name>();

  const queryString = React.useMemo(
    (): string => {
      if (!query) {
        return '';
      }

      return qs.stringify(query, {
        addQueryPrefix: true,
        arrayFormat   : 'brackets',
      });
    },
    [ query ],
  );

  const next = React.useMemo(
    (): NextRoute<RoutesDefinition, any> => {
      /** Get the route using name */
      const route = getRouteByName(to as string);

      return {
        route,
        couldRoute: couldRouteTo(route),
        path      : `${generatePath(route.path, params || {})}${queryString}`,
      };
    },
    [
      to,
      queryString,
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

export default AppLink;
