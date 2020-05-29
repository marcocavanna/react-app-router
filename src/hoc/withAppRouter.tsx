import * as React from 'react';
import invariant from 'tiny-invariant';

import { AppRouterConsumer } from '../context/app.router.context';

import type { AppRouterTools } from '../context/app.router.context.interfaces';


export interface WithAppRouterProps<K extends string = string> {
  appRouter: AppRouterTools<K>;
}


export type ComponentWithAppRouterProps<P extends {} = {}, K extends string = string> = React.ComponentType<P & WithAppRouterProps<K>>;


const withAppRouter = <P extends {} = {}, K extends string = string>(
  ChildComponent: React.ComponentType<P>
): ComponentWithAppRouterProps<P, K> => (childComponentProps: P) => (
  <AppRouterConsumer>
    {appRouterTools => {
      /** Assert Consumer is Valid */
      invariant(
        appRouterTools !== undefined,
        'withAppRouter HOC must be used while wrapping a Component used inside the AppRouter'
      );

      return (
        <ChildComponent {...childComponentProps} appRouter={appRouterTools} />
      );
    }}
  </AppRouterConsumer>
);


export default withAppRouter;
