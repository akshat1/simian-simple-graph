import assert from 'assert';
import { Edge, Graph } from '../src/model';
import { getEdgesStartingFrom, getSubTree } from '../src/get-sub-tree';

describe('getEdgesStartingFrom', function() {
  it('should return edges starting from the indicated node', function() {
    const edges = [
      new Edge('a', 'b'),
      new Edge('a', 'd'),
      new Edge('b', 'c'),
      new Edge('c', 'd'),
      new Edge('a', 'e'),
    ];

    assert.deepEqual(
      getEdgesStartingFrom('a', edges),
      [new Edge('a', 'b'), new Edge('a', 'd'), new Edge('a', 'e')],
    );
  });
});

describe('getSubTree', function() {
  it('should return the sub-tree', function() {
    const g = new Graph([
      new Edge('a', 'b'),
      new Edge('a', 'c'),
      new Edge('a', 'd'),
      new Edge('c', 'e'),
      new Edge('c', 'f'),
      new Edge('f', 'g'),
      new Edge('g', 'h'),
      new Edge('g', 'i'),
      new Edge('g', 'j'),
    ]);

    assert.deepEqual(
      Array.from(getSubTree('c', g).edges),
      [
        new Edge('c', 'e'),
        new Edge('c', 'f'),
        new Edge('f', 'g'),
        new Edge('g', 'h'),
        new Edge('g', 'i'),
        new Edge('g', 'j'),
      ],
    );
  })
});
