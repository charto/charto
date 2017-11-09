// This file is part of charto-leaflet, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as L from 'leaflet';

export const BaseCRS = (() => {}) as any as { new(): L.CRS };
BaseCRS.prototype = L.CRS;

/** Custom CRS using zoom levels configured in the background map. */

export class CRS extends BaseCRS {

	constructor(
		public code: string,
		public projection: L.Projection,
		/** Default: ensure longitude is positive and flip latitude. */
		public transformation = new L.Transformation(
			1,
			-Math.min(0, projection.bounds.min!.x),
			-1,
			projection.bounds.max!.y
		)
	) {
		super();

		// Get maximum dimension of projection bounds and divide by tile size in pixels.
		const size = projection.bounds.getSize();
		this.range = Math.max(size.x, size.y) / 256;
	}

	distance(ll1: any, ll2: any) {
		const dlat = ll2.lat - ll1.lat;
		const dlon = ll2.lng - ll1.lng;

		return(Math.sqrt(dlat*dlat + dlon*dlon));
	}

	scale(zoom: number) {
		return((1 << zoom) / this.range);
	}

	/** Needed for zooming to box by shift-dragging. */

	zoom(scale: number) {
		return(Math.log(scale * this.range) / Math.LN2);
	}

	public range: number;

}
