[![Contributors][contributors-shield]][contributors-url]
[![License][license-shield]](#)
[![Size][size-shield]](#)
[![Download][download-shield]](#)

<br />
<p align="center">
  <h2 align="center">React AppRouter</h2>

  <p align="center">
    React RouterDOM Wrapped
    <br />
    <a href="https://github.com/marcocavanna/react-app-router"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/marcocavanna/react-app-router/tree/master/example">View Demo</a>
    ·
    <a href="https://github.com/marcocavanna/react-app-router/issues">Report Bug</a>
    ·
    <a href="https://github.com/marcocavanna/react-app-router/issues">Request Feature</a>
  </p>
</p>

The React AppRouter module is a series of components built on top of [react-router-dom] library.

I've written this library to easy manage routing for auth based app, enforcing route by checking the user auth state and easily manage loading state while performing actions (like loading the client, the initial user data before app start, and so on).

This library could also easily manage sidebar/navbar presence on each route, defining a global Sidebar/Navbar elements on AppRoute.

Components are written purely in TypeScript trying to be strongly typed: refer to [TypeScript Usage](#typescript-usage)


## Core Concept
React [AppRouter](#approuter-) is based on an array of [`AppRoute`](#approute) object elements, injected by the `routes` props that is mandatory. Each route must contain:

- a unique `name` string key
- the `path` string (same as `<Route />` element in react-router-dom, except as an array of string, because it is not supported yet)
- the `component` key, that is the page component used to render the page

Using the [`AppRoute`](#approute) array, the AppRouter component will create each single `<Route />` and some other useful utilities.

The strength of this module is that in you page you could refer to route using its name, and not its path.

For example, if you ar writing a blog, you'll have a single article page. On traditional system you'll refer to this page using:
```javascript
/**
 * Suppose you have declared somewhere into your app the BrowserRouter
 * end each single routes. One of this route points to a SingleArticle
 * component and is composed by some params
 */
<Route component={SingleArticle} path={'/blog/articles/:category/:slug'} />

/** Refer to this path in you app will be a little verbose */
// eg. looping articles array to build link
{articles.map(({ category, slug, title }) => (
  <Link to={`/blog/articles/${category}/${slug}`}>{title}</Link>
))}

// or, in a component function you could use react-router-dom hooks
const history = useHistory();
history.push(`/blog/articles/${category}/${slug}`);


/**
 * With AppRouter module you could declare your routing using an array
 * of Route, with a unique name, and you could refer to that name
 * to push new location
 */

// eg. looping articles array to build link
{articles.map(({ category, slug, title }) => (
  <AppLink to={'Article'} params={{ category, slug }}>{title}</AppLink>
))}

// or in a component function you could use 'app-router' hooks
const { routeTo } = useRouting();
routeTo('Article', { slug, category });
```


## Getting Started

### Installing
You can install React AppRouter using Yarn:

```
yarn add @appbuckets/app-router
```

or using npm

```
npm install --save @appbuckets/app-router
```


### Base Examples
```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import { useParams } from 'react-router-dom';

import { AppRouter, AppLink, usePageTitle } from '@appbuckets/app-router';

// Define the Home Page Component
const Home = () => (
  <React.Fragment>
    <h1>Welcome to Home Page</h1>
    <h3>This page is visible only to User without Auth</h3>
    <hr />
    <AppLink to={'Articles'}>
      <h3>Read Some Articles</h3>
    </AppLink>
  </React.Fragment>
);

// Define the Article Page Component
const Articles = () => (
  <React.Fragment>
    <h1>Choose an Article to Read</h1>
    <h3>This is an Hybrid page, visible to both authorized and unauthorized Users</h3>
    <hr />
    <div>
      <h4>Here are some Articles to Read</h4>
      {[ 1, 2, 3 ].map(id => (
        <AppLink key={id} to={'ShowArticle'} params={{ id }}>
          <h5>Go to Article number {id}</h5>
        </AppLink>
      ))}
    </div>
    <hr />
    <AppLink to={'Home'}>
      <h3>Return to Home Page</h3>
    </AppLink>
    <AppLink to={'UserProfile'}>
      <h3>Go to your personal Profile Page, link visible to Authenticate User Only</h3>
    </AppLink>
  </React.Fragment>
);

// Define a Page to View a Single Article
const ShowArticle = () => {
  // You could use same react-router-dom hooks
  const { id } = useParams();
  // You could use extra hooks defined in app-router
  const [ currentPageTitle , setPageTitle ] = usePageTitle();
  // For example to set the page title
  setPageTitle(`Reading Article ${id}`);

  return (
    <React.Fragment>
      <h1>{id} Article Titles</h1>
      <h3>Articles Subtitles</h3>
      <hr />
      <AppLink to={'Articles'}>
        <h3>Return to Articles List</h3>
      </AppLink>
    </React.Fragment>
  );
};

// Define the Personal Profile Page
const Profile = () => (
  <React.Fragment>
    <h1>Your Profile</h1>
    <h3>This page is visible only to authenticated User</h3>
    <hr />
    <AppLink to={'Articles'}>
      <h3>Return to Articles List</h3>
    </AppLink>
  </React.Fragment>
);

// Define Routes
const routes = [
  {
    name     : 'Home',
    path     : '/',
    component: Home,
    title    : 'Home',
    isPublic : true
  },
  {
    name     : 'Articles',
    path     : '/articles',
    component: Articles,
    title    : 'Articles List',
    isPrivate: true,
    isPublic : true,
    isDefault: 'private' as 'private'
  },
  {
    name     : 'ShowArticle',
    path     : '/articles/:id',
    component: ShowArticle,
    title    : 'Single Articles',
    isPrivate: true,
    isPublic : true
  },
  {
    name     : 'UserProfile',
    path     : '/profile',
    component: Profile,
    title    : 'Profile Settings',
    isPrivate: true
  }
];

// Create the App
const App = () => {

  const [ hasAuth, setHasAuth ] = React.useState(false);

  const handleToggleAuth = () => {
    setHasAuth(!hasAuth);
  };

  return (
    <AppRouter
      defaultAppName={'Routing Example'}
      userHasAuth={hasAuth}
      routes={routes}
      components={{
        Footer: () => (
          <React.Fragment>
            <hr />
            <p>I am a Static Footer Component, showed on Each Page</p>
            <button onClick={handleToggleAuth}>
              {hasAuth ? 'Remove User Authorization' : 'Authorize User'}
            </button>
          </React.Fragment>
        )
      }}
    />
  );
};

// Render
ReactDOM.render(
  <App />,
  document.getElementById('root-app')
);
```

<br />

---

## Usage
### Components
React AppRouter consists in 1 core components (the [`<AppRouter />`](#approuter-)), and some side useful components (like [`<AppLink />`](#applink-)).

#### `<AppRouter />`
The __AppRouter__ is the mandatory component to let the React AppRouter module work. It wraps, under the hooke the original [`<BrowserRouter />`](https://reacttraining.com/react-router/web/api/BrowserRouter) component from [react-router-dom].

Complete `props` description are defined in [`AppRouterProps`](#approuterprops) interface.

Some principal AppRouter props are:
##### `routes` : [`AppRoute[]`](#approute)
> Define each single route. Check the AppRoute interface to get documentation on each prop to build your routing system.

##### `defaultAppName?` : `string`
> Page title will be defined every time user route to a new page.
>
> Each route has is own title, but if you want you can provide a default AppTitle that will be prepended to single page title.

##### `isInitiallyLoading?` : `boolean`
> App State could be set to isInitiallyLoading to prevent page render while the App is starting.
>
> This is intended to show for example a full page loader on App Initialization.

##### `isLoading?` : `boolean`
> App State could be set to isLoading any time, to show a loader component while performing some long/system functions.
> 
> This is intended to show for example a different loader while performing Login/Logout Operation.

##### `userHasAuth?` : `boolean`
> Tell the AppRouter if current user has authorization to show a private page.
>
> Changing `userHasAuth` on private/public only page will automatically perform a mandatory redirect to default private/public page based on user auth.

---

#### `<AppLink />`
__AppLink__ component is a wrapper for [Link](https://reacttraining.com/react-router/web/api/Link) or [NavLink](https://reacttraining.com/react-router/web/api/NavLink) elements of [react-router-dom] library.

Additionally, the Link elements will be rendered only if current user could reach that route, based on [`userHasAuth`](#userhasauth--boolean) state of parent AppRouter.

AppLink extends all props defined in Link or NavLink element, except for the `to` props that must refer to valid AppRoute.

Refer to [`AppLinkProps`](#applinkprops) interface.

<br />

---

### Hooks
Hooks are used to manage routing, or get route state on function components.

#### `useAppState()` : [`AppState`](#appstate)
> Get current app state

#### `useLayout()` : [`AppRouterLayout`](#approuterlayout)
> Get the layout state for current route. This hook is used internally by PageWrapper, but exposed anyway for further usage.

#### `useAppName()` : `[string, changeName: ((newName?: string) => void), restoreDefault: () => void]`
> Return a set of three elements:
>   - The current name of the App
>   - A function to set a new name
>   - A function to restore the name declared in [`defaultAppName`](#defaultappname--string) props of <AppRouter /> component

#### `useCurrentRoute()` : [`CurrentRoute`](#currentroute)
> Returns an object that describe the current routes, composed by:
>   - `route` : [`AppRoute`](#approute) The current route object
>   - `params` : `{}` Current params of route
>   - `search` : `URLSearchParams` Search query string converted to [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

#### `useRouting()` : `UseRoutingTools`
> Returns an object that contains useful route methods and properties:
>   - `routeTo` : `(route: string | AppRoute, params?: {}, state?: LocationState) => void` Route to a path
>   - `couldRouteTo` : `(route: string | AppRoute) => boolean` Check if a routing to `route` could be performed based on `userHasAuth`
>   - `getRoute` : `(name: string) => AppRoute | undefined` Get a Route Object by name
>   - `routeToDefaultPrivate` : `(params?: {}, state?: LocationState) => void` Route to the default private route
>   - `routeToDefaultPublic` : `(params?: {}, state?: LocationState) => void` Route to the default public route
>   - `defaultPrivateRoute` : [`AppRoute`](#approute) The default private route object
>   - `defaultPublicRoute` : [`AppRoute`](#approute) The default public route object

#### `usePageTitle()` : `[string, changeTitle: ((newTitle?: string) => void)]`
> Return a set of two elements:
>   - The current page title
>   - A function to set a new page title

<br />

---

### HOC
An only High Order Component is provided

#### `withAppRouter`
Wrapping a component with this HOC will produce a new component with `appRouter` props. Refer to [`AppRouterTools`](#approutertools) to check how its composed.

<br />

---

### Interfaces
Interface describe below use the TypeScript syntax. A `props` or an `option` marked by `?` char is considered as optional.


#### `AppRouterProps`
##### `appendRouteClassNameTo?` : `HTMLElement`
> Set manually the HTML Node where route classname are appended, falling back to `<body>` element.
>
> When a location changed event, current route will be splitted into route tree and appended as className
> to the element defined into `appendRouteClassNameTo`. For example, if your current route is '/blog/article/tech',
> 'blog', 'article' and 'tech' string will be used as className.
>
> This option will be considered only with `useRouteClassName`
>
> ClassName will be transformed using `slugify` module
>
> Additionally, also the current hash will be used as className

##### `browserRouterProps?` : [`BrowserRouterProps`](https://reacttraining.com/react-router/web/api/BrowserRouter)
> Props passed to the wrapped `<BrowserRouter />` component.

##### `components?` : [`SideRouteComponents`](#sideroutecomponents)
> A set of component rendered outside the wrapped page, like Sidebar, Navbar, Loader, ecc..
>
> Refer to linked interface to get each props.

##### `defaultAppName?` : `string`
> Set the current AppName. This text will be used to create the App Title on each Page.

##### `fireOnRouteChangeEventOnMount?` : `boolean`
> Choose if must fire the `onRouteChange` event handler on AppRouter mount.
>
> By default, this props is `true`

##### `hashClassNamePrefix?` : `string`
> This string will pe prepended to current hash while setting the hash className.
>
> This option will be considered only with `useRouteClassName`
>
> By default, this props is `hash-`

##### `hidePageWhileInitiallyLoading?` : `boolean`
> Set if the Page Component must be hide while app state has `isInitiallyLoading` equal to true
> 
> By default, this props is `true`

##### `hidePageWhileLoading?` : `boolean`
> Set if the Page Component must be hide while app state has `isLoading` equal to true
> 
> By default, this props is `false`

##### `isInitiallyLoading?` : `boolean`
> App State could be set to isInitiallyLoading to prevent page render while the App is starting.
>
> This is intended to show for example a full page loader on App Initialization.

##### `isLoading?` : `boolean`
> App State could be set to isLoading any time, to show a loader component while performing some long/system functions.
> 
> This is intended to show for example a different loader while performing Login/Logout Operation.

##### `innerClassNames?` : `{ pageClassNames?: ClassValue | ClassValue[], viewClassNames?: ClassValue | ClassValue[] }`
> Page Component will be wrapped by an outer <div class='view-content'>,
> that contain all route elements (sidebar, header ...), and an inner <div class='page-content'> that wrap your page.
>
> If you want you can add any class to wrappers. Additional ClassName are merged together using `clsx` library.
> Refer to [clsx] documentation to know what `ClassValue` is.

##### `getNextRoute?` : `(props: AppRoute, appState: AppState, routeProps: RouteComponentProps) => string | null | MandatoryRedirect`
> This function will be called after a location event occurred, but before the page rendering function.
>
> Use this function if you want to mandatory redirect a user to another page. You could return a string to refer directly
> to a defined route, or an object (described on [`MandatoryRedirect`](#mandatoryredirect)), with route, params and state.

##### `hasNavbar?` : `boolean`
> Set if AppRouter must render the `Navbar` component on page where Navbar has been enabled

##### `hasSidebar?` : `boolean`
> Set if AppRouter must render the `Sidebar` component on page where Sidebar has been enabled

##### `onHashChange?` : `(current: string, location: Location, history: History) => void`
> A handler callback invoked each time hash changed.

##### `onRouteChange?` : `(current: AppRoute, location: Location, history: History) => void`
> A handler callback invoked each time location changed.

##### `routes` : [`AppRoute[]`](#approute)
> Define each single route. Check the AppRoute interface to get documentation on each prop to build your routing system.

##### `pageTitleWhileInitiallyLoading?` : `string`
> Set the Page Title used while app is in Initially Loading State

##### `pageTitleWhileLoading?` : `string`
> Set the Page Title used while app is in Loading State

##### `pageTitleSeparator?` : `string`
> Set the Page Title separator.
> 
> When the title inside <head> will change, computing function will use the current appName string,
> and the current page title string: set this props to choose how the two names will be joined together.

##### `userHasAuth?` : `boolean`
> Tell the AppRouter if current user has authorization to show a private page.
>
> Changing `userHasAuth` on private/public only page will automatically perform a mandatory redirect to default private/public page based on user auth.

##### `useRouteClassName?` : `boolean`
> Tell the AppRouter must append current route className to HTMLElement defined in `appendRouteClassNameTo`

---

#### `AppRoute`
AppRoute interface is used to describe each single Route.

##### `component` : `React.ComponentType<RouteComponentProps>`
> Is the component used to render the page at current route

##### `exact?` : `boolean`
> Set if this route must be reached only if exact path has been typed by user.
>
> By default, value is `true`

##### `hasNavbar?` : `boolean`
> Set the page has the Navbar component visible
>
> By default, value is `true` if route has `isPrivate` set to true

##### `hasSidebar?` : `boolean`
> Set the page has the Sidebar component visible
>
> By default, value is `true` if route has `isPrivate` set to true

##### `isDefault?` : `boolean | 'private' | 'public'`
> When the App start, or when `userHasAuth` prop changed, if current page
> could not be reached by user, routing will fallback to default page
> based on current `userHasAuth` prop.
>
> For a hybrid page (when a page is both public and private) you could
> manually set if current route is default for private or public routing

##### `isPrivate?` : `boolean`
> Set if the page is Private.
> A Private page could be reached only when `userHasAuth` is true.
> You could declare a page both private and public:
> the result is a Hybrid page, visible by user with and without auth
>
> Default is `false`

##### `isPublic?` : `boolean`
> Set if the page is Public.
> A Public page could be reached only when `userHasAuth` is false.
> You could declare a page both private and public:
> the result is a Hybrid page, visible by user with and without auth
>
> Default is `false`

##### `name` : `string`
> The unique page name

##### `path` : `string`
> The page path
>
> Alert: `react-router-dom` will accept also an array of string. At the moment this is not accepted by AppRouter.

##### `sensitive?` : `boolean`
> When true, will match if the path is case sensitive.

##### `strict?` : `boolean`
> When true, a path that has a trailing slash will only match a location.pathname with a trailing slash.
> This has no effect when there are additional URL segments in the location.pathname.

##### `title?` : `string`
> The page title, appended to current AppName

---

#### `CurrentRoute`
##### `route` : [`Readonly<AppRoute>`](#approute)
> The current Route object

##### `params` : `{ [key: string]: string | number | boolean | undefined }`
> Params used to reach current rout

##### `search` : [`URLSearchParams`](#https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
> Converted search query string to URLSearchParams object

---

#### `AppState`
The current state of App, represented by

- `isInitiallyLoading` : `boolean`
> Get if app is in Initially Loading State

- `isLoading` : `boolean`
> Get if app is in Loading State

- `userHasAuth` : `boolean`
> Get if current user has auth

---

#### `SideRouteComponents`
A set of components used to render the whole app page.

Each declared component receive as props the `appState` key, an object containing the current state of the app.
Refer to [`AppState`](#appstate) interface to props description.

##### `Footer?` : `React.ComponentType<{ appState: AppState }>`
> A content rendered under the Page

##### `Header?` : `React.ComponentType<{ appState: AppState }>`
> A content rendered above the Page, but under the Navbar (if present)

##### `InitialLoader?` : `React.ComponentType<{ appState: AppState }>`
> The component to render while app state has `isInitiallyLoading` equal to true

##### `Loader?` : `React.ComponentType<{ appState: AppState }>`
> The component to render while app state has `isLoading` equal to true

##### `Navbar?` : `React.ComponentType<{ appState: AppState }>`
> The Navbar element, rendered on top of page.
> Setting the Navbar component will not automatically show the Navbar element
> until [`hasNavbar`](#hasnavbar--boolean) of AppRouter component is true.

##### `NotFound?` : `React.ComponentType<{ appState: AppState }>`
> Custom component page to show on NotFound page

##### `Sidebar?` : `React.ComponentType<{ appState: AppState }>`
> The Sidebar element, rendered on left side of page.
> Setting the Sidebar component will not automatically show the Sidebar element
> until [`hasSidebar`](#hassidebar--boolean) of AppRouter component is true.

---

#### `MandatoryRedirect`
This is an Object that could be returned by [`getNextRout()`](#getnextroute--props-approute-appstate-appstate-routeprops-routecomponentprops--string--null--mandatoryredirect) method to force routing to another page.

##### `route` : `string | AppRoute`
> The new route

##### `params?` : `{ [key: string]: string | number | boolean | undefined }`
> Params used to build the route

##### `state?` : `LocationState`
> Location state passed to route

---

#### `AppLinkProps`
__AppLink__ element extends each props of Link or NavLink element plus:

##### `asNavLink?` : `boolean`
> Render the element as a `<NavLink />` instead as a `<Link />`

##### `params?` : `{ [key: string]: string | number | boolean | undefined }`
> Params passed to build the complete route

##### `renderAnyway?` : `boolean`
> By default, a AppLink will be rendered only if current user could reach the requested route.
> Eg. If a user has no auth, a link to a private route will not be rendered.
>
> Set this props to `true` if link must be rendered anyway

##### `to` : `string`
> The Route Name to point

---

#### `AppRouterTools`
##### `appName?` : `string`
> Get the current AppName

##### `appState` : [`Readonly<AppState>`](#appstate)
> Get the current AppState

##### `currentRoute` : [`Readonly<CurrentRoute>`](#currentroute)
> Get the current Route and its params and search string

##### `defaultPrivateRoute` : [`Readonly<AppRoute>`](#approute)
> Get the default private defined route

##### `defaultPublicRoute` : [`Readonly<AppRoute>`](#approute)
> Get the default public defined route

##### `layout` : [`Readonly<AppRouterLayout>`](#approuterlayout)
> Get current layout settings

##### `restoreAppName` : `() => void`
> Restore the default app name defined in <AppRouter />

##### `couldRouteTo` : `(route?: AppRoute) => void`
> Check if a route could be performed to a page

##### `routeTo` : `(route: string | AppRoute, params?: {}, state?: LocationState) => void`
> Route to a page by name

##### `routeToDefaultPrivate` : `(params?: {}, state?: LocationState) => void`
> Route to default private page

##### `routeToDefaultPublic` : `(params?: {}, state?: LocationState) => void`
> Route to default public page

##### `setAppName` : `(nextAppName?: string | ((currentAppName?: string)) => string | undefined) => void`
> Set a new App Name

##### `setPageTitle` : `(pageTitle?: string) => void`
> Set a new page Title

---

#### `AppRouterLayout`
##### `hasNavbar?` : `boolean`
> Check if current route has navbar visible

##### `hasSidebar?` : `boolean`
> Check if current route has sidebar visible

##### `hidePageWhileInitiallyLoading?` : `boolean`
> Check if current page must be hide if app is in initially loading state

##### `hidePageWhileLoading?` : `boolean`
> Check if current page must be hide if app is in loading state

##### `pageTitleWhileInitiallyLoading?` : `string`
> Get the page title to set while app is in initially loading state

##### `pageTitleWhileLoading?` : `string`
> Get the page title to set while app is in loading state


<br />

---

## TypeScript Usage

> - [ ] : TODO

## Roadmap
See the [open issues](https://github.com/marcocavanna/react-app-router/issues) for a list of proposed features (and known issues).

### ToDo
- [ ] SubRouting
- [ ] Define Route in a more declarative way
- [ ] TypeScript extended functionality
- [ ] Style base example
- [ ] More Examples


## Contributing
Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us.


### Fork Example
To fix or add new features feel free to fork this repo by:
1. Fork it ([https://github.com/marcocavanna/react-app-router/fork])
2. Clone the project on your workspace (`git clone https://github.com/marcocavanna/react-app-router.git`)
3. Inside the clone repository, add the upstream to this repo (`git remote add upstream https://github.com/marcocavanna/react-app-router.git`)
4. Create your feature / fix branch (`git checkout -b feature/my-new-route-component`)
5. Do some cool stuff
6. Commit your changes (`git commit -am 'feat(component): added a wonderful component'`)
7. Push your work (`git push -u origin feature/my-new-route-component`)
8. Create the pull request, from your forked github repository page


## Authors
- __Marco Cavanna__ - _Initial Work_


## Built With
- [React] A library to create UI
- [react-router-dom] Declarative routing for React
- [clsx] ClassName Utility
- [slugify] Create slug from string
- [tiny-invariant] A tiny invariant alternative


## License
This project is licensed under the MIT License


[React]: https://it.reactjs.org
[react-router-dom]: https://github.com/ReactTraining/react-router
[clsx]: https://github.com/lukeed/clsx#readme
[slugify]: https://github.com/simov/slugify
[tiny-invariant]: https://github.com/alexreardon/tiny-invariant
[CONTRIBUTING.md]: https://github.com/marcocavanna/react-app-router/blob/master/CONTRIBUTING.md

[contributors-shield]: https://img.shields.io/github/contributors/marcocavanna/react-app-router
[contributors-url]: https://github.com/marcocavanna/react-app-router/graphs/contributors

[license-shield]: https://img.shields.io/github/license/marcocavanna/react-app-router
[size-shield]: https://img.shields.io/bundlephobia/min/@appbuckets/app-router
[download-shield]: https://img.shields.io/npm/dw/@appbuckets/app-router
