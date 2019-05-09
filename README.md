# Simian Simple Graph

This is a pretty basic DAG structure I cooked up for a particular project.

## Installation
```
npm i --save simian-simple-graph
```

## Usage
```js
import {
  Edge,
  Graph,
  toDot,
  getSubTree
} from 'simian-simple-graph';

const g0 = new Graph([
  new Edge('a', 'b'), // a -> b
  new Edge('a', 'c'), // a -> c
  new Edge('a', 'd'), // a -> d
  new Edge('d', 'e'), // d -> e
  new Edge('d', 'f'), // d -> f
]);

const g1 = getSubTree(g0, 'd'); // d -> e, d -> f

const dotOutput = toDot(g0); // produces string in DOT syntax
```
