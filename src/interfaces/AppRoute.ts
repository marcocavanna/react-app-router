import React from 'react';

import type { RouteComponentProps } from 'react-router-dom';


export default interface AppRoute<T extends string = string, P extends {} = {}> {

  /** The page component to render */
  component: React.ComponentType<RouteComponentProps<P>>;

  /**
   * Set if this route must be reached
   * only if exact path has been typed by user
   * Default is `true`
   */
  exact?: boolean;

  /**
   * Set if the page has navbar visible.
   * Default is `true` for `private` page only.
   */
  hasNavbar?: boolean;

  /**
   * Set if the page has sidebar visible.
   * Default is `true` for `private` page only.
   */
  hasSidebar?: boolean;

  /**
   * Set if this page is the default
   * reached page on App Bootstrap.
   * Consider that could exist only
   * a default page for `private` and `public` routing.
   */
  isDefault?: boolean | 'private' | 'public';

  /**
   * Set if the page is private.
   * A private page could be viewed only with auth.
   * You could declare a page both private and
   * public: the result is a Hybrid page, visible
   * by user with and without auth
   * Default is `false`.
   */
  isPrivate?: boolean;

  /**
   * Set if the page is public.
   * A public page could be viewed without auth.
   * You could declare a page both private and
   * public: the result is a Hybrid page, visible
   * by user with and without auth
   * Default is `true`.
   */
  isPublic?: boolean;

  /** Page unique name, used to refer to it */
  name: T;

  /** The complete page path, including all params */
  path: string;

  /**
   * When true, will match if the path is case sensitive.
   */
  sensitive?: boolean;

  /**
   * When true, a path that has a trailing slash will
   * only match a location.pathname with a trailing slash.
   * This has no effect when there are additional
   * URL segments in the location.pathname
   */
  strict?: boolean;

  /**
   * Set the Page title,
   * appended to App title on HTML Page
   */
  title?: string;

}
