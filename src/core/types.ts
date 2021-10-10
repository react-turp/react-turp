import { AxiosResponse } from 'axios';
import { IApiAction } from './api/types';

type StringableKey<T> =
  T extends readonly unknown[]
  ? number extends T['length']
  ? number : `${number}`
  : string | number;

export type Path<T> =
  T extends object
  ? {
    [P in keyof T & StringableKey<T>]: `${P}` | `${P}.${Path<T[P]>}`;
  }[keyof T & StringableKey<T>]
  : never;

export interface IApi<T = any> {
  api: <IResquest = T>({
    body,
    method,
    config,
    revalidate,
    path,
    backgroundRevalidate,
  }: IApiAction) => Promise<AxiosResponse<IResquest>>;
}

export type ExtendPartial<T> = {
  [P in keyof T]?: ExtendPartial<T[P]>;
};

interface IActionCreate<S, T> {
  fieldActions: {
    /**
     * fieldData: > is a function that returns the current state of the "field".
     */
    fieldData: () => T;
    /**
     * fieldDispatch: > is a function to update the state referring to the "field".
     */
    fieldDispatch: (value: T) => void;
  };
  state: () => S;
  dispatch: (state: ExtendPartial<S>) => void;
}

export interface IAction<S, T, F> {
  /**
   * @field > supports dot notation, example "user.email"
   * @field > is the name of the field to be used in actions.
   */
  field: Path<S>;
  /**
   * @fieldActions > returns a (fieldActions) with the actions to be performed within the (field) passed;
   * @dispatch > is a function to update any state value..
   * @state > is a function that returns the global state..
   */
  actions: ({ fieldActions, dispatch, state }: IActionCreate<S, Partial<T>>) => F;
}
