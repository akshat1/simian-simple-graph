/**
 * An simpler implementation of lodash's memoize utility (I didn't use lodash because I did not
 * want to include a dependency just for a single function).
 *
 * @param {function} fn -
 * @param {function} resolver - A function with the same signature as fn and which returns a
 *        string cache-key.
 * @returns {function} - A memoized function.
 */
function memoize(fn, resolver) {
  const cache = new Map();
  const memoized = function(...args) {
    const cacheKey = resolver(...args);
    /* We use cahce.has instead of simply checking cache.get(cacheKey) because we could have cached
    a valid, falsy value. Checking cache.get() would cause us to hit fn every time the result of
    fn(...args) is falsy. */
    if (cache.has(cacheKey))
      return cache.get(cacheKey);

    const result = fn(...args);
    cache.set(cacheKey, result);
    return result;
  };
  memoized._clearCache = () => cache.clear();
  return memoized;
}

module.exports = { memoize };
