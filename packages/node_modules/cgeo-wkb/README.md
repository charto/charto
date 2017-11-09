cgeo-wkb
========

[![npm version](https://img.shields.io/npm/v/cgeo-wkb.svg)](https://www.npmjs.com/package/cgeo-wkb)

Adds WKB export support to [cgeo](https://github.com/charto/cgeo).

This augments all geometry types (in a TypeScript-friendly way)
with a `toWKB` method returning a `Uint8Array`.
The method takes an optional configuration object with the member:

- `endian`, default is `Endian.little`. See [cbin](https://github.com/charto/cbin#usage).

Additionally, the static method `Geometry.fromWKB` takes a `Uint8Array`
and returns the appropriate geometry object.

Usage
-----

```TypeScript
import * as cgeo from 'cgeo';
import 'cgeo-wkb';

const point = new cgeo.Point(12, 34);

console.log(Buffer.from(point.toWKB()).toString('hex'));
```

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/cgeo-wkb/master/LICENSE)

Copyright (c) 2017 BusFaster Ltd
