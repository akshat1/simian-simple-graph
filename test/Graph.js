const { Edge } = require('../lib/Edge');
const { Graph } = require('../lib/Graph');
const assert = require('assert');
const sinon = require('sinon');

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

  describe('breadthFirst', function() {
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

    it('should call fn for each node in the subtree', function() {
      const fn = sinon.stub();
      Graph.breadthFirst(graph, 'a', fn);

      [
        ['aa', ['a']],
        ['ab', ['a']],
        ['ac', ['a']],
        ['aba', ['a', 'ab']],
        ['abb', ['a', 'ab']],
        ['abc', ['a', 'ab']],
        ['abba', ['a', 'ab', 'abb']],
        ['abbb', ['a', 'ab', 'abb']],
        ['abbc', ['a', 'ab', 'abb']],
      ].forEach(args => assert.ok(fn.calledWithExactly(...args)));
    });

    it('should call fn for all nodes on a given depth before proceeding to the next greater depth', function() {
      const fn = sinon.stub();
      Graph.breadthFirst(graph, 'a', fn);
      let previousDepth = 0;
      for(let [, ancestors] of fn.args) {
        const currentDepth = ancestors.length;
        if (currentDepth < previousDepth) {
          assert.fail(`Encountered depth ${currentDepth} after ${previousDepth}`);
        }

        previousDepth = currentDepth;
      }
    });

    it('should silently avoid cycles', function() {
      assert.doesNotThrow(() => {
        const cyclicG = new Graph([
          new Edge('a', 'b'),
          new Edge('a', 'c'),
          new Edge('a', 'd'),
          new Edge('b', 'e'),
          new Edge('e', 'a'),
        ]);
  
        const fn = sinon.stub();
        Graph.breadthFirst(cyclicG, 'a', fn);
      });
    });

    it('should call fn for a given level on sorted nodes if a sortEdgesForLevel function is provided', function() {
      // A single level for simplicity
      const edges = [
        new Edge('z', 'a'),
        new Edge('z', 'b'),
        new Edge('z', 'c'),
        new Edge('z', 'd'),
        new Edge('z', 'e'),
      ];
      const simpleG = new Graph(edges);

      const fn = sinon.stub();
      const sorter = sinon.stub().returns(edges.reverse());
      Graph.breadthFirst(simpleG, 'z', fn, sorter);
      assert.deepEqual(
        fn.args,
        [
          ['z', []],
          ['e', ['z']],
          ['d', ['z']],
          ['c', ['z']],
          ['b', ['z']],
          ['a', ['z']],
        ],
      )
    });
  });

  describe('depthFirst', function() {
    it('should call fn for each node in the subtree', function() {
      const graph = new Graph([
        new Edge('a', 'aa'),
        new Edge('a', 'ab'),
        new Edge('a', 'ac'),
        new Edge('aa', 'aaa'),
        new Edge('aa', 'aab'),
        new Edge('aa', 'aac'),
        new Edge('aab', 'aaba'),
        new Edge('ab', 'aba'),
        new Edge('ab', 'abb'),
        new Edge('ac', 'aca'),
        new Edge('ac', 'acb'),
        new Edge('ac', 'acc'),
        new Edge('ac', 'acd'),
      ]);
      const fn = sinon.stub();
      const sorter = nodes => nodes.sort();

      Graph.depthFirst(graph, 'a', fn, sorter);

      assert.deepEqual(
        fn.args,
        [
          ['a', []],
          ['aa', ['a']],
          ['aaa', ['a', 'aa']],
          ['aab', ['a', 'aa']],
          ['aaba', ['a', 'aa', 'aab']],
          ['aac', ['a', 'aa']],
          ['ab', ['a']],
          ['abb', ['a', 'ab']],
          ['aba', ['a', 'ab']],
          ['ac', ['a']],
          ['aca', ['a', 'ac']],
          ['acb', ['a', 'ac']],
          ['acc', ['a', 'ac']],
          ['acd', ['a', 'ac']],
        ]
      );
    });

    it('should silently avoid cycles', () => {
      assert.doesNotThrow(() => {
        const cyclicG = new Graph([
          new Edge('a', 'b'),
          new Edge('a', 'c'),
          new Edge('a', 'd'),
          new Edge('b', 'e'),
          new Edge('e', 'a'),
        ]);
  
        const fn = sinon.stub();
        Graph.depthFirst(cyclicG, 'a', fn);
      });
    });
  });
});
