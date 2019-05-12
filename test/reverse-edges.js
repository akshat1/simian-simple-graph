import assert from 'assert';
import { Edge, reverseEdges } from '../src';

describe('reverseEdges', function() {
  it('should reverse the provided edges', function() {
    const edges = [
      new Edge('a', 'b'),
      new Edge('b', 'c'),
      new Edge('c', 'd'),
    ];

    const expectedValue = [
      new Edge('b', 'a'),
      new Edge('c', 'b'),
      new Edge('d', 'c'),
    ];

    // reverse edges will take any iterable as `arg.edges`
    const actualValues = reverseEdges({ edges });

    assert.deepEqual(actualValues, expectedValue);
  });
});
