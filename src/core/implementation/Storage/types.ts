import { Path } from '../../types';

export interface IDepsStorage<T> {
  /**
   * @field > supports dot notation, example "user.email"
   * @field > "field": is the name or path of the key equivalent to the value in state
   */
  field?: Path<T>;
  /**
   * @fieldData > "fieldData": is a function that returns the state value equivalent to field
   * @return  > you must return a value equivalent to the field.
   */
  value(fieldData: () => any): any;
}

export interface IStorage<T = any> {
  actions: Array<IDepsStorage<T>>;
}
