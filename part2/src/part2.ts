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
export function asycMemo<T, R>(f: (param: T) => R): (param: T) => Promise<R> {
  const cache = makePromisedStore<T, R>();
  return async (param) => {
      try {
         const cached_value: R = await cache.get(param);
          return cached_value 
      } catch (error) {
        const value = f(param)
        cache.set(param, value)
        return value
      }
  }
}
// ! ! ! ! :( in the pdf

// why the wrraped function return Promise<R>
// Async functions always return a promise. 
// If the return value of an async function is not explicitly a promise, it will be implicitly wrapped in a promise.
// in our case we want the value of the Chashe memory with the Type R
// to understand why async always return Promise : ??? is to keep asynchrony all the following applications


/* 2.3 */
export function lazyFilter<T>(genFn: () => Generator<T>, filterFn:(v:T) => boolean): ()=> Generator<T> {
  const filterGen=  function* (genFn: ()=> Generator<T>, filter: (v:T) => boolean) {
      const gen = genFn()
      for (let x of gen) {
          if (filter(x)) {
              yield x;
          }
      }
    }
    return ()=> filterGen(genFn,filterFn);
}
export function lazyMap<T, R>(genFn: () => Generator<T>, mapFn: (v:T) => R):()=> Generator<R> {

const MapGen= function* (genFn: ()=> Generator<T>, map: (v:T)=> R){
   const gen = genFn()
   for (let x of gen) {
     yield map(x);
   }
}
return ()=> MapGen(genFn,mapFn);
 }

/* 2.4 */
// you can use 'any' in this question

const wait2Sec = async (): Promise<void> =>
  new Promise((res: VoidFunction) => setTimeout(res, 2000));

export async function asyncWaterfallWithRetry(
  fns: [() => Promise<any>, ...((param: any) => Promise<any>)[]]
): Promise<any> {
  let returendVal = undefined;
  for (let currAplliedFunc of fns) {
    try {
      returendVal = await currAplliedFunc(returendVal);
    } catch {
      await wait2Sec();
      try {
        returendVal = await currAplliedFunc(returendVal);
      } catch {
        await wait2Sec();
        try {
          returendVal = await currAplliedFunc(returendVal);
        } catch (err) {
          returendVal = err;
        }
      }
    }
  }
  return returendVal;
}