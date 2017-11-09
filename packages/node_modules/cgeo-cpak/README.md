cgeo-cpak
=========

[![npm version](https://img.shields.io/npm/v/cgeo-cpak.svg)](https://www.npmjs.com/package/cgeo-cpak)

Adds [cpak](https://github.com/charto/cpak) export support to [cgeo](https://github.com/charto/cgeo).

This augments all geometry types (in a TypeScript-friendly way)
with a `toCpak` method returning a string.

Additionally, the static method `Geometry.fromCpak` takes a string
and returns the appropriate geometry object.

Usage
-----

```TypeScript
import * as cgeo from 'cgeo';
import 'cgeo-wkt';
import 'cgeo-cpak';

const geom = Geometry.fromCpak('');

console.log(geom.toWKT());
```

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/cgeo-cpak/master/LICENSE)

Copyright (c) 2017 BusFaster Ltd
