import { IStorage } from './types';

const createStorage = <IGlobalState>({ actions }: IStorage<IGlobalState>) => {
  return { actions };
};

export { createStorage };
