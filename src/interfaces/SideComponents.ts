import * as React from 'react';

import { RouteComponentProps } from 'react-router-dom';

import { AppState } from './AppState';
import { AppRoute } from './AppRoute';
import { BaseRoutesDefinition } from './RoutesDefinition';


/* --------
 * Main Definition for Side Component
 * -------- */
export type SideComponent<RoutesDefinition extends BaseRoutesDefinition = BaseRoutesDefinition> =
  React.FunctionComponent<SideComponentProps<RoutesDefinition>>;

export interface SideComponentProps<RoutesDefinition extends BaseRoutesDefinition = BaseRoutesDefinition>
  extends RouteComponentProps {
  /** Current AppState */
  appState: AppState;

  /** The App Current Route */
  currentRoute: AppRoute<RoutesDefinition>;
}


/* --------
 * Side Components List
 * -------- */
export interface SideComponents<RoutesDefinition extends BaseRoutesDefinition = BaseRoutesDefinition> {
  /**
   * Set the content to be displayed
   * under the router.
   */
  Footer?: SideComponent<RoutesDefinition>;

  /**
   * Set the content to be displayed
   * above the router.
   */
  Header?: SideComponent<RoutesDefinition>;

  /**
   * The Initial Loader Component,
   * showed only when `isInitialLoading` state
   * has been set.
   */
  InitialLoader?: SideComponent<RoutesDefinition>;

  /**
   * The Loader Component,
   * showed when `isLoading` has been set
   */
  Loader?: SideComponent<RoutesDefinition>;

  /**
   * Set the Navbar component.
   * This one is visible only if `hasNavbar` prop
   * on AppRouter has been set to `true`
   */
  Navbar?: SideComponent<RoutesDefinition>;

  /**
   * Set a custom NotFound element
   * that will be displayed when not
   * page could be correctly reached
   */
  NotFound?: React.FunctionComponent;

  /**
   * Set the Sidebar component.
   * This one is visible only if `hasSidebar` prop
   * on AppRouter has been set to `true`
   */
  Sidebar?: SideComponent<RoutesDefinition>;
}
