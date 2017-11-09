cgeo-wkt
========

[![npm version](https://img.shields.io/npm/v/cgeo-wkt.svg)](https://www.npmjs.com/package/cgeo-wkt)

Adds WKT export support to [cgeo](https://github.com/charto/cgeo).

This augments all geometry types (in a TypeScript-friendly way)
with a `toWKT` method returning a string.

Usage
-----

```TypeScript
import * as cgeo from 'cgeo';
import 'cgeo-wkt';

const point = new cgeo.Point(12, 34);

console.log(point.toWKT());
```

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/cgeo-wkt/master/LICENSE)

Copyright (c) 2017 BusFaster Ltd
