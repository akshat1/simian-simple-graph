const assert = require('assert');
const { Graph, Edge } = require('../lib');

const { makeEdge } = Edge;

describe('Graph', function() {
  describe('getSubTree', function() {
    it('should supply a simple subTree', function() {
      const graph = new Graph([
        makeEdge('a', 'aa'),
        makeEdge('a', 'ab'),
        makeEdge('a', 'ac'),
        makeEdge('ab', 'aba'),
        makeEdge('ab', 'abb'),
        makeEdge('ab', 'abc'),
        makeEdge('abb', 'abba'),
        makeEdge('abb', 'abbb'),
        makeEdge('abb', 'abbc'),
      ]);

      const expectedSubTree = new Graph([
        makeEdge('ab', 'aba'),
        makeEdge('ab', 'abb'),
        makeEdge('ab', 'abc'),
        makeEdge('abb', 'abba'),
        makeEdge('abb', 'abbb'),
        makeEdge('abb', 'abbc'),
      ]);

      const actualSubTree = Graph.getSubTree(graph, 'ab');

      assert.equal(actualSubTree.toString(), expectedSubTree.toString());
    });
  });

  describe('invert', function() {
    it('should return a new graph with all edges flipped', function() {
      const graph = new Graph([
        makeEdge('a', 'b'),
        makeEdge('a', 'c'),
        makeEdge('a', 'd'),
        makeEdge('b', 'e'),
        makeEdge('c', 'f'),
        makeEdge('d', 'g'),
      ]);

      const iGraph = Graph.invert(graph);
      const expectedString = '[Graph [[Edge b -> a], [Edge c -> a], [Edge d -> a], [Edge e -> b], [Edge f -> c], [Edge g -> d]]]';

      assert.equal(Graph.toString(iGraph), expectedString);
    });
  });

  describe('Ancestors / Descendents', function() {
    const graph = new Graph([
      makeEdge('a', 'b'),
      makeEdge('a', 'c'),
      makeEdge('a', 'd'),
      makeEdge('b', 'e'),
      makeEdge('c', 'f'),
      makeEdge('d', 'g'),
    ]);

    describe('getAncestors', function() {
      assert.deepEqual(
        Array.from(Graph.getAncestors(graph, 'g')).sort(),
        ['a', 'd']
      );
    });

    describe('getDescendents', function() {
      assert.deepEqual(
        Array.from(Graph.getDescendents(graph, 'a')).sort(),
        ['b', 'c', 'd', 'e', 'f', 'g'],
      );
    });
  })
});
