charto-leaflet
==============

[![npm version](https://img.shields.io/npm/v/charto-leaflet.svg)](https://www.npmjs.com/package/charto-leaflet)

Provides useful classes for Leaflet.

### `Projection`

Like Leaflet's `L.Projection.LonLat` but without hard-coded bounds.
Pass an `L.Bounds` object to the constructor instead.

### `CRS`

Simple coordinate reference system making Leaflet internally use the same coordinates as the original data.
Constructor arguments:

- Coordinate reference system name string, like `EPSG:3067`. For information only, not used for anything.
- Any Leaflet projection, preferably an instance of `Projection` from this package.
- Optionally an `L.Transformation` instance for mapping between external spatial and internal pixel coordinates.
  By default, latitude is flipped.

Usage
-----

```TypeScript
import { Projection, CRS } from 'charto-leaflet';
import * as L from 'leaflet';

const JHS180 = new CRS(
	'EPSG:3067',
	new Projection(L.bounds([ -548576, 6291456 ], [ 1548576, 8388608 ]))
);

const map = L.map(document.body, {
	crs: JHS180
});
```

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/charto-leaflet/master/LICENSE)

Copyright (c) 2017 BusFaster Ltd
