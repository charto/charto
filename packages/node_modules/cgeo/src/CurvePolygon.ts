// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { Geometry, GeometryKind, registerType } from './Geometry';
import { GeometryCollection } from './GeometryCollection';
import { Curve, CurveSpec } from './Curve';
import { MultiCurveSpec, initCurves } from './MultiCurve';

// GeometryCollection compatibility allows calling methods from MultiCurve.
export class CurvePolygon extends Geometry implements GeometryCollection<Curve | null | undefined> {

	constructor(ringList: CurveSpec | (CurveSpec | MultiCurveSpec | Curve | null | undefined)[] = []) {
		super();

		initCurves(this, ringList, true);
	}

	addChild(child: Curve) { this.childList.push(child); }

	childList: ( Curve | null | undefined )[] = [];

}

registerType(CurvePolygon, GeometryKind.curvePolygon);
