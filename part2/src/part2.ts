/* 2.1 */

export const MISSING_KEY = "___MISSING___";

type PromisedStore<K, V> = {
  get(key: K): Promise<V>;
  set(key: K, value: V): Promise<void>;
  delete(key: K): Promise<void>;
};

type StoreBody<K, V> = Map<K,V>; // Promise Store DB type

export function makePromisedStore<K, V>(): PromisedStore<K, V> {
  const promiseStoreDB: StoreBody<K, V> = new Map<K,V>();
  return {
    get(key: K) {
      return new Promise<V>((resolve, reject) => {
        const returendVal = promiseStoreDB.get(key);
        returendVal!==undefined? resolve(returendVal) : reject(MISSING_KEY);
      });
    },
    set(key: K, value: V) {
      return new Promise<void>((resolve) => {
        promiseStoreDB.set(key,value);
        resolve();
      });
    },
    delete(key: K) {
      return new Promise<void>((resolve, reject) => {
        promiseStoreDB.delete(key)?
        resolve() : reject(MISSING_KEY);
      });
    },
  };
}

export function getAll<K, V>(store: PromisedStore<K, V>, keys: K[]): Promise<V[]> {
  return Promise.all(keys.map(store.get)); // gets an array of promises and apling Promis.all
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
