/** Compose functions right-to-left */
// compose :: fs -> g
export const compose = (...fns) =>
  fns.reduce((f, g) => (...args) => f(g(...args)));

/*
 * ARRAY FUNCTIONS
 */

/** Makes array methods point-free. */
// safeArrayMethod :: m -> f -> as -> b
export const safeArrayMethod = name => f => as =>
  (as[name] && typeof as[name] === 'function' ? as : [])[name](f);

/** Point-free array map. Naive implementation. */
// map :: f -> as -> bs
export const map = safeArrayMethod('map');

/** Point-free array some. Naive implementation. */
// some :: f -> as -> as
export const some = safeArrayMethod('some');

/** Point-free array find. Naive implementation. */
// find :: f -> as -> a
export const find = safeArrayMethod('find');

/** Point-free array filter. Naive implementation. */
// find :: f -> as -> as
export const filter = safeArrayMethod('filter');

/** Removes duplicates from an array. Naive implementation. */
// uniq :: as -> as
export const uniq = compose(Array.from, x => new Set(x));

/*
 * POJO FUNCTIONS
 * Functions for dealing with Plain Old JavaScript Objects
 */

/** Returns a property by key, or by dot-separated deep keys. */
// prop :: str -> obj -> a
export const prop = propertyName => o =>
  propertyName
    .split('.')
    .reduce((a, b) => a[b], o);
 
