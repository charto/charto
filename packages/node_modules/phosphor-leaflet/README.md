phosphor-leaflet
================

[![npm version](https://img.shields.io/npm/v/phosphor-leaflet.svg)](https://www.npmjs.com/package/phosphor-leaflet)

`phosphor-leaflet` wraps Leaflet in a simple PhosphorJS widget. It's only a few lines of code.

Usage
-----

```TypeScript
import { Widget } from '@phosphor/widgets';
import { LeafletMap } from 'phosphor-leaflet';
import * as L from 'leaflet';

const map = new LeafletMap({
	// Leaflet map constructor options like:
	// minZoom: 3
});

// The original leaflet map object is accessible through map.l:
map.l.addLayer(L.circleMarker([0, 0]));

// The map object is a PhosphorJS widget.
Widget.attach(map, document.body);
```

The widget uses CSS class name `charto-LeafletMap`.

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/phosphor-leaflet/master/LICENSE)

Copyright (c) 2017 BusFaster Ltd
