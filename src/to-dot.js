/**
 * @function toDOT
 * @see https://www.graphviz.org/doc/info/lang.html
 * @param {Graph} graph -
 * @returns {string} - The graph described in the DOT language.
 */
export default ({edges, nodes}) => {
  const strNodes = Array.from(nodes).map(n => `"${n}" [label="${n}"]`);
  const strEdges = edges.map(e => `"${e.from}" -> "${e.to}"`);
  return `digraph G {
    ${strNodes.join('\n')}
    ${strEdges.join('\n')}
  }`
}
