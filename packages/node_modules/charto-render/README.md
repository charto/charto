charto-render
=============

[![npm version](https://img.shields.io/npm/v/charto-render.svg)](https://www.npmjs.com/package/charto-render)

This is a renderer for geographic data.

Currently it only supports rendering on a canvas, useful with `charto-leaflet` or OpenLayers.

Contains the `CanvasRenderer` class with a `render` method taking the following parameters:

- Target canvas, a HTML `canvas` element.
- Features to render, a `LayerFeatures` object as returned from the `Layer.getLayerFeatures` method defined in `charto-model`.
- Bounding box, an instance of `BBox` defined in `charto-model`.
- Canvas tile width in pixels.
- Canvas tile height in pixels.
- Map zoom level (optional).

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/charto-render/master/LICENSE)

Copyright (c) 2017 BusFaster Ltd
