declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

export interface IDevTools {
  send: (action: { type: string; payload: any }, state: any) => void;
  init: (state: any) => void;
}

export const devToolsConnect = (name: string): IDevTools | undefined => {
  try {
    if (
      typeof window !== 'undefined' &&
      // eslint-disable-next-line no-underscore-dangle
      typeof (window as any).__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
    ) {
      // eslint-disable-next-line no-underscore-dangle
      const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect({
        name,
        serialize: true,
      });

      return devTools;
    }
    // eslint-disable-next-line no-empty
  } catch (err) {
    throw new Error('Error devTools');
  }

  return undefined;
};
