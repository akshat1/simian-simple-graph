/**
 * At the moment, a Node is just a string.
 * @typedef {string} Node
 */

/**
 * Edge constructor
 * @constructor
 * @param {Node} from - Origin node of the edge.
 * @param {Node} to - Target node of the edge.
 */
export function Edge (from, to) { 
  /** @property {Node} - Origin node of the edge. */
  this.from = from;
  /** @property {Node} - Target node of the edge. */
  this.to = to;
}

/**
 * Given an Iterable of Edges, return the set of Nodes.
 * @function
 * @param {Iterable.<Edge>} edges -
 * @returns {Set.<Node>} -
 */
export const nodesFromEdges = edges => {
  const nodes = new Set();
  Array.from(edges).forEach(({ from, to }) => {
    nodes.add(from);
    nodes.add(to);
  });
  return nodes;
};

/**
 * Given the edges, constructs a Graph.
 * @constructor
 * @param {Iterable.<Edge>} edges - Edges which comprise the graph.
 */
export function Graph (edges) {
  /** @property {Set.<Edge>} - Edges which comprise the graph. */
  this.edges = new Set(edges);
  /** @property {Set.<Node>} - Nodes of the graph, inferred fromt he edges. */
  this.nodes = nodesFromEdges(edges);
}
