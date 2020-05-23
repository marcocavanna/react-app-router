import type { NavLinkProps } from 'react-router-dom';

import type { RouteParams } from '../../context/app.router.context.interfaces';


export interface AppLinkProps<T extends string = string> extends Omit<NavLinkProps
  , 'to'> {
  /** Render the link as NavLink */
  asNavLink?: boolean;

  /** Params to use to build the url */
  params?: RouteParams;

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
  to: T;
}
