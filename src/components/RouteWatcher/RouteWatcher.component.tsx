import * as React from 'react';

import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';

import slugify from 'slugify';

import isValidString from '../../utils/is-valid-string';

import withAppRouter from '../../hoc/withAppRouter';

import type { UnregisterCallback, Location } from 'history';

import type { RouteWatcherInternalProps, RouteWatcherProps } from './RouteWatcher.interfaces';


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
  private htmlClassNameNode: HTMLElement = this.props.appendRouteClassNameTo ?? document.body;

  private _isMounted: boolean = false;

  private locationUnlistener: UnregisterCallback | null = null;

  private currPathName: string = '';

  private currHash: string = '';


  /* --------
   * Handlers
   * -------- */
  private handleRouteChange(nextPathName: string) {
    /** Get the currPathName */
    const { currPathName } = this;

    /** Skip if equal */
    if (currPathName === nextPathName) {
      return;
    }

    /** Get Props */
    const {
      onRouteChange,
      useRouteClassName,
      location,
      history
    } = this.props;

    /** Check if must change the app mount node classes */
    if (this.htmlClassNameNode && useRouteClassName) {
      /** Split paths */
      const currPathTree = (currPathName && currPathName.split('/')) || [];
      const nextPathTree = (nextPathName && nextPathName.split('/')) || [];

      /** Remove previous classes */
      if (currPathTree.length) {
        this.htmlClassNameNode.classList.remove(
          ...currPathTree.filter(isValidString).map(path => slugify(path).toLowerCase().trim())
        );
      }

      /** Add current paths */
      if (nextPathTree.length) {
        this.htmlClassNameNode.classList.add(
          ...nextPathTree.filter(isValidString).map(path => slugify(path).toLowerCase().trim())
        );
      }
    }

    this.currPathName = nextPathName;

    /**
     * Call the routeChange handler if exists.
     * Stop the callback if component isn't mounted.
     */
    if (typeof onRouteChange === 'function' && this._isMounted) {
      onRouteChange(nextPathName, location, history);
    }
  }


  private handleHashChange(nextPathName: string, nextHash: string) {
    /** Get current hash */
    const { currHash } = this;

    if (currHash === nextHash || nextPathName !== this.currPathName) {
      return;
    }

    /** Get Props */
    const {
      onHashChange,
      useRouteClassName,
      hashClassNamePrefix,
      location,
      history
    } = this.props;

    /** Check if must change the app mount node classes */
    if (this.htmlClassNameNode && useRouteClassName) {
      /** Remove the first hash if exists */
      if (currHash) {
        this.htmlClassNameNode.classList.remove(`${hashClassNamePrefix}${slugify(currHash)}`);
      }
      /** If next hash exists, set the new classname */
      if (nextHash) {
        this.htmlClassNameNode.classList.add(`${hashClassNamePrefix}${slugify(nextHash)}`);
      }
    }

    /** Set the current hash */
    this.currHash = nextHash;

    /**
     * Call the hashChange handler if exists
     * Stop the callback if component isn't mounted.
     */
    if (typeof onHashChange === 'function' && this._isMounted) {
      onHashChange(nextHash, location, history);
    }
  }


  handleLocationChange = (location: Location) => {
    this.handleHashChange(location.pathname, location.hash);
    this.handleRouteChange(location.pathname);
  };


  /* --------
   * Component Lifecycle Methods
   * -------- */
  componentDidMount() {
    /** Set Mounted */
    this._isMounted = true;

    /** Get current location */
    const {
      location,
      history,
      fireEventOnMount
    } = this.props;

    /** Start a listener */
    this.locationUnlistener = history.listen(this.handleLocationChange);

    /** Check if must fire the event on component mount */
    if (fireEventOnMount) {
      this.handleLocationChange(location);
    }
  }


  componentWillUnmount() {
    /** Set unmounted */
    this._isMounted = false;
    /** Remove Listener */
    if (this.locationUnlistener) {
      this.locationUnlistener();
    }
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
