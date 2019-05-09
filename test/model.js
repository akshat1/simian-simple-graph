import assert from 'assert';
import { Edge, nodesFromEdges } from '../src/model';

describe('model', function() {
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
