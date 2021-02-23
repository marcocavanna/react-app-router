import * as React from 'react';

import { useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import { useAppRouterState, useCurrentRoute } from '../hooks';

import type { PageComponentProps } from '../interfaces';


/* --------
 * Component Interfaces
 * -------- */
interface SideComponentProps {
  /** The Component to Render */
  Component?: React.ComponentType<PageComponentProps<any, any>>;

  /** Check if component is visible or not */
  isVisible: boolean;
}


/* --------
 * Component Definition
 * -------- */
const SideComponent: React.FunctionComponent<SideComponentProps> = (props) => {

  /** Get props */
  const { Component, isVisible } = props;

  /** Get hooks data */
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const appState = useAppRouterState();
  const currentRoute = useCurrentRoute();

  /** Avoid component render while not visible */
  if (!Component || !isVisible) {
    return null;
  }

  /** Render the Component */
  return (
    <Component
      history={history}
      location={location}
      match={match}
      appState={appState}
      currentRoute={currentRoute}
    />
  );
};

SideComponent.displayName = 'SideComponent';

export default SideComponent;
