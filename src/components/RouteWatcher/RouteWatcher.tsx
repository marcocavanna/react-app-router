import * as React from 'react';

import { useHistory, useLocation } from 'react-router-dom';

import slugify from 'slugify';

import {
  isValidString,
  toggleHTMLNodeClassNames,
  ClassNameToggler,
} from '../../utils';

import { useAppRouter } from '../AppRouter/AppRouter.context';

import { RouteWatcherProps } from './RouteWatcher.types';


/* --------
 * Component Declare
 * -------- */
type RouteWatcherComponent = React.FunctionComponent<RouteWatcherProps>;


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
const RouteWatcher: RouteWatcherComponent = (props) => {

  const {
    appendRouteClassNameTo,
    fireOnRouteChangeEventOnMount,
    hashClassNamePrefix,
    onRouteChange,
    onHashChange,
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
      hash    : currHash,
    }, setCurrentRoute,
  ] = React.useState<RouteWatcherState>({
    pathName: null,
    hash    : null,
  });

  /** Initialize an Internal State to Check if component is mounted */
  const [
    isMounted, setMounted,
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
        pathName,
      }));
    },
    [ setCurrentRoute, currPathName ],
  );

  const setCurrentHash = React.useCallback(
    (hash: string) => {
      if (hash === currHash) {
        return;
      }

      setCurrentRoute((curr) => ({
        ...curr,
        hash,
      }));
    },
    [ setCurrentRoute, currHash ],
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
    [],
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
      appRouter.useRouteClassName,
    ],
  );

  /** Hash Change */
  React.useEffect(
    () => {
      /** Check if must update hash class name */
      if (htmlClassNameNode && appRouter.useRouteClassName) {
        toggleHTMLNodeClassNames(htmlClassNameNode, {
          [`${hashClassNamePrefix}${slugify(currHash ?? '')}`]     : false,
          [`${hashClassNamePrefix}${slugify(location.hash ?? '')}`]: false,
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
      setCurrentHash,
    ],
  );

  // ----
  // Router Watcher Render nothing
  // ----
  return null;

};

RouteWatcher.defaultProps = {
  fireOnRouteChangeEventOnMount: true,
  hashClassNamePrefix          : 'hash-',
};

RouteWatcher.displayName = 'RouteWatcher';

export default RouteWatcher;
