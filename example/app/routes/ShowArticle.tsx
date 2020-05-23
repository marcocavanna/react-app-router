import * as React from 'react';

import { AppLink, usePageTitle } from 'MyComponent';

import { useParams } from 'react-router-dom';


export default () => {

  const params = useParams<{ id: string }>();

  const [ , setPageTitle ] = usePageTitle();

  setPageTitle(`Reading Article ${params.id}`);

  return (
    <React.Fragment>
      <h1>{params.id} Article Titles</h1>
      <h3>Articles Subtitles</h3>
      <hr />
      <AppLink to={'Articles'}>
        <h3>Return to Articles List</h3>
      </AppLink>
    </React.Fragment>
  );

};
