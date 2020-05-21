import AppState from '../interfaces/AppState';
import { AppRoute } from '../interfaces';


export interface LayoutState {
  /** Check if Current Route has navbar visible */
  hasNavbar: boolean;
  /** Check if Current Route has sidebar visible */
  hasSidebar: boolean;
}

export interface AppRouterTools {
  /** Get current App Name */
  appName?: string;

  /** Get current AppState */
  appState: AppState;

  /** Get the current Route */
  currentRoute: { route: AppRoute, params: {}, search: URLSearchParams };

  /** Get current state of App Layout */
  layoutState: LayoutState;

  /** Restore the Default App Name */
  restoreAppName: () => void;

  /** Route to a Page using its name */
  routeTo(pageName: string, params?: { [key: string]: string | number | boolean | undefined }): void;

  /** Set the new App Name */
  setAppName(nextAppName?: string | ((currentAppName: string) => string)): void;

  /** Set Page Title */
  setPageTitle(pageTitle?: string): void;
}
