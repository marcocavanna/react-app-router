import * as React from 'react';

import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';

import slugify from 'slugify';

import { isValidString } from 'utils';

import { RouteWatcherInternalProps, RouteWatcherProps } from './RouteWatcher.interfaces';
import withAppRouter from '../../hoc/withAppRouter';


/* --------
 * Component Definition
 * -------- */
class RouteWatcherBootstrap extends React.Component<RouteWatcherInternalProps> {

  /* --------
   * Default Component Props
   * -------- */
  static defaultProps = {
    fireEventOnMount   : true,
    hashClassNamePrefix: 'hash-'
  };


  /* --------
   * Internal Props
   * -------- */
  private appMountNode: HTMLElement = this.props.appMountNode ?? document.body;

  private _isMounted: boolean = false;


  /* --------
   * Handlers
   * -------- */
  private handleRouteChange(prevPathName: string, currPathName: string) {
    /** Get Props */
    const {
      onRouteChange,
      useRouteClassName,
      location,
      history,
      appRouter
    } = this.props;

    /** Check if must change the app mount node classes */
    if (this.appMountNode && useRouteClassName) {
      /** Split paths */
      const prevPathTree = (prevPathName && prevPathName.split('/')) || [];
      const currPathTree = (currPathName && currPathName.split('/')) || [];

      /** Remove previous classes */
      if (prevPathTree.length) {
        this.appMountNode.classList.remove(
          ...prevPathTree.filter(isValidString).map(path => slugify(path).toLowerCase().trim())
        );
      }

      /** Add current paths */
      if (currPathTree.length) {
        this.appMountNode.classList.add(
          ...currPathTree.filter(isValidString).map(path => slugify(path).toLowerCase().trim())
        );
      }
    }

    /**
     * Call the routeChange handler if exists.
     * Stop the callback if component isn't mounted.
     */
    if (typeof onRouteChange === 'function' && this._isMounted) {
      onRouteChange(appRouter.currentRoute, location, history);
    }
  }


  private handleHashChange(prevHash: string, currentHash: string, internal?: boolean) {
    /** Get Props */
    const {
      onHashChange,
      useRouteClassName,
      hashClassNamePrefix,
      location,
      history
    } = this.props;

    /** Check if must change the app mount node classes */
    if (this.appMountNode && useRouteClassName) {
      /** Remove the first hash if exists */
      if (prevHash) {
        this.appMountNode.classList.remove(`${hashClassNamePrefix}${slugify(prevHash)}`);
      }
      /** If next hash exists, set the new classname */
      if (currentHash) {
        this.appMountNode.classList.add(`${hashClassNamePrefix}${slugify(currentHash)}`);
      }
    }

    /**
     * Call the hashChange handler if exists
     * Stop the callback if component isn't mounted.
     */
    if (typeof onHashChange === 'function' && !internal && this._isMounted) {
      onHashChange(currentHash, location, history);
    }
  }


  /* --------
   * Component Lifecycle Methods
   * -------- */
  componentDidMount() {
    /** Set Mounted */
    this._isMounted = true;

    /** Get Current Location */
    const {
      location: { pathname, hash },
      fireEventOnMount
    } = this.props;

    /** Launch event on mount */
    if (fireEventOnMount) {
      this.handleRouteChange('', pathname);

      if (hash) {
        this.handleHashChange('', hash);
      }
    }
  }


  componentDidUpdate(prevProps: RouteWatcherInternalProps) {
    /** Get Current and Prev Location */
    const { location: { pathname, hash } } = this.props;
    const { location: { pathname: prevPathName, hash: prevHash } } = prevProps;

    /** Check if route has changed */
    if (prevPathName !== pathname) {
      this.handleRouteChange(prevPathName, pathname);
      this.handleHashChange(prevHash, hash, true);
      return;
    }

    /** Check if only hash has changed */
    if (prevHash !== hash) {
      this.handleHashChange(prevHash, hash);
    }
  }


  componentWillUnmount() {
    /** Set Unmounted */
    this._isMounted = false;
  }


  /* --------
   * Component Render
   * The Route Watcher is
   * -------- */
  render() {
    return null;
  }

}


/* --------
 * Export Composed Component
 * -------- */
const RouteWatcher = compose<RouteWatcherInternalProps, RouteWatcherProps>(
  withRouter,
  withAppRouter
)(RouteWatcherBootstrap);

RouteWatcher.displayName = 'RouteWatcher';

export default RouteWatcher;
