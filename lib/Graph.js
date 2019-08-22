const { Set: ISet } = require('immutable');
const { Edge } = require('./Edge');
const { Resolver } = require('./resolver');
const { memoize } = require('./memoize');
const md5 = require('blueimp-md5');

/**
 * A directed Graph. Expected to be acyclic but won't throw an error immediately if you create a
 * cycle (but any of the Graph static methods might when they are called on cyclic graphs).
 *
 * @property {string} id - A string derived from constituent edges. This servers as a cache key
 *           when functions are memoized.
 * @property {Set<Edge>} edges - An immutable (from immutable.js) Set.
 */
class Graph {
  /**
   * @param {Iterable<Edge>} edges -
   */
  constructor(edges) {
    this.edges = ISet.of(...edges);
    this.id = md5(`${Array.from(edges).map(e => Edge.toString(e)).sort().join(':#SSG#:')}`, null, true);
    Object.freeze(this);
  }
}

/**
 * Returns a new graph (unless a similar one was created before), containing all the edges of the
 * given graph + the new edge.
 *
 * @function
 * @static
 * @param {Graph} g -
 * @param {...Edge} edges -
 * @returns {Graph} - a new graph.
 */
Graph.addEdge = memoize(function(g, ...edges) {
  if (edges.length > 1) {
    return new Graph(Graph.getEdges(g).union(new ISet(edges)));
  } else if (edges.length === 1) {
    return new Graph(Graph.getEdges(g).add(edges[0]));
  }

  /* istanbul ignore next */
  return g;
}, Resolver.graphAndNodes);

/**
 * @function
 * @static
 * @param {Graph} g -
 * @returns {Set<Edge>} -
*/
Graph.getEdges = g => g.edges;

/**
 * @function
 * @static
 * @param {Graph} g -
 * @returns {Set<Node>} -
 */
Graph.getNodes = memoize(function(g) {
  const nodes = [];
  for (let {from, to} of Graph.getEdges(g)) {
    nodes.push(from, to);
  }

  return new ISet(nodes);
}, Resolver.graph);

/**
 * Get edges beginning from `node` in `graph`.
 *
 * @function
 * @static
 * @param {Graph} g -
 * @param {Node} node -
 * @returns {Set<Edge>} -
 */
Graph.getOutgoingEdges = memoize(function(g, node) {
  return Graph.getEdges(g).filter(({ from }) => from === node);
}, Resolver.graphAndNodes);

/**
 * Get the subtree of Graph g, rooted at Node node.
 * 
 * @function
 * @static
 * @param {Graph} g -
 * @param {Node} node -
 */
Graph.getSubTree = memoize(function(g, node, seen = new Set()) {
  // default value of seen is a mutable Set on purpose (don't need mutability here).
  if (seen.has(node)) {
    throw new Error(`Circular reference detected at ${node}`);
  }

  seen.add(node);
  const edges = [];
  // all edges in g starting at node
  for (let e of Graph.getOutgoingEdges(g, node)) {
    // collect the edge e
    edges.push(e);
    // collect the edges in the subtree of g rooted at e.to
    edges.push(...Graph.getEdges(Graph.getSubTree(g, e.to)));
  }

  // a new graph from all the edges we created.
  return new Graph(edges);
}, Resolver.graphAndNodes);

/**
 * Returns all the nodes that descend from this node.
 * @function
 * @static
 * @param {Graph} graph -
 * @param {Node} node -
 * @returns {ISet<Node>} -
 */
Graph.getDescendents = memoize(function(g, node) {
  return Graph.getNodes(Graph.getSubTree(g, node)).filter(n => n !== node);
}, Resolver.graphAndNodes);

/**
 * @function
 * @static
 * @param {Graph} graph -
 * @returns {Graph} - a copy of `graph` but with all edge directions inverted.
 */
Graph.invert = memoize(function(g) {
  // g.edges has a single value, which is an Array.
  const edges = Graph.getEdges(g);
  const invertedEdges = edges.map(Edge.invert);
  return new Graph(invertedEdges);
}, Resolver.graph);

/**
 * Returns all the ancestors of this node.
 * @function
 * @static
 * @param {Graph} g -
 * @param {Node} node -
 * @returns {ISet<Node>} -
 */
Graph.getAncestors = memoize(function(g, node){
  return Graph.getDescendents(Graph.invert(g), node);
}, Resolver.graphAndNodes);

/**
 * @function
 * @static
 * @param {Graph} g -
 * @returns {string} -
 */
Graph.toString = memoize(function(g) {
  return `[Graph [${Graph.getEdges(g).map(e => Edge.toString(e)).toArray().sort().join(', ')}]]`;
}, Resolver.graph);

/**
 * Walk the subtree(g, node) level by level. Execute supplied function `fn` for each node as we go
 * along. Because edges are stored as a set, there is no guaranteed order ot traversal. However you
 * may supply an optional function  to sort the edges for each level before they are processed.
 *
 * @param {Graph} g -
 * @param {Node} node -
 * @param {Function} fn - Function of the form `fn(Node: n, number: depth)` that will be called for each node in the subtree.
 * @param {Function} [sortEdgesForLevel] - Function of the form `Edge[]: sortEdgesForLevel(Edge[]: edges, number: Depth)`
 */
Graph.breadthFirst = function(g, node, fn, sortEdgesForLevel) {
  const seen = new Set();
  const queue = [node];
  fn(node);
  let currentNode;
  let depth = 0;
  while ((currentNode = queue.shift())) {
    let edges = Graph.getOutgoingEdges(g, currentNode);
    if (typeof sortEdgesForLevel === 'function') {
      edges = sortEdgesForLevel(edges);
    }

    for(let { to } of edges) {
      if (seen.has(to)) {
        // avoid cycles
        return;
      }

      seen.add(to);
      fn(to, depth);
      queue.push(to);
    }

    depth++;
  }
  
}

module.exports = {
  Graph
};
