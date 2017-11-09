// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { GeometryKind, registerType } from './Geometry';
import { PointSpec, PointListSpec } from './Point';
import { Curve, CurveSpec } from './Curve';
import { LineString } from './LineString';

export class CircularString extends Curve {

	constructor(spec: PointSpec[] | PointListSpec = []) {
		super();

		LineString.prototype.init.call(this, spec);
	}

	hasZ() { return(this.z !== void 0); }
	hasM() { return(this.m !== void 0); }

	x: number[];
	y: number[];
	z?: number[];
	m?: number[];

}

registerType(CircularString, GeometryKind.circularString);
