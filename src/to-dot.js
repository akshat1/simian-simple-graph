/**
 * @function toDOT
 * @see https://www.graphviz.org/doc/info/lang.html
 * @param {Graph} graph -
 * @returns {string} - The graph described in the DOT language.
 */
export default ({edges, nodes}) => {
  // we sort edges only so that we can unit test the output.
  const strNodes = Array.from(nodes).map(n => `"${n}" [label="${n}"]`).sort();
  const strEdges = Array.from(edges).map(e => `"${e.from}" -> "${e.to}"`).sort();
  return [
    'digraph G {',
    strNodes.join('\n'),
    strEdges.join('\n'),
    '}',
  ].join('\n');
}
