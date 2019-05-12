/**
 * Edge constructor
 * @constructor
 * @param {Node} from - Origin node of the edge.
 * @param {Node} to - Target node of the edge.
 */
function Edge (from, to) { 
  /** @property {Node} - Origin node of the edge. */
  this.from = from;
  /** @property {Node} - Target node of the edge. */
  this.to = to;

  Object.freeze(this);
}

export default Edge;
