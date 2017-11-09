// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { Geometry, GeometryKind, registerType } from './Geometry';
import { GeometryCollection } from './GeometryCollection';
import { Point, PointSpec, PointListSpec } from './Point';

export class MultiPoint extends GeometryCollection<Point> {

	constructor(childList: PointSpec[] | PointListSpec = []) {
		super();

		this.init(childList);
	}

	init(childList: PointSpec[] | PointListSpec = []) {
		if(childList instanceof Array) {
			for(let child of childList) {
				if(child instanceof Point) this.addChild(child);
				else this.addChild(new Point(child));
			}
		} else {
			const x = childList.x || [];
			const y = childList.y || [];
			const z = childList.z || [];
			const m = childList.m || [];
			const count = x.length;

			for(let num = 0; num < count; ++num) {
				this.addChild(new Point(x[num], y[num], z[num], m[num]));
			}
		}
	}

}

registerType(MultiPoint, GeometryKind.multiPoint);
