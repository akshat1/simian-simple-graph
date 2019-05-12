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

/**
 * Returns edges that start from the indicated node.
 *
 * @function
 * @private
 * @param {Node} node - starting node.
 * @param {Edge[]} edges - the edhes to filter.
 * @returns {Edge[]} - filtered edges.
 */
export const getEdgesStartingFrom = (node, edges) => edges.filter(e => e.from === node);

/**
 * @function
 * @param {Node} root - root
 * @param {Graph} graph - the graph to extract the tree from.
 * @returns {Graph} - a tree extracted from the graph, rooted at node.
 */
export const getSubTree = (root, graph) => {
  const nodesToLookFor = [root];
  const processedNodes = {};
  const subTreeEdges = [];
  let newRoot;
  while(newRoot = nodesToLookFor.pop()) {  // eslint-disable-line no-cond-assign
    if (processedNodes[newRoot]) {
      continue;
    }

    const newEdges = getEdgesStartingFrom(newRoot, Array.from(graph.edges));
    processedNodes[newRoot] = true;
    subTreeEdges.push(...newEdges);
    nodesToLookFor.push(...newEdges.map(e => e.to));
  }

  const newTree = new Graph(subTreeEdges);

  return newTree;
}


export default Graph;
