// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { Geometry, GeometryKind, registerType } from './Geometry';
import { GeometryCollection } from './GeometryCollection';
import { LineString } from './LineString';
import { CurveSpec } from './Curve';
import { initCurves } from './MultiCurve';

export type PolygonSpec = CurveSpec | (CurveSpec | LineString | null | undefined)[];

// GeometryCollection compatibility allows calling methods from MultiCurve.
export class Polygon extends Geometry implements GeometryCollection<LineString | null | undefined> {

	constructor(ringList: PolygonSpec = []) {
		super();

		initCurves(this, ringList, true, false);
	}

	addChild(child: LineString) { this.childList.push(child); }

	childList: ( LineString | null | undefined )[] = [];

}

registerType(Polygon, GeometryKind.polygon);
