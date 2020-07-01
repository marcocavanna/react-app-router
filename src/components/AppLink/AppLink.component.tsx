import * as React from 'react';
import invariant from 'tiny-invariant';

import { Link, NavLink, generatePath } from 'react-router-dom';

import type { AppLinkProps } from './AppLink.interfaces';
import { useRouting } from '../../hooks';
import AppRoute from '../../interfaces/AppRoute';


function AppLink<T extends string = string>(props: AppLinkProps<T>) {

  const {
    asNavLink,
    to,
    params,
    renderAnyway,
    ...rest
  } = props;

  const { getRoute, couldRouteTo } = useRouting();

  const [ nextRoute, setNextRoute ] = React.useState<{ route: AppRoute, pathname: string } | null>(null);

  React.useEffect(() => {
    /** Get the route from routes pool */
    const route = getRoute(to);

    /** Assert route exists */
    invariant(
      route !== undefined,
      `Invalid route named '${to}' has been provided to AppLink component`
    );

    /** Build the path using params */
    const pathname = generatePath(route.path, params);

    /** Set the route */
    setNextRoute({ route, pathname });
  }, [ to, params ]);

  /** If no route, return */
  if (!nextRoute) {
    return null;
  }

  /** Check if user could route to next route */
  if (!couldRouteTo(nextRoute.route) && !renderAnyway) {
    return null;
  }

  const ElementType = asNavLink ? NavLink : Link;

  /** Render the Link Component */
  return (
    <ElementType
      {...rest}
      to={nextRoute.pathname}
    />
  );
}

export default AppLink;
