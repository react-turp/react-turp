import { useState, useLayoutEffect } from 'react';
import dot from 'dot-object';
import _ from 'lodash';
import axios, { AxiosResponse } from 'axios';

import { ICreate, IObjectKeys, IStore, ICache, IApiAction } from './types';
import pubSub from './pubsub';
import { update } from '../utils';
import { devToolsConnect, IDevTools } from '../implementation';

let refState: IObjectKeys | any = {};
let refFunctions: IObjectKeys | any = {};

const functionRef = (): typeof refFunctions => _.cloneDeep(refFunctions);

const stateRef = (): typeof refState => _.cloneDeep(refState);

const createStore = <T>({
  stateInitial,
  request,
  deps = [],
  develop,
  logging,
}: ICreate<Partial<T>>): IStore<T> => {
  let devTools: IDevTools | undefined;
  const requestCache: ICache = {};

  if (logging && typeof logging !== 'function') {
    throw new Error(
      `The "logging" must be a "function" and not a "${typeof logging}"`,
    );
  }

  let initialState: IObjectKeys | any = stateInitial;

  if (devTools) {
    devTools.init(initialState);
  }

  const axiosApi = axios.create({
    baseURL: request?.path,
  });

  const { pubsub } = pubSub();

  if (develop && develop.active) {
    devTools = devToolsConnect(develop.nameDev);
  }

  const api = async <IResquest = any>({
    path,
    method = 'get',
    body,
    config,
    revalidate,
    backgroundRevalidate,
  }: IApiAction): Promise<AxiosResponse<IResquest>> => {
    const linkValidate = path?.match(
      /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
    );

    if (!request?.path && !linkValidate) {
      throw new Error(
        `You must pass a valid url to make your requests. This is not valid ${path} `,
      );
    }

    if (request?.token && axiosApi.defaults.headers)
      axiosApi.defaults.headers.Authorization = `Bearer ${dot.pick(
        request.token,
        initialState,
      )}`;

    Object.keys(requestCache).forEach(pathCache => {
      if (path === pathCache) return;

      const cache = requestCache[pathCache];
      const actualTimestamp = Math.floor(Date.now() / 1000);

      if (cache?.cacheRevalidate && actualTimestamp > cache?.created) {
        delete requestCache[pathCache];

        axiosApi({
          url: cache.cachePath,
          method: cache.cacheMethod,
          data: cache.cacheBody,
          ...cache.cacheConfig,
        }).then(result => {
          const expiryDate = new Date(
            new Date().setSeconds(
              new Date().getSeconds() + (revalidate || 0) * 60,
            ),
          );

          requestCache[pathCache].cache = result;
          requestCache[pathCache].created = Number(
            Math.floor(Number(expiryDate) / 1000),
          );
        });
      }
    });

    if (path && requestCache[path]) {
      const { cache, created } = requestCache[path];
      const actualTimestamp = Math.floor(Date.now() / 1000);

      if (created > actualTimestamp) {
        return { ...cache };
      }

      delete requestCache[path];
    }

    try {
      const result = await axiosApi({
        url: path,
        method,
        data: body,
        ...config,
      });

      if (path && !requestCache[path]) {
        const expiryDate = new Date(
          new Date().setSeconds(
            new Date().getSeconds() + (revalidate || 0) * 60,
          ),
        );

        requestCache[path] = {
          cache: result,
          created: Number(Math.floor(Number(expiryDate) / 1000)),
          cachePath: path,
          cacheMethod: method,
          cacheBody: body,
          cacheConfig: config,
          cacheRevalidate: revalidate,
          cacheBackgroundRevalidate: backgroundRevalidate,
        };
      }

      return {
        ...result,
      };
    } catch (error) {
      throw new Error(String(error));
    }
  };

  const stateUpdateInterceptor = deps;

  const startUpdateState = (newStateUpdate: object) => {
    if (logging !== undefined) {
      logging(newStateUpdate);
    }
    const initialStateClone = _.cloneDeep(initialState);

    const mergedState = update(initialStateClone, newStateUpdate);

    initialState = mergedState;

    refState = mergedState;

    return mergedState;
  };

  const updateStates = async (state: any) => {
    const partial = dot.object(state);

    if (stateUpdateInterceptor.length === 0 || pubsub.handlers.length === 0) {
      const simpleStateUpdate = startUpdateState(partial);

      pubsub.notify(simpleStateUpdate);

      if (devTools) {
        devTools.send(
          {
            type: 'update',
            payload: partial,
          },
          simpleStateUpdate,
        );
      }
    }

    stateUpdateInterceptor.forEach(async p => {
      if (p.field && dot.pick(p.field, partial) === undefined) {
        const simpleStateUpdate = startUpdateState(partial);

        pubsub.notify(simpleStateUpdate);

        return p;
      }

      const { action: coreAction, revalidate = 0 } = p.core({
        state: p.field ? dot.pick(p.field, initialState) : initialState,
        newData: p.field ? dot.pick(p.field, partial) : partial,
        dispatch: updateStates,
      });

      let action = coreAction;

      if (typeof action === 'function') {
        action = await action();
      }

      if (typeof action === 'boolean') {
        if (!action) {
          for (let i = 0; i <= revalidate; i += 1) {
            const actionLoopVerify = p.core({
              state: p.field ? dot.pick(p.field, initialState) : initialState,
              newData: p.field ? dot.pick(p.field, partial) : partial,
              dispatch: updateStates,
            }).action;

            if (actionLoopVerify) {
              const simpleStateUpdate = startUpdateState(partial);

              pubsub.notify(simpleStateUpdate);

              if (devTools) {
                devTools.send(
                  {
                    type: '[update] Interceptor',
                    payload: partial,
                  },
                  simpleStateUpdate,
                );
              }
              break;
            }
          }

          return p;
        }

        const simpleStateUpdate = startUpdateState(partial);

        pubsub.notify(simpleStateUpdate);

        if (devTools) {
          devTools.send(
            {
              type: '[update] Interceptor',
              payload: partial,
            },
            simpleStateUpdate,
          );
        }
      }

      if (typeof action === 'object') {
        const newStateUpdateIntercept = p.field
          ? dot.object({ [p.field]: action })
          : action;

        const newState = startUpdateState(newStateUpdateIntercept);

        pubsub.notify(newState);

        if (devTools) {
          devTools.send(
            {
              type: '[update] Interceptor',
              payload: partial,
            },
            newState,
          );
        }
      }
      return p;
    });
  };

  const useGlobalStates = (stateName: string) => {
    const [state, setState] = useState(dot.pick(stateName, initialState));
    useLayoutEffect(() => {
      const newStateHandler = (newStore: any) => {
        const newState = dot.pick(stateName, newStore);

        if (!_.isEqualWith(state, newState, _.isEqual)) {
          setState(newState);
        }
      };

      pubsub.subscribe(newStateHandler);

      return () => pubsub.unsubscribe(newStateHandler);
    }, [state, stateName]);

    return initialState;
  };

  const getStates = () => {
    return initialState;
  };

  const useSelect = <S>(fn: (item: any) => S, name: string): Partial<S> => {
    const state = useGlobalStates(name);

    return fn(state);
  };

  refState = initialState;

  refFunctions = { api, update: updateStates };

  return { updateStates, getStates, useGlobalStates, useSelect, initialState };
};

export { createStore, functionRef, stateRef };
