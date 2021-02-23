import * as React from 'react';


const NotFoundPage: React.FunctionComponent = () => (
  <h3>Page not Found</h3>
);

NotFoundPage.displayName = 'NotFoundPage';


const MemoizedNotFoundPage = React.memo(NotFoundPage);

MemoizedNotFoundPage.displayName = 'MemoizedNotFoundPage';


export default MemoizedNotFoundPage;
