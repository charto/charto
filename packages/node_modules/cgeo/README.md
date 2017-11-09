cgeo
====

[![npm version](https://img.shields.io/npm/v/cgeo.svg)](https://www.npmjs.com/package/cgeo)

This is a collection of geometry / geography data types.
They're very lightweight and perfect for holding data from a spatial database.

Additional features such as reading / writing different formats or rendering
can be added through mixins / module augmentation from add-on packages.
All classes are carefully written in TypeScript so that the add-ons
can extend all classes while remaining fully typed.

Compatible add-ons:

- [cgeo-wkb](https://github.com/charto/cgeo-wkb)
- [cgeo-wkt](https://github.com/charto/cgeo-wkt)
- [cgeo-cpak](https://github.com/charto/cgeo-cpak)

The supported data types are as follows (nesting indicates inheritance):

- *Geometry*
  - [Point](#point)
  - *Curve*
    - [LineString](#linestring)
    - CircularString
    - CompoundCurve
  - *Surface*
    - Polygon
    - CurvePolygon
  - GeometryCollection
    - MultiPoint
    - MultiCurve
      - MultiLineString
    - MultiSurface
      - MultiPolygon

Usage
=====

Point
-----

An object with 4 properties:

- `x` (default 0)
- `y` (default 0)
- `z` (optional)
- `m` (optional)

It can be initialized in multiple ways:

```TypeScript
let a = new Point(1, 2);
let b = new Point(1, 2, 3, 4);
let c = new Point({ x: 1, y: 2, z: 3, m: 4 });
let d = new Point(b);
```

The above initialize `b`, `c` and `d` with the same contents.
`a` only has fields `x` and `y`.

LineString
----------

Represents a polyline with coordinates stored in separate arrays for each dimension:
- `x` (array of numbers, empty by default)
- `y` (array of numbers, empty by default)
- `z` (optional)
- `m` (optional)

This representation was chosen due to a compact in-memory representation
(typically only two arrays, `x` and `y`) that also supports additional
dimensions without complicating code that only uses the first two.

It can be initialized in two ways:

```TypeScript
let a = new LineString({ x: [ 1, 3 ], y: [ 2, 4 ] });
let b = new LineString([ { x: 1, y: 2 }, { x: 2, y: 4 } ]);
```

The above initializes `a` and `b` with equivalent contents, but only `a`
directly references the input arrays without copying data.

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/cgeo/master/LICENSE)

Copyright (c) 2017 BusFaster Ltd
