import React, { useMemo, useEffect, useState, useRef } from 'react';
import dot from 'dot-object';
import { IStorage } from '../core/implementation/Storage/types';

export interface IProvider {
  store?: object | any;
  children?: React.ReactElement;
  loadingStorage?: React.ReactElement | undefined;
  storage?: IStorage;
}

export const AppContext = React.createContext<any | null>(null);

const TurpProvider: React.FC<IProvider | undefined> = ({
  children,
  store,
  loadingStorage,
  storage,
}) => {
  const state = useMemo(() => store, [store]);

  const stateRef = useRef(state);
  const [isLoading, setIsLoading] = useState(true);

  const searchForStatus = (field: string | undefined) => {
    return field
      ? dot.pick(field, stateRef.current.initialState)
      : stateRef.current.initialState;
  };

  useEffect(() => {
    const loadStorage = async () => {
      if (storage && storage.actions.length > 0) {
        const promises = storage.actions.map(async p => {
          let valueState = p.value;

          if (typeof p.value === 'function') {
            valueState = await p.value(searchForStatus(p.field));
          }

          const actionsInitial = valueState;

          const value = p.field
            ? { [p.field]: actionsInitial }
            : actionsInitial;

          stateRef.current.updateStates(value);
        });
        await Promise.all(promises);
      }
      setIsLoading(false);
    };
    loadStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading && loadingStorage ? (
    loadingStorage
  ) : (
    <>
      <AppContext.Provider value={stateRef.current}>
        {children}
      </AppContext.Provider>
    </>
  );
};

export { TurpProvider };
