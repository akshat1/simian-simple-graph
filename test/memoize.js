const assert = require('assert');
const sinon = require('sinon');
const { memoize } = require('../lib/memoize');

describe('memoize', function() {
  it('should return the same value as returned by fn', function() {
    const fn = sinon.stub().returns(42);
    const resolver = sinon.stub().returns('key');
    const memoized = memoize(fn, resolver);

    assert.equal(memoized('a', 10), 42);
    assert.equal(memoized('a', 10), 42);
    assert.equal(memoized('a', 10), 42);
  });

  it('same cache-key should cause fn to be called only once', function() {
    const fn = sinon.stub().returns(42);
    const resolver = sinon.stub().returns('key');
    const memoized = memoize(fn, resolver);

    memoized('a', 'b', 'c');
    memoized('a', 'b', 'c');
    memoized('a', 'b', 'c');
    memoized('a', 'b', 'c');

    assert.deepEqual(fn.args, [['a', 'b', 'c']]);
    assert.deepEqual(resolver.args, [
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c']
    ]);
  });

  it('different cache-key should cause fn to be called multiple times', function() {
    const fn = sinon.stub().returns(42);
    const resolver = sinon.stub().returns('key-0');
    const memoized = memoize(fn, resolver);

    memoized('a', 'b', 'c');
    memoized('a', 'b', 'c');

    resolver.returns('key-1');
    memoized('a', 'b', 'c');
    memoized('a', 'b', 'c');

    resolver.returns('key-2');
    memoized('a', 'b', 'c');
    memoized('a', 'b', 'c');

    // For the three different keys, we should have called fn thrice
    assert.deepEqual(fn.args, [
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
    ]);
  });

  it('should clear the cache if _clearCache is called', function() {
    const fn = sinon.stub().returns(42);
    const resolver = sinon.stub().returns('key');
    const memoized = memoize(fn, resolver);

    memoized('a', 'b', 'c');
    memoized('a', 'b', 'c');
    memoized._clearCache();
    memoized('a', 'b', 'c');
    memoized('a', 'b', 'c');

    assert.deepEqual(fn.args, [
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
    ]);
    assert.deepEqual(resolver.args, [
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'b', 'c']
    ]);
  });
});
