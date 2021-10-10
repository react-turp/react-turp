import dot from 'dot-object';
import { useContext } from 'react';
import { AppContext } from '../providers';

import { functionRef, stateRef } from './api';
import { IStore } from './api/types';
import { getParamsCallback } from './utils';
import { IAction, IApi, Path } from './types';

const useMongeContext = <T>() => useContext(AppContext) as IStore<T>;

const globalState = <T = any>() => {
  return (function useGlobal() {
    const storeTurp = useMongeContext<T>();

    if (!storeTurp) {
      throw new Error('You must use {TurpProvider} wrapping your application');
    }
    return storeTurp;
  })();
};

function useGet<S>(): Partial<S> {
  const store = globalState();

  const select = store.getStates<S>();

  return select;
}

const useSend = <S = any, T = any>() => {
  const store = globalState();

  return (fn: (item: T) => T, field?: Path<S>) => {
    if (typeof field !== 'string') {
      throw new Error(
        `The field must be a string and not a ${typeof field} and cannot be empty.`,
      );
    }

    if (typeof fn !== 'function') {
      throw new Error(
        `The fn must be a function and not a ${typeof fn} and cannot be empty.`,
      );
    }

    if (field && typeof field === 'string') {
      const stateField = dot.pick(field, store.getStates());

      if (!stateField) {
        throw new Error(
          'You are trying to select a "field" that does not exist',
        );
      }

      store.updateStates({ [String(field)]: fn(stateField) });
    } else {
      store.updateStates(fn(store.getStates()));
    }
  };
};

const useDispatch = () => {
  const store = globalState();

  return <IType = any>(value: IType) => {
    if (!value) {
      throw new Error(
        `
        The value must be filled with an object`,
      );
    }

    store.updateStates(value);
  };
};

const updatePage = (field?: string) => {
  return (value: any) => {
    if (field) {
      const valueUpdate = {
        [field]: value,
      };

      functionRef().update(valueUpdate);
    } else {
      functionRef().update(value);
    }
  };
};

const createActions = <IGlobalState = any, IFieldState = any>() => {
  return function create<IActionsState>({
    field,
    actions,
  }: IAction<IGlobalState, IFieldState, IActionsState>) {
    if (typeof field !== 'string') {
      throw new Error(
        `The field must be a string and not a ${typeof field} and cannot be empty.`,
      );
    }

    if (typeof actions !== 'function') {
      throw new Error(
        `The actions must be a function and not a ${typeof field} and cannot be empty.`,
      );
    }

    const stateOfAField = () => {
      const actionValue = dot.pick(field, stateRef());

      if (!actionValue) {
        throw new Error(
          'You are trying to select a "field" that does not exist',
        );
      }

      return actionValue;
    };

    const actionsCreate = actions({
      fieldActions: {
        fieldData: stateOfAField,
        fieldDispatch: updatePage(String(field)),
      },
      state: stateRef,
      dispatch: updatePage(),
    });

    return actionsCreate;
  };
};

const useSelect = <T = any, S = any>(fn: (item: T) => S): S => {
  if (typeof fn !== 'function') {
    throw new Error(
      `The fn must be a function and not a ${typeof fn} and cannot be empty.`,
    );
  }

  const store = globalState<T>();

  const name = getParamsCallback(fn);

  if (!name) {
    const state = store.getStates();

    delete state.update;

    return state;
  }

  const select = store.useSelect<S>(fn, name);

  return select;
};

const { api } = functionRef() as IApi;

export { useSelect, useGet, useDispatch, useSend, createActions, api };
