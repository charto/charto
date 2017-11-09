// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { Geometry, GeometryKind, registerType } from './Geometry';
import { GeometryCollection } from './GeometryCollection';
import { MultiSurface } from './MultiSurface';
import { Polygon, PolygonSpec } from './Polygon';

export class MultiPolygon extends MultiSurface<Polygon> {

	constructor(specList: ( Polygon | PolygonSpec )[] = []) {
		super();

		this.init(specList);
	}

	init(specList: ( Polygon | PolygonSpec )[]) {
		for(let spec of specList) {
			if(spec instanceof Polygon) {
				this.childList.push(spec);
			} else {
				this.childList.push(new Polygon(spec));
			}
		}
	}

}

registerType(MultiPolygon, GeometryKind.multiPolygon);
