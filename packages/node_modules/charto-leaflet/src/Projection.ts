// This file is part of charto-leaflet, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as L from 'leaflet';

/** Custom projection using pixels as map units.
  * Similar to L.Projection.LonLat but without hard-coded bounds. */

export class Projection implements L.Projection {

	constructor(public bounds: L.Bounds) {}

	project(ll: L.LatLng) {
		return(new L.Point(ll.lng, ll.lat));
	}

	unproject(xy: L.Point) {
		return(new L.LatLng(xy.y, xy.x));
	}

}
