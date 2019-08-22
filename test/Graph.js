const { Edge } = require('../lib/Edge');
const { Graph } = require('../lib/Graph');
const assert = require('assert');

function assertIsMemoized(func) {
  return function() {
    assert.ok(typeof func._clearCache === 'function');
  };
}

describe('Graph', function() {
  describe('getSubTree', function() {
    it('should supply a simple subTree', function() {
      const graph = new Graph([
        new Edge('a', 'aa'),
        new Edge('a', 'ab'),
        new Edge('a', 'ac'),
        new Edge('ab', 'aba'),
        new Edge('ab', 'abb'),
        new Edge('ab', 'abc'),
        new Edge('abb', 'abba'),
        new Edge('abb', 'abbb'),
        new Edge('abb', 'abbc'),
      ]);

      const expectedSubTree = new Graph([
        new Edge('ab', 'aba'),
        new Edge('ab', 'abb'),
        new Edge('ab', 'abc'),
        new Edge('abb', 'abba'),
        new Edge('abb', 'abbb'),
        new Edge('abb', 'abbc'),
      ]);

      const actualSubTree = Graph.getSubTree(graph, 'ab');

      assert.equal(Graph.toString(actualSubTree), Graph.toString(expectedSubTree));
    });

    it('should be memoized', assertIsMemoized(Graph.getSubTree));
  });

  describe('invert', function() {
    it('should return a new graph with all edges flipped', function() {
      const graph = new Graph([
        new Edge('a', 'b'),
        new Edge('a', 'c'),
        new Edge('a', 'd'),
        new Edge('b', 'e'),
        new Edge('c', 'f'),
        new Edge('d', 'g'),
      ]);

      const iGraph = Graph.invert(graph);
      const expectedString = '[Graph [[Edge b -> a], [Edge c -> a], [Edge d -> a], [Edge e -> b], [Edge f -> c], [Edge g -> d]]]';

      assert.equal(Graph.toString(iGraph), expectedString);
    });

    it('should be memoized', assertIsMemoized(Graph.invert));
  });

  describe('Ancestors / Descendents', function() {
    const graph = new Graph([
      new Edge('a', 'b'),
      new Edge('a', 'c'),
      new Edge('a', 'd'),
      new Edge('b', 'e'),
      new Edge('c', 'f'),
      new Edge('d', 'g'),
    ]);

    describe('getAncestors', function() {
      it('should get ancestors', function() {
        assert.deepEqual(
          Graph.getAncestors(graph, 'g').toArray().sort(),
          ['a', 'd']
        );
      });

      it('should be memoized', function() {
        assert.ok(typeof Graph.getAncestors._clearCache === 'function');
      });
    });

    describe('getDescendents', function() {
      it('should get descendents', function() {
        assert.deepEqual(
          Array.from(Graph.getDescendents(graph, 'a')).sort(),
          ['b', 'c', 'd', 'e', 'f', 'g'],
        );
      });

      it('should be memoized', assertIsMemoized(Graph.getDescendents));
    });
  });

  describe('addEdge', function() {
    it('should not mutate the original graph', function() {
      const gA = new Graph([
        new Edge('a', 'b'),
        new Edge('a', 'c'),
        new Edge('a', 'd'),
      ]);

      const before = Array.from(Graph.getEdges(gA).values()).map(Edge.toString).join(',');
      Graph.addEdge(gA, new Edge('a', 'e'));
      const after = Array.from(Graph.getEdges(gA).values()).map(Edge.toString).join(',');
      assert.equal(after, before);
    });

    it('should return a new graph with the old edges + new edges', function() {
      const gA = new Graph([
        new Edge('a', 'b'),
        new Edge('a', 'c'),
        new Edge('a', 'd'),
      ]);
      const a2E = new Edge('a', 'e');
      const a2F = new Edge('a', 'f');
      const gB = Graph.addEdge(gA, a2E, a2F);
      const edgesInB = Graph.getEdges(gB);
      assert.ok(edgesInB.has(a2E));
      assert.ok(edgesInB.has(a2F));
    });

    it('should be memoized', assertIsMemoized(Graph.addEdge));
  });
});
