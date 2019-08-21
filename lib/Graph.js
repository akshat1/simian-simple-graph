const { Set: ISet } = require('immutable');
const { Edge } = require('./Edge');
const { Resolver } = require('./resolver');
const { memoize } = require('./memoize');

/**
 * A Graph, once created, is immutable.
 *
 * @property {number} id
 * @property {Set<Edge>} edges
 */
class Graph {
  /**
   * @param {Iterable<Edge>} edges -
   */
  constructor(edges) {
    this.edges = ISet.of(...edges);
    this.id = `${Array.from(edges).map(e => Edge.toString(e)).join(',')}`;
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
    return Graph.getEdges(g).union(new ISet(edges));
  } else if (edges.length === 1) {
    return new Graph(Graph.getEdges(g).add(edges[0]));
  }

  return new Graph(Graph.getEdges(g));
}, Resolver.graph);

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
  Graph.getEdges(g).forEach(({from, to}) => nodes.push(from, to));
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
}, Resolver.graphAndNode);

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
  Graph.getOutgoingEdges(g, node).forEach(e => {
    // collect the edge e
    edges.push(e);
    // collect the edges in the subtree of g rooted at e.to
    edges.push(...Graph.getEdges(Graph.getSubTree(g, e.to)));
  });
  // a new graph from all the edges we created.
  return new Graph(edges);
}, Resolver.graphAndNode);

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
}, Resolver.graphAndNode);

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
}, Resolver.graphAndNode);

/**
 * @function
 * @static
 * @param {Graph} g -
 * @returns {string} -
 */
Graph.toString = memoize(function(g) {
  return `[Graph [${Graph.getEdges(g).map(e => Edge.toString(e)).toArray().sort().join(', ')}]]`;
}, Resolver.graph);

module.exports = {
  Graph
};
