import React from 'react';

import { RouteChildrenProps } from 'react-router-dom';

import { BaseRoutesDefinition } from './RoutesDefinition';
import { AppState } from './AppState';

import { CurrentRoute } from '../components/AppRouter';


/**
 * Each Page Component will be rendered passing
 * normal Route Children Props and extra AppRouter Props
 */
export interface PageComponentProps<RoutesDefinition extends BaseRoutesDefinition,
  Name extends keyof RoutesDefinition>
  extends RouteChildrenProps {
  /** The current AppState */
  appState: AppState;

  /** The current route */
  currentRoute: CurrentRoute<RoutesDefinition, Name>;
}

export type PageComponent<RoutesDefinition extends BaseRoutesDefinition,
  Name extends keyof RoutesDefinition> = React.ComponentType<PageComponentProps<RoutesDefinition, Name>>;
