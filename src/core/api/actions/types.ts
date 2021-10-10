import { Path } from '../../types';

type ExtendPartial<T> = {
  [P in keyof T]?: ExtendPartial<T[P]>;
};

export interface ICore<T, S> {
  state: S;
  newData: S;
  dispatch: (value: ExtendPartial<T>) => void;
}

export interface IInterceptor<T = any, S = any> {
  /**
   * @field > supports dot notation, example "user.email"
   * @field > "field": the name of the field in the state to be intercepted
   */
  field?: Path<T>;
  /**
   * @state > would be the state selected using the "field" or the full state.
   *
   * @newData > would be the possible value sent to update the "field" or some global state value
   *
   * @dispatch > is the status update function, if you want to use it in the interceptor, you can without problems
   */
  core: ({ state, newData, dispatch }: ICore<T, S>) => {
    /**
     * @action > It can be a function or a boolean
     */
    action:
      | Promise<S>
      | boolean
      | {
          [key: string]: object;
        }
      | Promise<any>
      | object;
    /**
     * @revalidate > Is the number of validation attempts if your action above returns a true boolean
     * @revalidate > If it returns true your status is updated, if it returns false your status will not change

     */
    revalidate?: number;
  };
}
