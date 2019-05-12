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
function Graph (edges) {
  /** @property {Set.<Edge>} - Edges which comprise the graph. */
  this.edges = new Set(edges);
  /** @property {Set.<Node>} - Nodes of the graph, inferred fromt he edges. */
  this.nodes = nodesFromEdges(edges);
}

export default Graph;
