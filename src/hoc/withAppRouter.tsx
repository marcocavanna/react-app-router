import * as React from 'react';
import invariant from 'tiny-invariant';

import { AppRouterConsumer } from '../context/app.router.context';

import type { AppRouterTools } from '../context/app.router.context.interfaces';


export interface WithAppRouterProps {
  appRouter: AppRouterTools;
}


export type ComponentWithAppRouterProps<P extends {} = {}> = React.ComponentType<P & WithAppRouterProps>;


const withAppRouter = <P extends {}>(
  ChildComponent: React.ComponentType<P>
): ComponentWithAppRouterProps<P> => (childComponentProps: P) => (
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
