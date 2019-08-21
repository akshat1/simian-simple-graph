/**
 * @typedef {string} Node
 */

/**
 * @property {string} from
 * @property {string} to
 */
class Edge {
  /**
  * 
  * @param {string} from -
  * @param {string} to -
  */
  constructor(from, to) {
    this.from = from;
    this.to = to;
    Object.freeze(this);
  }
}


/**
 * @param {Edge} edge -
 * @returns {string} -
 */
Edge.toString = ({ from, to }) => `[Edge ${from} -> ${to}]`;

/**
 * @function
 * @static
 * @param {Edge} edge -
 * @returns {Edge} - A new edge but with directions reversed.
 */
Edge.invert = ({ from, to}) => new Edge(to, from);

module.exports = { Edge };
