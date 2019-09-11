/**
 * Collection of Resolver functions for different situations.
 *
 * @enum {function}
 */
const Resolver = {
  graph: g => g.id,
  graphAndNodes: (g, ...nodes) => `${g.id}-${nodes.join(':')}`,
};

module.exports = { Resolver };
