import { IInterceptor } from './types';

const createInterceptor = <IGlobalState, IField>({
  core,
  field,
}: IInterceptor<IGlobalState, IField>) => {
  return { core, field };
};

export { createInterceptor };
