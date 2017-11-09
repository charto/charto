// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { GeometryKind, registerType } from './Geometry';
import { GeometryCollection } from './GeometryCollection';
import { Curve, CurveSpec } from './Curve';
import { PointSpec, PointListSpec } from './Point';
import { CompoundCurve } from './CompoundCurve';
import { LineString } from './LineString';

export interface MultiCurveSpec extends Array<CurveSpec | MultiCurveSpec | Curve> {}

export function initCurves<Member extends Curve | null | undefined>(
	target: GeometryCollection<Member>,
	specList: CurveSpec | (CurveSpec | MultiCurveSpec | Member)[],
	allowNull?: boolean,
	allowCompound = true
) {
	const msg = 'Geometry cannot hold arbitrary curves';

	if(!(specList instanceof Array)) specList = [ specList ];

	if(typeof((specList as PointSpec[])[0]) == 'object' && typeof((specList as PointSpec[])[0].x) == 'number') {
		target.addChild(new LineString(specList as CurveSpec) as Curve as Member);
		return;
	}

	for(let spec of specList) {
		if(spec instanceof Curve) {
			if(!(allowCompound || spec instanceof LineString)) throw(new Error(msg));
			target.addChild(spec as Curve as Member);
		} else if((spec as PointListSpec).x instanceof Array || (typeof((spec as PointSpec[])[0]) == 'object' && typeof((spec as PointSpec[])[0].x) == 'number')) {
			target.addChild(new LineString(spec as CurveSpec) as Curve as Member);
		} else if(spec) {
			if(!allowCompound) throw(new Error(msg));
			target.addChild(new CompoundCurve(spec as MultiCurveSpec) as Curve as Member);
		} else if(allowNull) {
			target.addChild(spec as any);
		}
        }
}

export class MultiCurve<Member extends Curve = Curve> extends GeometryCollection<Member> {

	constructor(childList: CurveSpec | MultiCurveSpec = []) {
		super();

		initCurves(this, childList);
	}

}

registerType(MultiCurve, GeometryKind.multiCurve);
