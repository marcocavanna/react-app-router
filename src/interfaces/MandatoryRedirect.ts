import { History } from 'history';

import { BaseRoutesDefinition } from './RoutesDefinition';


/**
 * A mandatory redirect could be a string or
 * an object containing the RouteName and it's params.
 * Passing a nil value will prevent the redirect
 */
export interface StrictMandatoryRedirect<RoutesDefinition extends BaseRoutesDefinition,
  RouteName extends keyof RoutesDefinition = any> {
  route: RouteName;

  params?: RoutesDefinition[RouteName];

  state?: History.LocationState;
}

export type MandatoryRedirect<RoutesDefinition extends BaseRoutesDefinition> =
  | string
  | StrictMandatoryRedirect<RoutesDefinition>
  | null
  | undefined;
