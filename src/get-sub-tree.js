import { Graph } from './model';

/**
 * Returns edges that start from the indicated node.
 *
 * @function
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
