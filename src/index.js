import { Graph, Edge } from './model';
import { getSubTree } from './get-sub-tree';
import toDot from './to-dot';

export const reverseEdges = ({ edges }) => Array.from(edges).map(({ from, to }) => new Edge(to, from));

export {
  Edge,
  getSubTree,
  Graph,
  toDot,
};
