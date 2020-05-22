export default interface AppState {
  /**
   * Get or Set if App is initially loading.
   * This state will be set to true on AppRouter Bootstrap
   * and is useful to show an initial App Loader.
   */
  isInitiallyLoading: boolean;

  /**
   * Get or Set if App is loading.
   * This state could be set any time as true
   * to show an AppLoader while some long time
   * processes occurred.
   */
  isLoading: boolean;

  /**
   * Get or Set if current user viewing the App
   * has authorization. When the Auth State has been set to true
   * the user could view `private` pages and `hybrid` pages.
   */
  userHasAuth: boolean;
}
