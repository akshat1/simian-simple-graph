import assert from 'assert';
import { Edge, Graph } from '../src/model';
import toDot from '../src/to-dot';

describe('toDot', function() {
  it('should return DOT representation of the graph', function() {
    const g = new Graph([
      new Edge('a', 'b'),
      new Edge('a', 'c'),
      new Edge('a', 'd'),
      new Edge('b', 'c'),
      new Edge('c', 'e'),
    ]);
    
    const expectedValue = [
      'digraph G {',
      ...[
        '"a" [label="a"]',
        '"b" [label="b"]',
        '"c" [label="c"]',
        '"d" [label="d"]',
        '"e" [label="e"]',
      ].sort(),
      ...[
        '"a" -> "b"',
        '"a" -> "c"',
        '"a" -> "d"',
        '"b" -> "c"',
        '"c" -> "e"',
      ].sort(),
      '}',
    ].join('\n');
    const actualValue = toDot(g);
    assert.equal(actualValue, expectedValue);
  });
});
