/* 2.1 */

import * as R from "ramda";

export const MISSING_KEY = "___MISSING___";

type PromisedStore<K, V> = {
  get(key: K): Promise<V>;
  set(key: K, value: V): Promise<void>;
  delete(key: K): Promise<void>;
};
type StoreBody<K, V> = { keys: K[]; values: V[] }; // Promise Store DB type

export function makePromisedStore<K, V>(): PromisedStore<K, V> {
  const promiseStoreDB: StoreBody<K, V> = { keys: [], values: [] }; // Promise Store DB

  return {
    get(key: K) {
      return new Promise<V>((resolve, reject) => {
        const indexOfInputKey = promiseStoreDB.keys.indexOf(key);
        indexOfInputKey !== -1 ? resolve(promiseStoreDB.values[indexOfInputKey])
                               : reject(MISSING_KEY);
      });
    },
    set(key: K, value: V) {
      return new Promise<void>((resolve) => {
        const indexOfInputKey = promiseStoreDB.keys.indexOf(key);
        
        const replaceExistingValue = (): void => {
          const removedList = R.remove(indexOfInputKey, 1, promiseStoreDB.values);
          promiseStoreDB.values = R.insert(indexOfInputKey, value, removedList);
        };
        const addNewPair = (): void => {
          promiseStoreDB.keys = R.append(key, promiseStoreDB.keys);
          promiseStoreDB.values = R.append(value, promiseStoreDB.values);
        };

        indexOfInputKey !== -1 ? replaceExistingValue() : addNewPair();
        resolve();
      });
    },
    delete(key: K) {
      return new Promise<void>((resolve, reject) => {
        const indexOfInputKey = promiseStoreDB.keys.indexOf(key);
        
        const removeFromPromiseStore = (): void => {
          promiseStoreDB.keys = R.remove(indexOfInputKey, 1, promiseStoreDB.keys);
          promiseStoreDB.values = R.remove(indexOfInputKey, 1, promiseStoreDB.values);
          resolve();
        };

        indexOfInputKey !== -1 ? removeFromPromiseStore() : reject(MISSING_KEY);
      });
    },
  };
}

export function getAll<K, V>(store: PromisedStore<K, V>, keys: K[]): Promise<V[]> {
    return Promise.all(R.map(store.get,keys)); // gets an array of promises and apling Promis.all
}

/* 2.2 */

// ??? (you may want to add helper functions here)
//
// export function asycMemo<T, R>(f: (param: T) => R): (param: T) => Promise<R> {
//     ???
// }

/* 2.3 */

// export function lazyFilter<T>(genFn: () => Generator<T>, filterFn: ???): ??? {
//     ???
// }

// export function lazyMap<T, R>(genFn: () => Generator<T>, mapFn: ???): ??? {
//     ???
// }

/* 2.4 */
// you can use 'any' in this question

// export async function asyncWaterfallWithRetry(fns: [() => Promise<any>, ...(???)[]]): Promise<any> {
//     ???
// }
