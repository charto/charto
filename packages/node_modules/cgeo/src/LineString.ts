// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { GeometryKind, registerType } from './Geometry';
import { PointSpec, PointListSpec } from './Point';
import { Curve, CurveSpec } from './Curve';

export class LineString extends Curve {

	constructor(spec: PointSpec[] | PointListSpec = []) {
		super();

		this.init(spec);
	}

	init(spec: PointSpec[] | PointListSpec) {
		if(spec instanceof Array) {
			const count = spec.length;
			let pt: PointSpec;

			this.x = [];
			this.y = [];

			for(let num = 0; num < count; ++num) {
				pt = spec[num];
				this.x[num] = pt.x || 0;
				this.y[num] = pt.y || 0;
				if(pt.z !== void 0) (this.z || (this.z = []))[num] = pt.z;
				if(pt.m !== void 0) (this.m || (this.m = []))[num] = pt.m;
			}
		} else {
			this.x = spec.x || [];
			this.y = spec.y || [];
			if(spec.z !== void 0) this.z = spec.z;
			if(spec.m !== void 0) this.m = spec.m;
		}
	}

	hasZ() { return(this.z !== void 0); }
	hasM() { return(this.m !== void 0); }

	x: number[];
	y: number[];
	z?: number[];
	m?: number[];

}

registerType(LineString, GeometryKind.lineString);
