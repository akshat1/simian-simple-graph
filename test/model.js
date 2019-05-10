import assert from 'assert';
import { Edge, nodesFromEdges, Graph } from '../src/model';

describe('model', function() {
  describe('Edge', function() {
    it('should construct an edge', function() {
      const edge = new Edge('a', 'b');
      assert.deepEqual(edge, { from: 'a', to: 'b' });
    });
  });

  describe('Graph', function() {
    it('should construct a graph', function() {
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
  })
  describe('nodesFromEdges', function() {
    it('should return a set comprised of nodes from supplied edges', function() {
      const edges = [
        new Edge('a', 'b'),
        new Edge('a', 'c'),
        new Edge('d', 'e'),
        new Edge('b', 'f'),
      ];
      
      assert.deepEqual(nodesFromEdges(edges), new Set(['a', 'b', 'c', 'd', 'e', 'f']));
    });
  })
});
