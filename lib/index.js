// TODO: Make Graph object immutable, then memoize functions.

const Edge = require('./Edge');

/**
 * @constructor
 * @param {Iterable<Edge>} [edges=[]] -
 */
function Graph(edges) {
  this._edges = new Set(edges);
}

Graph.prototype.toString = function toString() {
  return `[Graph [${Array.from(this._edges).map(e => Edge.toString(e)).sort().join(', ')}]]`;
}

/**
 * Adds new edges to the graph while ignoring duplicate edges.
 * @static
 * @param {Graph} graph - The graph to add the edge to.
 * @param {...Edge} edges - The edges to be added.
 */
Graph.addEdge = function addEdge(graph, ...edges) {
  edges.forEach(e => graph._edges.add(e));
}

/**
 * @static
 * @param {Graph} graph -
 * @returns {Set<Edge>} - All the edges in the graph.
 */
Graph.getEdges = function getEdges(graph) {
  return new Set(graph._edges);
}

/**
 * @static
 * @param {Graph} graph -
 * @returns {Set<Node>} - nodes in the graph.
 */
Graph.getNodes = function getNodes(graph) {
  const nodes = new Set();
  for(let edge of Graph.getEdges(graph)) {
    nodes.add(edge.from);
    nodes.add(edge.to);
  }
  return nodes;
}

// eslint-disable-next-line valid-jsdoc
/**
 * @static
 * @param {Graph} graph -
 * @param {Node} root - The node to get the subtree of.
 * @returns {Graph} - Subtree of `graph` rooted at `root`.
 */
Graph.getSubTree = function getSubTree(graph, root, seenNodes = new Set()) {
  if (seenNodes.has(root)) {
    throw new Error(`Circular dependency detected around ${root}`)
  } else {
    seenNodes.add(root);
  }

  const subTree = new Graph();
  const outgoing = Graph.getOutgoingEdges(graph, root);
  outgoing.forEach(function (e) {
    const subSubTree = Graph.getSubTree(graph, e.to);
    Graph.addEdge(subTree, e, ...Graph.getEdges(subSubTree).values());
  });

  return subTree;
}

/**
 * Get edges beginning from `node` in `graph`.
 * @static
 * @param {Graph} graph -
 * @param {Node} node -
 * @returns {Set<Edge>} -
 */
Graph.getOutgoingEdges = function getOutgoingEdges(graph, node) {
  const result = new Set();
  Graph
    .getEdges(graph)
    .forEach(function (e){
      if (e.from === node) {
        result.add(e);
      }
    });
  return result;
}

/**
 * Returns all the nodes that descend from this node.
 * @static
 * @param {Graph} graph -
 * @param {Node} node -
 * @returns {Set<Node>} -
 */
Graph.getDescendents = function getDescendents(graph, node) {
  const nodes = Graph.getNodes(Graph.getSubTree(graph, node));
  nodes.delete(node);
  return nodes;
}

/**
 * @param {Graph} graph -
 * @returns {Graph} - a copy of `graph` but with all edge directions inverted.
 */
Graph.invert = function invert(graph) {
  const iGraph = new Graph();
  Graph
    .getEdges(graph)
    .forEach(({from, to}) =>
      Graph.addEdge(iGraph, Edge.makeEdge(to, from))
    );
  return iGraph;
}

/**
 * Returns all the ancestors of this node.
 * @param {Graph} graph -
 * @param {Node} node -
 * @returns {Set<Node>} -
 */
Graph.getAncestors = function getAncestors(graph, node) {
  return Graph.getDescendents(Graph.invert(graph), node);
}

Graph.toString = function toString(graph) {
  return graph.toString();
}

module.exports = {
  Edge,
  Graph,
};
