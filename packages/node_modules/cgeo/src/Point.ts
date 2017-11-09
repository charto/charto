// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { Geometry, GeometryKind, registerType } from './Geometry';

export interface PointSpec {
	x?: number;
	y?: number;
	z?: number;
	m?: number;
}

export interface PointListSpec {
	x?: number[];
	y?: number[];
	z?: number[];
	m?: number[];
}

export class Point extends Geometry implements PointSpec {

	constructor(x?: number | PointSpec, y?: number, z?: number, m?: number) {
		super();

		if(typeof(x) == 'object' && x) {
			({ y, z, m } = x);
			x = x.x;
		}

		this.x = x || 0;
		this.y = y || 0;
		if(z !== void 0) this.z = z;
		if(m !== void 0) this.m = m;
	}

	hasZ() { return(this.z !== void 0); }
	hasM() { return(this.m !== void 0); }

	x: number;
	y: number;
	z?: number;
	m?: number;

}

registerType(Point, GeometryKind.point);
