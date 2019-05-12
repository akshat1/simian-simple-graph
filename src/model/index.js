import Edge from './Edge';
import Graph, { getEdgesStartingFrom, getSubTree, nodesFromEdges } from './Graph';

/**
 * At the moment, a Node is just a string.
 * @typedef {string} Node
 */

export const reverseEdges = ({ edges }) => Array.from(edges).map(({ from, to }) => new Edge(to, from));

export {
  Edge,
  getEdgesStartingFrom,
  getSubTree,
  Graph,
  nodesFromEdges,
}
