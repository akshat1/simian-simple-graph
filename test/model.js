import assert from 'assert';
import { Edge, Graph, getEdgesStartingFrom, getSubTree, nodesFromEdges, reverseEdges } from '../src/model';

describe('model', function () {
  describe('Edge', function () {
    it('should construct an edge', function () {
      const edge = new Edge('a', 'b');
      assert.deepEqual(edge, { from: 'a', to: 'b' });
    });
  });

  describe('Graph', function () {
    it('should construct a graph', function () {
      const edges = [
        new Edge('a', 'b'),
        new Edge('a', 'c'),
        new Edge('d', 'e'),
        new Edge('b', 'f'),
      ];
      const g = new Graph(edges);
      assert.deepEqual(g.edges, new Set(edges));
      assert.deepEqual(g.nodes, nodesFromEdges(edges));
    });
  });

  describe('nodesFromEdges', function () {
    it('should return a set comprised of nodes from supplied edges', function () {
      const edges = [
        new Edge('a', 'b'),
        new Edge('a', 'c'),
        new Edge('d', 'e'),
        new Edge('b', 'f'),
      ];

      assert.deepEqual(nodesFromEdges(edges), new Set(['a', 'b', 'c', 'd', 'e', 'f']));
    });
  });

  describe('getEdgesStartingFrom', function () {
    it('should return edges starting from the indicated node', function () {
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

  describe('getSubTree', function () {
    it('should return the sub-tree', function () {
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
  
});
