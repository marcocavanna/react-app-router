import { History, Location } from 'history';

/* --------
 * Main RouteWatcher Props
 * -------- */
export interface RouteWatcherProps {
  /**
   * Set manually the HTML Node where route classname are appended,
   * falling back to `<body>` element.
   *
   * This option will be considered only with `useRouteClassName`
   * to set the slugified classname of current route.
   *
   * Default to `document.body`
   */
  appendRouteClassNameTo?: HTMLElement;

  /** Fire the onRouteChange event on Component Mount */
  fireOnRouteChangeEventOnMount?: boolean;

  /**
   * Hash Class Prefix is a string prepended to current
   * hash while setting the route class name.
   * This option will be considered only with `useRouteClassName`
   * to set the slugified classname of current hash.
   *
   * ---
   *
   * Default to `hash-`
   */
  hashClassNamePrefix?: string;

  /** Handler callback invoked each time hash changed */
  onHashChange?(current: string, location: Location, history: History): void;

  /**
   * Handler callback invoked on route changed
   * When a route change event occurred the onHashChange event
   * will not be fired, even if hash has changed.
   * It will only be called internally to remove className if ´useRouteClassName´ is used.
   */
  onRouteChange?(current: string, location: Location, history: History): void;

  /** Set the current route slug class on app mount node element */
  useRouteClassName?: boolean;
}
