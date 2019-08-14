const instances = [];

/**
 * @typedef {Object} Edge
 * @property {string} from -
 * @property {string} to -
 * @property {string} id -
 */

/**
 * Creates a new instance and stores it to instance pool.
 * @param {string} from -
 * @param {string} to -
 * @returns {Edge} -
 */
function newInstance(from, to) {
  const instance = {
    from,
    to,
    id: `${from}->${to}`,
  };

  Object.freeze(instance);

  return instance;
}

/**
 * Finds an existing instance of an Edge.
 * @param {string} from -
 * @param {string} to -
 * @returns {Edge} -
 */
function findInstance(from, to) {
  return instances.find(i => i.from === from && i.to === to);
}

/**
 * Finds an existing instance of an Edge. If no instance exists, creates a new one.
 * @param {string} from -
 * @param {string} to -
 * @returns {Edge} -
 */
function makeEdge(from, to) {
  let instance = findInstance(from, to);
  if (!instance) {
    instance = newInstance(from, to);
    instances.push(instance);
  }

  return instance;
}

function toString({ from, to }) {
  return `[Edge ${from} -> ${to}]`;
}

module.exports = {
  makeEdge,
  toString,
};
