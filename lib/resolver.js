/**
 * Collection of Resolver functions for different situations.
 *
 * @enum {function}
 */
const Resolver = {
  graph: g => g.id,
  graphAndNode: (g, node) => `${g.id}-${node}`,
};

module.exports = { Resolver };
