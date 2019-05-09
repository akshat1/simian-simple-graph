import { Graph } from './model';

export const getEdgesFrom = (node, edges) => edges.filter(e => e.from === node);

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

    const newEdges = getEdgesFrom(newRoot, graph.edges);
    processedNodes[newRoot] = true;
    subTreeEdges.push(...newEdges);
    nodesToLookFor.push(...newEdges.map(e => e.to));
  }

  const newTree = Graph(subTreeEdges);

  return newTree;
}
