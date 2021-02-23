import * as React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import slugify from 'slugify';

import type { History, Location } from 'history';

import { useAppRouter } from '../Router/AppRouter.context';
import { isValidString, toggleHTMLNodeClassNames } from '../helpers';

import type { ClassNameToggler } from '../helpers';


/* --------
 * Component Interfaces
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


/* --------
 * Component State
 * -------- */
type RouteWatcherState = {
  pathName: string | null,
  hash: string | null
};


/* --------
 * Component Definition
 * -------- */
const RouteWatcher: React.FunctionComponent<RouteWatcherProps> = (props) => {

  const {
    appendRouteClassNameTo,
    fireOnRouteChangeEventOnMount,
    hashClassNamePrefix,
    onRouteChange,
    onHashChange
  } = props;


  // ----
  // Hooks
  // ----
  const history = useHistory();
  const location = useLocation();
  const appRouter = useAppRouter();


  // ----
  // Internal State and Props Definition
  // ----
  const [
    {
      pathName: currPathName,
      hash    : currHash
    }, setCurrentRoute
  ] = React.useState<RouteWatcherState>({
    pathName: null,
    hash    : null
  });

  /** Initialize an Internal State to Check if component is mounted */
  const [
    isMounted, setMounted
  ] = React.useState<boolean>(true);

  /** Save the Element to Append Class Name */
  const htmlClassNameNode = appendRouteClassNameTo ?? document.body;


  // ----
  // Internal Functions
  // ----
  const setCurrentPathName = React.useCallback(
    (pathName: string) => {
      if (currPathName === pathName) {
        return;
      }

      setCurrentRoute((curr) => ({
        ...curr,
        pathName
      }));
    },
    [ setCurrentRoute, currPathName ]
  );

  const setCurrentHash = React.useCallback(
    (hash: string) => {
      if (hash === currHash) {
        return;
      }

      setCurrentRoute((curr) => ({
        ...curr,
        hash
      }));
    },
    [ setCurrentRoute, currHash ]
  );


  // ----
  // Handle Route and Hash change
  // ----
  React.useEffect(
    () => {
      return () => {
        setMounted(false);
      };
    },
    []
  );

  /** PathName Change */
  React.useEffect(
    () => {
      /** Check if must change node classes */
      if (htmlClassNameNode && appRouter.useRouteClassName) {
        /** Split paths */
        const currPathTree = (currPathName && currPathName.split('/')) || [];
        const nextPathTree = (location.pathname && location.pathname.split('/')) || [];

        const toggler: ClassNameToggler = {};

        currPathTree.filter(isValidString).forEach((className) => {
          toggler[slugify(className)] = false;
        });

        nextPathTree.filter(isValidString).forEach((className) => {
          toggler[slugify(className)] = true;
        });

        toggleHTMLNodeClassNames(htmlClassNameNode, toggler);
      }

      if (typeof onRouteChange === 'function' && isMounted && location.pathname !== currPathName) {
        if (currPathName !== null || fireOnRouteChangeEventOnMount) {
          onRouteChange(location.pathname, location, history);
        }
      }

      /** Set current pathname */
      setCurrentPathName(location.pathname);
    },
    [
      currPathName,
      fireOnRouteChangeEventOnMount,
      history,
      htmlClassNameNode,
      isMounted,
      location,
      onRouteChange,
      setCurrentPathName,
      appRouter.useRouteClassName
    ]
  );

  /** Hash Change */
  React.useEffect(
    () => {
      /** Check if must update hash class name */
      if (htmlClassNameNode && appRouter.useRouteClassName) {
        toggleHTMLNodeClassNames(htmlClassNameNode, {
          [`${hashClassNamePrefix}${slugify(currHash ?? '')}`]     : false,
          [`${hashClassNamePrefix}${slugify(location.hash ?? '')}`]: false
        });
      }

      if (typeof onHashChange === 'function' && isMounted && currHash !== null && currHash !== location.hash) {
        onHashChange(location.hash, location, history);
      }

      /** Set current hash */
      setCurrentHash(location.hash);
    },
    [
      appRouter.useRouteClassName,
      currHash,
      hashClassNamePrefix,
      history,
      htmlClassNameNode,
      isMounted,
      location,
      onHashChange,
      setCurrentHash
    ]
  );

  // ----
  // Router Watcher Render nothing
  // ----
  return null;

};

RouteWatcher.defaultProps = {
  fireOnRouteChangeEventOnMount: true,
  hashClassNamePrefix          : 'hash-'
};

RouteWatcher.displayName = 'RouteWatcher';

export default RouteWatcher;
