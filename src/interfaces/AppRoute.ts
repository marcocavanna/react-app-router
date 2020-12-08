import { BaseRoutesDefinition } from './RoutesDefinition';
import { PageComponent } from './PageComponent';


/**
 * AppRoute is the main definition used to initialize
 * routing with AppRouter component.
 * Each route is described with some useful properties
 */
export interface AppRoute<RoutesDefinition extends BaseRoutesDefinition,
  Name extends keyof RoutesDefinition = keyof RoutesDefinition> {

  /** The page component to render */
  component: PageComponent<RoutesDefinition, any>;

  /**
   * Set if this route must be reached
   * only if exact path has been typed by user
   * Default is `true`
   */
  exact?: boolean;

  /**
   * Set if the AppRouter must show the footer component
   * on page where footer has been enabled.
   */
  hasFooter?: boolean;

  /**
   * Set if the AppRouter must show the header component
   * on page where header has been enabled.
   */
  hasHeader?: boolean;

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
  name: Name;

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

  /** Any other Key */
  [other: string]: any;
}
