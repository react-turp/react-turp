import { AxiosInstance, Method, AxiosRequestConfig } from 'axios';

import { Path } from '../types';

export interface IObjectKeys {
  [key: string]: string | number;
}

export interface ICache {
  [key: string]: {
    created: number;
    cache: any;
    cachePath?: string;
    cacheMethod?: Method;
    cacheBody?: any;
    cacheConfig?: AxiosRequestConfig;
    cacheRevalidate?: number;
    cacheBackgroundRevalidate?: boolean;
  };
}

export interface IStore<T> {
  updateStates(value: any): void;
  getStates<S>(): S | any;
  useSelect<S>(fn: (item: T) => S, name: string): S | any;
  useGlobalStates<S>(name: string): Partial<S> | any;
  initialState?: IObjectKeys | any;
}

export interface IApiAction {
  path?: string;
  method?: Method;
  body?: any;
  config?: AxiosRequestConfig;
  /**
   * revalidate: in how many minutes do you intend to revalidate this call? 1 = 1min, 2 = 2min, 120 = 2hrs
   */
  revalidate?: number;
  /**
   * backgroundRevalidate: Do you want to validate this call whenever a new request is made in any request?
   */
  backgroundRevalidate?: boolean;
}

interface ICore {
  state: any;
  newData: any;
  dispatch: (value: object) => void;
  api?: AxiosInstance;
}

export interface IDeps {
  /**
   * @field > supports dot notation, example "user.email"
   */
  field?: any;
  core: ({ state, newData, dispatch, api }: ICore) => {
    action: any;
    revalidate?: number;
  };
}

export interface ICreate<T = any> {
  /**
   * stateInitial: is your global state
   */
  stateInitial: T;
  /**
   * deps: it's a list of interceptors
   */
  deps?: Array<IDeps>;
  request?: {
    /**
     * path: set your API url to execute requests
     */
    path: string;
    /**
     * token: use dot notation to set the key where your token is, if necessary for your API requests,
     * example 'auth.user.token'.
     *
     * stateInitial = {auth: {user: {token: ''}}}
     */
    token?: Path<T>;
  };
  develop?: {
    /**
     * nameDev: The name you want to appear in DevTools
     */
    nameDev: string;
    /**
     * active: Enable debugging of state updates using DevTools? true | false
     */
    active: boolean;
  };
  /**
   * logging: Log actions on state updates.
   */
  logging?: (value: object) => void;
}
